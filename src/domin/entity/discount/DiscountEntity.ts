import DiscountModel from '../../../database/model/DiscountModel'
import { ChangeErrorFields, DiscountTypes, ErrorMessages, InvoiceStatus } from '../../../types'
import AbstratcEntity from '../AbstratcEntity'
import DiscountDto from './DiscountDto'

export default class DiscountEntity extends AbstratcEntity {
    private _description: string
    private _value: number
    private _discountType: DiscountTypes
    private _transportVehicleOrWorkEquipmentId: string
    private _workId: string
    private _invoiceId?: number
    private _invoiceStatus?: InvoiceStatus

    public dtoToEntity(data: DiscountDto): DiscountEntity {
        if (!Object.values(DiscountTypes).includes(data.discountType)) {
            throw new Error(`O tipo de deconto é inválido: ${data.discountType}.`)
        }

        this._description = data.description
        this._value = +data.value ?? 0
        this._transportVehicleOrWorkEquipmentId = data.transportVehicleOrWorkEquipmentId
        this._discountType = data.discountType
        this._workId = data.workId
        this._invoiceId = data.invoiceId
        this._invoiceStatus = data.invoiceStatus
        this.userId = data.userId
        this.enterpriseId = data.enterpriseId
        this.id = data.id
        return this
    }

    public static async modelToEntity(data: DiscountModel): Promise<DiscountEntity> {
        const entity = new DiscountEntity()
        entity._description = data.description
        entity._value = +data.value
        entity._transportVehicleOrWorkEquipmentId = data.transportVehicleOrWorkEquipmentId
        entity._discountType = data.discountType as DiscountTypes
        entity._workId = data.workId
        entity.userId = data.userId
        entity.enterpriseId = data.enterpriseId
        entity._invoiceId = data.invoiceId
        entity._invoiceStatus = data.invoiceStatus as InvoiceStatus
        entity._workId = data.workId
        entity.serverId = data.serverId
        entity.userAction = data.userAction
        entity.isValid = data.isValid
        entity.id = data.id
        entity.createdAt = +data.createdAt
        entity.updatedAt = +data.updatedAt
        entity.status = data._raw._status
        return entity
    }

    get description() {
        return this._description
    }

    get value() {
        return this._value
    }

    get discountType() {
        return this._discountType
    }

    get transportVehicleOrWorkEquipmentId() {
        return this._transportVehicleOrWorkEquipmentId
    }

    get workId() {
        return this._workId
    }

    get invoiceId(): number | undefined {
        return this._invoiceId
    }

    get invoiceStatus(): InvoiceStatus | undefined {
        return this._invoiceStatus
    }

    validate?(changeErrorFields: ChangeErrorFields) {
        let errorMessages: ErrorMessages[] = []

        const addError = (field: string, message: string) => {
            errorMessages.push({ field, message })
            changeErrorFields(field)(message)
        }

        // Validação de Descrição
        if (!this._description || this._description.trim().length === 0) {
            addError('description', 'A descrição é obrigatória.')
        }

        // Validação de Valor
        if (!this._value || this._value <= 0) {
            addError('value', 'O valor deve ser maior que zero.')
        }

        // Validação do Enum DiscountTypes
        const validTypes = Object.values(DiscountTypes) as string[]
        if (!this._discountType || !validTypes.includes(this._discountType)) {
            addError('discountType', 'Selecione um tipo de desconto válido (Veículo ou Equipamento).')
        }

        // Validação de IDs
        if (!this._transportVehicleOrWorkEquipmentId) {
            addError(
                'transportVehicleOrWorkEquipmentId',
                'A identificação do veículo ou equipamento é obrigatória.'
            )
        }

        if (!this._workId) {
            addError('workId', 'A identificação da Obra é obrigatória.')
        }

        if (errorMessages.length > 0) {
            console.info('[Discount] Validation Errors:', errorMessages)
            const formattedErrors = errorMessages.map((err) => `[${err.field}]: ${err.message}`).join('\n- ')
            throw new Error(
                `[Discount] Entity validation failed, cause: Erros de validação:\n- ${formattedErrors}`
            )
        }

        console.log('[Discount] Entity valid')

        return errorMessages
    }
}
