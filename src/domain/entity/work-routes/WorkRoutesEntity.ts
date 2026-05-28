import WorkRoutesProps from '../../interfaces/props/WorkRoutesProps'
import { ChangeErrorFields } from '../../types'
import AbstratcEntity from '../AbstratcEntity'
import DepositEntity from '../deposit/DepositEntity'
import WorkEntity from '../work/WorkEntity'
import WorkRoutesDto from './WorkRoutesDto'

export default class WorkRoutesEntity extends AbstratcEntity {
    private _arrivalLocation: string
    private _departureLocation: string
    private _km: number
    private _initialPicket: number
    private _value: number
    private _isFixedValue: boolean
    private _work: WorkEntity
    private _deposit: DepositEntity

    get arrivalLocation(): string {
        return this._arrivalLocation
    }

    public get departureLocation(): string {
        return this._departureLocation
    }

    public get km(): number {
        return this._km
    }

    public get initialPicket(): number {
        return this._initialPicket
    }

    public get value(): number {
        return this._value
    }

    public get isFixedValue(): boolean {
        return this._isFixedValue
    }

    get work(): WorkEntity {
        return this._work
    }
    get deposit(): DepositEntity {
        return this._deposit
    }

    modelToEntity(data: WorkRoutesProps): WorkRoutesEntity {
        this._arrivalLocation = data.arrivalLocation
        this._departureLocation = data.departureLocation
        this._km = +data.km
        this._initialPicket = +data.initialPicket
        this._value = +data.value
        this._isFixedValue = data.isFixedValue
        this._work = new WorkEntity().toEntity(data.work)
        this._deposit = new DepositEntity().modelToEntity(data.deposit)
        this.id = data.id
        this.serverId = data.serverId
        this.userId = data.userId
        this.userAction = data.userAction
        this.enterpriseId = data.enterpriseId
        this.isValid = data.isValid
        this.createdAt = Number(data.createdAt)
        this.updatedAt = Number(data.updatedAt)
        this.status = data.status

        return this
    }

    dtoToEntity(data: WorkRoutesDto): WorkRoutesEntity {
        this._arrivalLocation = data.arrivalLocation
        this._departureLocation = data.departureLocation

        this._km = +data.km
        this._initialPicket = +data.initialPicket
        this._value = +data.value

        this._isFixedValue = data.isFixedValue
        this._work = new WorkEntity().dtoToEntity(data.work)
        this._deposit = new DepositEntity().dtoToEntity(data.deposit)
        this.serverId = data.serverId
        this.id = data.id
        this.userId = data.userId
        this.enterpriseId = data.enterpriseId
        return this
    }

    validate(changeErrorFields: ChangeErrorFields) {
        console.log('validated entity [WorkRoute]')
        let errorMessages: { field: string; message: string }[] = []

        const addError = (field: string, message: string) => {
            errorMessages.push({ field, message })
            changeErrorFields(field)(message)
        }

        this._deposit.validate(changeErrorFields)

        if (!this._work) {
            addError('workId', 'Work validation failed')
            throw new Error('Entity validation failed,cause: Work validation failed')
        }

        if (!this._deposit) {
            addError('depositId', 'Deposit validation failed')
            throw new Error('Entity validation failed, Deposit validation failed')
        }

        if (this._arrivalLocation == null || this._arrivalLocation.trim().length == 0) {
            addError('arrivalLocation', 'Preencha o campo obrigatório')
        }

        if (this._departureLocation == null || this._departureLocation.length == 0) {
            addError('departureLocation', 'Preencha o campo obrigatório')
        }

        if (this._arrivalLocation.trim().length > 100) {
            addError('arrivalLocation', 'Max. 100 caracteres')
        }

        if (this._departureLocation.length > 100) {
            addError('departureLocation', 'Max. 100 caracteres')
        }

        if (this._initialPicket > this._work.pickets) {
            addError('km', 'Estaca de destino maior que ' + this._work.pickets)
        }

        if (!this._isFixedValue && this._km == 0) {
            addError('km', 'Preencha o campo obrigatório')
        }

        if (!this._isFixedValue && !this.initialPicket) {
            addError('km', 'Preencha o campo obrigatório')
        }

        if (this._value == null || this._value == 0) {
            addError('value', 'Preencha o campo obrigatório')
        }

        if (this._km > 9999999) {
            addError('km', 'Max. 999999')
        }

        if (this._value > 99999999) {
            addError('value', 'Max. 999999')
        }

        // Validação para impedir casas decimais (ex: 29.10 gera erro, 2910 passa)
        if (this._value != null && this._value % 1 !== 0) {
            addError('value', 'Não são permitidas casas decimais')
        }

        if (this._km != null && this._km % 1 !== 0) {
            addError('km', 'Não são permitidas casas decimais')
        }

        if (this._initialPicket != null && this._initialPicket % 1 !== 0) {
            addError('initialPicket', 'Não são permitidas casas decimais')
        }

        if (errorMessages.length > 0) {
            console.info('Validation Errors:', errorMessages)
            const formattedErrors = errorMessages.map((err) => `[${err.field}]: ${err.message}`).join('\n- ')
            throw new Error(`Entity validation failed, cause: Erros de validação:\n- ${formattedErrors}`)
        }
        console.info('[WorkRoutes] Entity valid')
    }
}
