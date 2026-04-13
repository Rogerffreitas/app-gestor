import FuelSupplyModel from '../../../database/model/FuelSupplyModel'
import { ChangeErrorFields, ErrorMessages, FuelSupplyTypes, InvoiceStatus } from '../../../types'
import AbstratcEntity from '../AbstratcEntity'
import { FuelSupplyDto } from './FuelSupplyDto'

export class FuelSupplyEntity extends AbstratcEntity {
    private _quantity: number
    private _valuePerLiter: number
    private _value: number
    private _description: string
    private _supplyType: FuelSupplyTypes
    private _transportVehicleOrWorkEquipmentId: string
    private _observation: string
    private _isGasStation: boolean
    //Deve ser mudado para maintenanceTruckId
    private _maintenanceTrucksWorkEquipmentId: string
    private _hourMeterOrOdometer: number
    private _isDiscount: boolean
    private _invoiceId: number
    private _invoiceStatus: InvoiceStatus
    private _workId: string

    public dtoToEntity?(data: FuelSupplyDto): FuelSupplyEntity {
        if (!Object.values(FuelSupplyTypes).includes(data.supplyType)) {
            throw new Error(`O tipo de abastecimento é inválido: ${data.invoiceStatus}.`)
        }

        this._quantity = +data.quantity
        this._valuePerLiter = +data.valuePerLiter
        this._value = parseInt(
            ((data.quantity / 100) * (data.valuePerLiter / 100)).toFixed(2).replace('.', '')
        )
        this._description = data.description
        this._supplyType = data.supplyType
        this._transportVehicleOrWorkEquipmentId = data.transportVehicleOrWorkEquipmentId
        this._observation = data.observation
        this._isGasStation =
            data.supplyType === FuelSupplyTypes.MAINTENANCE_TRUCK_TANK ? true : data.isGasStation
        this._maintenanceTrucksWorkEquipmentId = data.maintenanceTrucksWorkEquipmentId
        this._hourMeterOrOdometer = +data.hourMeterOrOdometer ?? 0
        this._isDiscount = data.isDiscount
        this._invoiceId = data.invoiceId
        //this._invoiceStatus = data.invoiceStatus
        this._workId = data.workId
        this.userId = data.userId
        this.enterpriseId = data.enterpriseId
        this.id = data.id
        return this
    }

    public modelToEntity(data: FuelSupplyModel): FuelSupplyEntity {
        this._quantity = +data.quantity
        this._valuePerLiter = +data.valuePerLiter
        this._value = +data.value
        this._description = data.description
        this._supplyType = data.supplyType as FuelSupplyTypes
        this._transportVehicleOrWorkEquipmentId = data.transportVehicleOrWorkEquipmentId
        this._observation = data.observation
        this._isGasStation = data.isGasStation
        this._maintenanceTrucksWorkEquipmentId = data.maintenanceTrucksWorkEquipmentId
        this._hourMeterOrOdometer = +data.hourMeterOrOdometer
        this._isDiscount = data.isDiscount
        this.userId = data.userId
        this.enterpriseId = data.enterpriseId
        this._invoiceId = data.invoiceId
        this._invoiceStatus = data.invoiceStatus as InvoiceStatus
        this._workId = data.workId
        this.serverId = data.serverId
        this.userAction = data.userAction
        this.isValid = data.isValid
        this.id = data.id
        this.createdAt = +data.createdAt
        this.updatedAt = +data.updatedAt
        this.status = data._raw._status
        return this
    }

    get quantity(): number {
        return this._quantity
    }

    get valuePerLiter(): number {
        return this._valuePerLiter
    }

    get value(): number {
        return this._value
    }

    get description(): string {
        return this._description
    }

    get supplyType() {
        return this._supplyType
    }

    get transportVehicleOrWorkEquipmentId(): string {
        return this._transportVehicleOrWorkEquipmentId
    }

    get observation(): string {
        return this._observation
    }

    get isGasStation(): boolean {
        return this._isGasStation
    }

    get maintenanceTrucksWorkEquipmentId(): string {
        return this._maintenanceTrucksWorkEquipmentId
    }

    get hourMeterOrOdometer(): number {
        return this._hourMeterOrOdometer
    }

    get isDiscount(): boolean {
        return this._isDiscount
    }

    get invoiceId(): number {
        return this._invoiceId
    }

    get invoiceStatus() {
        return this._invoiceStatus
    }

    get workId(): string {
        return this._workId
    }

    validate?(changeErrorFields: ChangeErrorFields) {
        let errorMessages: ErrorMessages[] = []

        const addError = (field: string, message: string) => {
            errorMessages.push({ field, message })
            changeErrorFields(field)(message)
        }
        if (!this._workId) addError('workId', 'Erro, ID obra da obrigatório')

        if (!this._quantity || this._quantity <= 0) addError('quantity', 'Obrigatório')
        if (!this._valuePerLiter || this._valuePerLiter <= 0)
            addError('valuePerLiter', 'Preencha o campo obrigatório')
        if (!this._value || this._value <= 0) addError('value', 'Obrigatório')
        if (
            (!this._hourMeterOrOdometer && this._supplyType == FuelSupplyTypes.EQUIPMENT) ||
            (this._hourMeterOrOdometer <= 0 && this._supplyType == FuelSupplyTypes.EQUIPMENT)
        )
            addError('hourMeterOrOdometer', 'Preencha o campo obrigatório')
        if (!this._description?.trim()) addError('description', 'Preencha o campo obrigatório')
        if (!this._supplyType?.trim()) addError('supplyType', 'Preencha o campo obrigatório')

        if (errorMessages.length > 0) {
            console.info('[FuelSupply] Validation Errors:', errorMessages)
            const formattedErrors = errorMessages.map((err) => `[${err.field}]: ${err.message}`).join('\n- ')
            throw new Error(
                `[FuelSupply] Entity validation failed, cause: Erros de validação:\n- ${formattedErrors}`
            )
        }
        console.log('[FuelSupply] Entity valid')
    }
}
