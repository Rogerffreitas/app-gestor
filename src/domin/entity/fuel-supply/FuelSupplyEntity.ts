import FuelSupplyModel from '../../../database/model/FuelSupplyModel'
import { ChangeErrorFields, ErrorMessages } from '../../../types'
import AbstratcEntity from '../AbstratcEntity'
import { FuelSupplyDto } from './FuelSupplyDto'

export class FuelSupplyEntity extends AbstratcEntity {
    private _quantity: number
    private _valuePerLiter: number
    private _value: number
    private _description: string
    private _type: string
    private _transportVehicleOrEquipmentId: string
    private _observation: string
    private _isGasStation: boolean
    private _maintenanceTrucksWorkEquipmentId: string
    private _hourMeterOrKmMeter: number
    private _isDiscount: boolean
    private _invoiceId: number
    private _invoiceStatus: string
    private _workId: string

    public static dtoToEntity(data: FuelSupplyDto): FuelSupplyEntity {
        const entity = new FuelSupplyEntity()
        entity._quantity = data.quantity
        entity._valuePerLiter = data.valuePerLiter
        entity._value = data.quantity * data.valuePerLiter
        entity._description = data.description
        entity._type = data.type
        entity._transportVehicleOrEquipmentId = data.transportVehicleOrEquipmentId
        entity._observation = data.observation
        entity._isGasStation = data.isGasStation
        entity._maintenanceTrucksWorkEquipmentId = data.maintenanceTrucksWorkEquipmentId
        entity._hourMeterOrKmMeter = data.hourMeterOrKmMeter
        entity._isDiscount = data.isDiscount
        entity._invoiceId = data.invoiceId
        entity._invoiceStatus = data.invoiceStatus
        entity._workId = data.workId
        entity.userId = data.userId
        entity.enterpriseId = data.enterpriseId
        return entity
    }

    public async modelToEntity(data: FuelSupplyModel): Promise<FuelSupplyEntity> {
        const entity = new FuelSupplyEntity()
        entity._quantity = data.quantity
        entity._valuePerLiter = data.valuePerLiter
        entity._value = data.value
        entity._description = data.description
        entity._type = data.type
        entity._transportVehicleOrEquipmentId = data.transportVehicleOrEquipmentId
        entity._observation = data.observation
        entity._isGasStation = data.isGasStation
        entity._maintenanceTrucksWorkEquipmentId = data.maintenanceTrucksWorkEquipmentId
        entity._hourMeterOrKmMeter = data.hourMeterOrKmMeter
        entity._isDiscount = data.isDiscount
        entity.userId = data.userId
        entity.enterpriseId = data.enterpriseId
        entity._invoiceId = data.invoiceId
        entity._invoiceStatus = data.invoiceStatus
        entity._workId = data.workId
        entity.serverId = data.serverId
        entity.userAction = data.userAction
        entity.isValid = data.isValid
        entity.id = data.id
        entity.createdAt = data.createdAt
        entity.updatedAt = data.updatedAt
        entity.status = data._raw._status
        return entity
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

    get type(): string {
        return this._type
    }

    get transportVehicleOrEquipmentId(): string {
        return this._transportVehicleOrEquipmentId
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

    get hourMeterOrKmMeter(): number {
        return this._hourMeterOrKmMeter
    }

    get isDiscount(): boolean {
        return this._isDiscount
    }

    get invoiceId(): number {
        return this._invoiceId
    }

    get invoiceStatus(): string {
        return this._invoiceStatus
    }

    get workId(): string {
        return this._workId
    }

    validate?(changeErrorFields: ChangeErrorFields) {
        console.log('validated entity [FuelSupplyEntity]')
        let errorMessages: ErrorMessages[] = []

        const addError = (field: string, message: string) => {
            errorMessages.push({ field, message })
            changeErrorFields(field)(message)
        }

        if (!this._quantity || this._quantity <= 0) addError('quantity', 'Preencha o campo obrigatório')
        if (!this._valuePerLiter || this._valuePerLiter <= 0)
            addError('valuePerLiter', 'Preencha o campo obrigatório')
        if (!this._value || this._value <= 0) addError('value', 'Preencha o campo obrigatório')
        if (!this._hourMeterOrKmMeter || this._hourMeterOrKmMeter <= 0)
            addError('hourMeterOrKmMeter', 'Preencha o campo obrigatório')
        if (!this._description?.trim()) addError('description', 'Preencha o campo obrigatório')
        if (!this._type?.trim()) addError('type', 'Preencha o campo obrigatório')

        if (errorMessages.length > 0) {
            console.log(errorMessages)
        }

        if (errorMessages.length > 0) {
            throw new Error('Entity validation failed', {
                cause: 'Erros de validação:\n- ' + errorMessages.join('\n- '),
            })
        }
        console.log('Entity valid')
    }
}
