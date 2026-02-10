import WorkRoutesModel from '../../../database/model/WorkRoutesModel'
import { ChangeErrorFields, ErrorMessages } from '../../../types'
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

    async modelToEntity?(data: WorkRoutesModel): Promise<WorkRoutesEntity> {
        this._arrivalLocation = data.arrivalLocation
        this._departureLocation = data.departureLocation
        this._km = +data.km
        this._initialPicket = +data.initialPicket
        this._value = +data.value
        this._isFixedValue = data.isFixedValue
        this._work = new WorkEntity().modelToEntity(await data.work())
        this._deposit = new DepositEntity().modelToEntity(await data.deposit())
        this.id = data.id
        this.userId = data.userId
        this.userAction = data.userAction
        this.enterpriseId = data.enterpriseId
        this.isValid = data.isValid
        this.createdAt = +data.createdAt
        this.updatedAt = +data.updatedAt
        this.status = data._raw._status
        return this
    }

    dtoToEntity?(data: WorkRoutesDto): WorkRoutesEntity {
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
        this.userAction = data.userAction
        this.enterpriseId = data.enterpriseId
        this.isValid = data.isValid
        this.createdAt = +data.createdAt
        this.updatedAt = +data.updatedAt
        this.status = data.status

        if (data.isFixedValue) {
            this._km = 0
        }
        return this
    }

    validate?(changeErrorFields: ChangeErrorFields) {
        console.log('validated entity [WorkRoute]')
        this._deposit.validate(changeErrorFields)
        let errorMessages: ErrorMessages[] = []

        if (!this._work) {
            errorMessages.push({ field: 'workId', message: 'Work validation failed' })
            throw new Error('Entity validation failed', { cause: 'Work validation failed' })
        }

        if (!this._deposit) {
            errorMessages.push({ field: 'depositId', message: 'Deposit validation failed' })
            throw new Error('Entity validation failed', { cause: 'Deposit validation failed' })
        }

        if (this._arrivalLocation == null || this._arrivalLocation.trim().length == 0) {
            errorMessages.push({ field: 'arrivalLocation', message: 'Preencha o campo obrigatório' })
            changeErrorFields('arrivalLocation')('Preencha o campo obrigatório')
        }

        if (this._departureLocation == null || this._departureLocation.length == 0) {
            errorMessages.push({ field: 'departureLocation', message: 'Preencha o campo obrigatório' })
            changeErrorFields('departureLocation')('Preencha o campo obrigatório')
        }

        if (this._arrivalLocation.trim().length > 100) {
            errorMessages.push({ field: 'arrivalLocation', message: 'Max. 100 caracteres' })
            changeErrorFields('arrivalLocation')('Max. 100 caracteres')
        }

        if (this._departureLocation.length > 100) {
            errorMessages.push({ field: 'departureLocation', message: 'Max. 100 caracteres' })
            changeErrorFields('departureLocation')('Max. 100 caracteres')
        }

        if (this._initialPicket > this._work.pickets) {
            errorMessages.push({ field: 'km', message: 'Estaca de destino maior que ' + this._work.pickets })
            changeErrorFields('km')('Estaca de destino maior que ' + this._work.pickets)
        }

        if (!this._isFixedValue && this._km == 0) {
            errorMessages.push({ field: 'km', message: 'Preencha o campo obrigatório' })
            changeErrorFields('km')('Preencha o campo obrigatório')
        }

        if (!this._isFixedValue && this.initialPicket == undefined) {
            errorMessages.push({ field: 'km', message: 'Preencha o campo obrigatório' })
            changeErrorFields('km')('Preencha o campo obrigatório')
        }

        if (this._value == null || this._value == 0) {
            errorMessages.push({ field: 'value', message: 'Preencha o campo obrigatório' })
            changeErrorFields('value')('Preencha o campo obrigatório')
        }

        if (this._km > 9999999) {
            errorMessages.push({ field: 'km', message: 'Max. 999999' })
            changeErrorFields('km')('Max. 999999')
        }

        if (this._value > 99999999) {
            errorMessages.push({ field: 'value', message: 'Max. 999999' })
            changeErrorFields('value')('Max. 999999')
        }
        if (errorMessages.length > 0) {
            console.log(errorMessages)
        }
        console.log('Entity valid')

        if (errorMessages.length > 0) {
            throw new Error('Entity validation failed', {
                cause: 'Erros de validação:\n- ' + errorMessages.join('\n- '),
            })
        }
    }
}
