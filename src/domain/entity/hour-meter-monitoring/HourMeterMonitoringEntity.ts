import HourMeterMonitoringProps from '../../interfaces/props/HourMeterMonitoringProps'
import { ChangeErrorFields, InvoiceStatus } from '../../types'
import AbstratcEntity from '../AbstratcEntity'
import { WorkEquipmentEntity } from '../work-equipment/WorkEquipmentEntity'
import HourMeterMonitoringDto from './HourMeterMonitoringDto'

export class HourMeterMonitoringEntity extends AbstratcEntity {
    private _date: string
    private _initialHourMeterValue: number
    private _currentHourMeterValue: number
    private _totalCalculatedInThePeriodInformed: number
    private _workEquipment: WorkEquipmentEntity
    private _workId: string
    private _value: number
    private _observation?: string
    private _invoiceId?: number
    private _invoiceStatus?: InvoiceStatus

    public dtoToEntity(data: HourMeterMonitoringDto): HourMeterMonitoringEntity {
        if (+data.initialHourMeterValue > +data.currentHourMeterValue) {
            throw new Error('Valor final é menor que o inicial')
        }
        if (data.workEquipment) {
            this._workEquipment = new WorkEquipmentEntity().dtoToEntity(data.workEquipment)
        }
        this._date = data.date
        this._initialHourMeterValue = data.initialHourMeterValue
        this._currentHourMeterValue = data.currentHourMeterValue
        this._observation = data.observation
        this._workId = data.workId
        this._totalCalculatedInThePeriodInformed = Math.max(
            0,
            this._currentHourMeterValue - this._initialHourMeterValue
        )
        this._value = this._totalCalculatedInThePeriodInformed * this._workEquipment.valuePerHourKm
        this._invoiceId = data.invoiceId
        this._invoiceStatus = data.invoiceStatus
        this.userId = data.userId
        this.enterpriseId = data.enterpriseId
        this.id = data.id
        return this
    }

    public modelToEntity(data: HourMeterMonitoringProps): HourMeterMonitoringEntity {
        this._workEquipment = new WorkEquipmentEntity().modelToEntity(data.workEquipment)
        this._date = data.date
        this._initialHourMeterValue = +data.initialHourMeterValue
        this._currentHourMeterValue = +data.currentHourMeterValue
        this._observation = data.observation ?? ''
        this._workId = data.workId
        this._totalCalculatedInThePeriodInformed = +data.totalCalculatedInThePeriodInformed
        this._value = data.value
        this.userId = data.userId
        this.enterpriseId = data.enterpriseId
        this._invoiceId = data.invoiceId
        this._invoiceStatus = data.invoiceStatus as InvoiceStatus
        this._workId = data.workId
        this.serverId = data.serverId
        this.userAction = data.userAction
        this.isValid = data.isValid
        this.id = data.id
        this.createdAt = Number(data.createdAt)
        this.updatedAt = Number(data.updatedAt)
        return this
    }

    // --- Getters ---
    get date() {
        return this._date
    }
    get initialHourMeterValue() {
        return this._initialHourMeterValue
    }
    get currentHourMeterValue() {
        return this._currentHourMeterValue
    }
    get totalCalculatedInThePeriodInformed() {
        return this._totalCalculatedInThePeriodInformed
    }
    get value() {
        return this._value
    }
    get observation() {
        return this._observation
    }
    get workEquipment() {
        return this._workEquipment
    }

    get workEquipmentId() {
        return this._workEquipment.id
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

    // --- Método de Validação ---
    validate(changeErrorFields: ChangeErrorFields) {
        let errorMessages: { field: string; message: string }[] = []

        const addError = (field: string, message: string) => {
            errorMessages.push({ field, message })
            changeErrorFields(field)(message)
        }

        if (!this._date) {
            addError('date', 'A data é obrigatória.')
        }

        if (!this._initialHourMeterValue || this._initialHourMeterValue < 0) {
            addError('initialHourMeterValue', 'O horímetro inicial deve ser zero ou maior.')
        }

        if (!this._currentHourMeterValue || this._currentHourMeterValue <= 0) {
            addError('currentHourMeterValue', 'O horímetro atual deve ser maior que zero.')
        }

        if (this._currentHourMeterValue < this._initialHourMeterValue) {
            addError('currentHourMeterValue', 'O horímetro atual não pode ser menor que o inicial.')
        }

        if (this._value == null || this._value == undefined || this._value < 0) {
            addError('value', 'O valor deve ser preenchido.')
        }

        if (!this._workEquipment) {
            addError('workEquipmentId', 'Selecione o equipamento.')
        }

        if (!this._workId) {
            addError('workId', 'A identificação da obra é obrigatória.')
        }

        if (errorMessages.length > 0) {
            console.info('Validation Errors:', errorMessages)
            const formattedErrors = errorMessages.map((err) => `[${err.field}]: ${err.message}`).join('\n- ')
            throw new Error(`Entity validation failed, cause: Erros de validação:\n- ${formattedErrors}`)
        }
        console.info('[HourMeterMonitoringEntity] Entity valid')
        return errorMessages
    }
}
