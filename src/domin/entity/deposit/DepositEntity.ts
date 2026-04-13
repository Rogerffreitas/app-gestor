import DepositModel from '../../../database/model/DepositModel'
import { ChangeErrorFields, ErrorMessages } from '../../../types'
import AbstratcEntity from '../AbstratcEntity'
import DepositDto from './DepositDto'

export default class DepositEntity extends AbstratcEntity {
    private _name: string
    private _description: string

    get name(): string {
        return this._name
    }

    get description(): string {
        return this._description
    }

    modelToEntity?(data: DepositModel): DepositEntity {
        this._name = data.name
        this._description = data.description
        this.serverId = data.serverId
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

    dtoToEntity?(data: DepositDto): DepositEntity {
        this._name = data.name
        this._description = data.description
        this.serverId = data.serverId
        this.id = data.id
        this.userId = data.userId
        this.userAction = data.userAction
        this.enterpriseId = data.enterpriseId
        this.isValid = data.isValid
        return this
    }

    validate?(changeErrorFields: ChangeErrorFields) {
        console.log('validated entity [Deposit]')
        let errorMessages: ErrorMessages[] = []

        if (!this._name || this._name.trim().length === 0) {
            changeErrorFields('name')('Preencha o campo obrigatório')
            errorMessages.push({ field: 'frames', message: 'Preencha o campo obrigatório' })
        }

        if (this._name.length > 50) {
            changeErrorFields('name')('Max. 50 caracteres')
            errorMessages.push({ field: 'frames', message: 'Max. 50 caracteres' })
        }

        if (!this._description || this._description.trim().length === 0) {
            changeErrorFields('description')('Preencha o campo obrigatório')
            errorMessages.push({ field: 'description', message: 'Preencha o campo obrigatório' })
        }

        if (this._description.length > 50) {
            changeErrorFields('description')('Max. 50 caracteres')
            errorMessages.push({ field: 'description', message: 'Max. 50 caracteres' })
        }

        if (errorMessages.length > 0) {
            console.info('[Deposit] Validation Errors:', errorMessages)
            const formattedErrors = errorMessages.map((err) => `[${err.field}]: ${err.message}`).join('\n- ')
            throw new Error(
                `[Deposit] Entity validation failed, cause: Erros de validação:\n- ${formattedErrors}`
            )
        }

        console.log('[Deposit] Entity valid')
    }
}
