import WorkProps from '../../interfaces/props/WorkProps'
import { ErrorMessages, ChangeErrorFields } from '../../types'
import AbstratcEntity from '../AbstratcEntity'
import WorkDto from './WorkDto'

export default class WorkEntity extends AbstratcEntity {
    private _name: string
    private _description: string
    private _pickets: number
    private _usersList: string

    toEntity(data: WorkProps): WorkEntity {
        if (!data) {
            return this
        }
        this._name = data.name
        this._description = data.description
        this._pickets = +data.pickets
        this._usersList = data.usersList

        this.serverId = data.serverId
        this.id = data.id
        this.userId = data.userId
        this.userAction = data.userAction
        this.enterpriseId = data.enterpriseId
        this.isValid = data.isValid
        this.createdAt = Number(data.createdAt)
        this.updatedAt = Number(data.updatedAt)
        this.status = data.status
        return this
    }

    public get name(): string {
        return this._name
    }

    public get description(): string {
        return this._description
    }
    public get pickets(): number {
        return this._pickets
    }

    public get usersList(): string {
        return this._usersList
    }

    validate(changeErrorFields: ChangeErrorFields) {
        console.log('validated entity')
        let errorMessages: ErrorMessages[] = []

        const addError = (field: string, message: string) => {
            errorMessages.push({ field, message })
            changeErrorFields(field)(message)
        }

        if (!this._usersList || this._usersList.trim().length === 0) {
            addError('userList', 'Selecione um usuário')
        }

        if (this._name == null || this._name.length == 0) {
            addError('name', 'Preencha o campo obrigatório')
        }

        if (this._description == null || this._description.length == 0) {
            addError('description', 'Preencha o campo obrigatório')
        }

        if (this._pickets == null || this._pickets <= 0) {
            addError('pickets', 'Preencha o campo obrigatório')
        }

        if (this._name && this._name.length > 30) {
            addError('name', 'Max. 30 caracteres')
        }

        if (this._description && this._description.length > 50) {
            addError('description', 'Max. 100 caracteres')
        }

        if (this._pickets && this._pickets > 99999) {
            addError('pickets', 'Max. 99999 estacas')
        }

        if (errorMessages.length > 0) {
            console.info('Validation Errors:', errorMessages)
            const formattedErrors = errorMessages.map((err) => `[${err.field}]: ${err.message}`).join('\n- ')
            throw new Error(`Entity validation failed, cause: Erros de validação:\n- ${formattedErrors}`)
        }
        console.info('[Work] Entity valid')
    }

    dtoToEntity(data: WorkDto): WorkEntity {
        this._name = data.name
        this._description = data.description
        this._pickets = +data.pickets
        this._usersList = data.usersList
        this.id = data.id
        this.serverId = data.serverId
        this.userId = data.userId
        this.userAction = data.userAction
        this.enterpriseId = data.enterpriseId
        this.isValid = data.isValid
        this.status = data.status
        return this
    }
}
