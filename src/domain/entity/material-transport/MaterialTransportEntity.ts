import MaterialTransportProps from '../../interfaces/props/MaterialTransportProps'
import { ChangeErrorFields, ErrorMessages, InvoiceStatus, Reference } from '../../types'
import AbstratcEntity from '../AbstratcEntity'
import MaterialEntity from '../material/MaterialEntity'
import { TransportVehicleEntity } from '../transport-vehicle/TransportVehicleEntity'
import WorkRoutesEntity from '../work-routes/WorkRoutesEntity'
import MaterialTransportDto from './MaterialTransportDto'

export class MaterialTransportEntity extends AbstratcEntity {
    private _workRoutes: WorkRoutesEntity
    private _transportVehicle: TransportVehicleEntity
    private _material: MaterialEntity

    private _value: number
    private _isReferenceCapacity: boolean
    private _quantity: number
    private _deliveryPicket: string
    private _totalPickets: number
    private _distanceTraveledWithinTheWork: number
    private _observation: string

    private _invoiceId: number
    private _invoiceStatus: InvoiceStatus
    private _workId: string

    public dtoToEntity(data: MaterialTransportDto): MaterialTransportEntity {
        let totalValue = 0
        let displacementFloat = +data.workRoutes.km / 100
        let unitCostOfTheRouteFloat = +data.workRoutes.value / 100
        let quantityFloat = +data.quantity / 100
        let dmtPicketTotal = +data.totalPickets * 20 //dmtPicketTotal em METROS / 1000 para converter em KM
        let extraDMT = +dmtPicketTotal / 1000
        let totalKm = +displacementFloat + extraDMT
        let capacityFloat = data.transportVehicle.capacity / 100

        if (data.workRoutes.isFixedValue) {
            totalValue = +data.workRoutes.value
        }

        if (
            !data.workRoutes.isFixedValue &&
            data.material.referenceMaterialCalculation === Reference.VOLUME
        ) {
            let costCapacity = unitCostOfTheRouteFloat * capacityFloat
            totalValue = parseInt((parseFloat(costCapacity.toFixed(3)) * totalKm).toFixed(2).replace('.', ''))
        }

        if (
            !data.workRoutes.isFixedValue &&
            data.material.referenceMaterialCalculation === Reference.WEIGHT
        ) {
            let costDisplacement = unitCostOfTheRouteFloat * quantityFloat
            totalValue = parseInt(
                (parseFloat(costDisplacement.toFixed(3)) * totalKm).toFixed(2).replace('.', '')
            )
        }

        this._quantity = +data.quantity
        if (data.material.referenceMaterialCalculation === Reference.VOLUME) {
            this._quantity = +data.transportVehicle.capacity
        }

        this._distanceTraveledWithinTheWork = parseInt(extraDMT.toFixed(2).replace('.', ''))

        this._isReferenceCapacity = data.material.referenceMaterialCalculation === Reference.VOLUME
        this._deliveryPicket = data.deliveryPicket
        this._workRoutes = new WorkRoutesEntity().dtoToEntity(data.workRoutes)
        this._transportVehicle = new TransportVehicleEntity().dtoToEntity(data.transportVehicle)
        this._material = new MaterialEntity().dtoToEntity(data.material)
        this._value = totalValue
        this._totalPickets = +data.totalPickets
        this._observation = data.observation
        this._workId = data.workId
        this.userId = data.userId
        this.enterpriseId = data.enterpriseId
        this.id = data.id
        return this
    }

    public modelToEntity(data: MaterialTransportProps): MaterialTransportEntity {
        this._workRoutes = new WorkRoutesEntity().modelToEntity(data.route)
        this._transportVehicle = new TransportVehicleEntity().modelToEntity(data.transportVehicle)
        this._material = new MaterialEntity().modelToEntity(data.material)

        this._value = +data.value
        this._isReferenceCapacity = data.isReferenceCapacity
        this._quantity = +data.quantity
        this._deliveryPicket = data.deliveryPicket ?? ''
        this._totalPickets = +data.totalPickets
        this._distanceTraveledWithinTheWork = +data.distanceTraveledWithinTheWork
        this._observation = data.observation ?? ''
        this._invoiceId = data.invoiceId
        this._invoiceStatus = data.invoiceStatus as InvoiceStatus
        this._workId = data.workId
        this.serverId = data.serverId
        this.userId = data.userId
        this.userAction = data.userAction
        this.enterpriseId = data.enterpriseId
        this.isValid = data.isValid
        this.id = data.id
        this.createdAt = Number(data.createdAt)
        this.updatedAt = Number(data.updatedAt)
        return this
    }

    validate(changeErrorFields: ChangeErrorFields) {
        console.log('validated entity [MaterialTransportEntity]')
        let errorMessages: { field: string; message: string }[] = []

        const addError = (field: string, message: string) => {
            errorMessages.push({ field, message })
            changeErrorFields(field)(message)
        }

        if (!this._workId) {
            addError('workId', 'Work validation failed')
        }

        if (!this._value || this._value == 0) {
            addError('value', 'Preencha o campo obrigatório')
        }

        if (
            (!this._quantity && !this.isReferenceCapacity) ||
            (this._quantity == 0 && !this.isReferenceCapacity)
        ) {
            addError('quantity', 'Preencha o campo obrigatório')
        }

        if (this._totalPickets === undefined && this.totalPickets === null && this.isReferenceCapacity) {
            addError('totalPickets', 'Preencha o campo obrigatório')
        }

        if (
            this._distanceTraveledWithinTheWork === undefined &&
            this._distanceTraveledWithinTheWork === null &&
            this.isReferenceCapacity
        ) {
            addError('distanceTraveledWithinTheWork', 'Preencha o campo obrigatório')
        }

        this._transportVehicle.validate(changeErrorFields)
        this._workRoutes.validate(changeErrorFields)
        this._material.validate(changeErrorFields)

        // Validação para impedir casas decimais (ex: 29.10 gera erro, 2910 passa)
        if (this._value != null && this._value % 1 !== 0) {
            addError('value', 'Não são permitidas casas decimais')
        }

        if (errorMessages.length > 0) {
            console.info('Validation Errors:', errorMessages)
            const formattedErrors = errorMessages.map((err) => `[${err.field}]: ${err.message}`).join('\n- ')
            throw new Error(`Entity validation failed, cause: Erros de validação:\n- ${formattedErrors}`)
        }
        console.info('[MaterialTransport] Entity valid')
    }

    public get workRoutes(): WorkRoutesEntity {
        return this._workRoutes
    }

    public get transportVehicle(): TransportVehicleEntity {
        return this._transportVehicle
    }

    public get material(): MaterialEntity {
        return this._material
    }

    public get value(): number {
        return this._value
    }

    public get isReferenceCapacity(): boolean {
        return this._isReferenceCapacity
    }

    public get quantity(): number {
        return this._quantity
    }

    public get deliveryPicket(): string {
        return this._deliveryPicket
    }

    public get totalPickets(): number {
        return this._totalPickets
    }

    public get distanceTraveledWithinTheWork(): number {
        return this._distanceTraveledWithinTheWork
    }

    public get observation(): string {
        return this._observation
    }

    public get invoiceId(): number {
        return this._invoiceId
    }

    public get invoiceStatus(): InvoiceStatus {
        return this._invoiceStatus
    }

    public get workId(): string {
        return this._workId
    }

    public get transportVehicleId(): string | undefined {
        return this._transportVehicle.id
    }

    get nameProprietary(): string {
        return this._transportVehicle.nameProprietary
    }

    get cpfCnpjProprietary(): string {
        return this._transportVehicle.cpfCnpjProprietary
    }

    get telProprietary(): string {
        return this._transportVehicle.telProprietary
    }

    public get motorist(): string {
        return this._transportVehicle.motorist
    }

    public get plate(): string {
        return this._transportVehicle.plate
    }
    public get capacity(): number {
        return this._transportVehicle.capacity
    }

    public get materialId(): string | undefined {
        return this._material.id
    }
    public get materialName(): string {
        return this._material.name
    }

    public get workRoutesId(): string | undefined {
        return this._workRoutes.id
    }

    public get arrivalLocation(): string {
        return this._workRoutes.arrivalLocation
    }

    public get departureLocation(): string {
        return this._workRoutes.departureLocation
    }

    public get km(): number {
        return this._workRoutes.km
    }

    public get unitValue(): number {
        return this._workRoutes.value
    }
}
