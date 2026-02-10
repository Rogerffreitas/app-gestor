import WorkModel from '../../../database/model/WorkModel'
import { ChangeErrorFields, ErrorMessages } from '../../../types'
import AbstratcEntity from '../AbstratcEntity'
import WorkDto from './WorkDto'

export default class WorkEntity extends AbstratcEntity {
    private _name: string
    private _description: string
    private _pickets: number
    private _usersList: string

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

    validate?(changeErrorFields: ChangeErrorFields) {
        console.log('validated entity')
        let errorMessages: ErrorMessages[] = []
        if (this._usersList == null || this._usersList === undefined) {
            changeErrorFields('usersList')('Selecione um usuário')
            errorMessages.push({ field: 'userList', message: 'Selecione um usuário' })
        }

        if (this._usersList && this._usersList.trim().length <= 0) {
            changeErrorFields('usersList')('Selecione um usuário')
            errorMessages.push({ field: 'userList', message: 'Selecione um usuário' })
        }

        if (this._name == null || this._name.length == 0) {
            changeErrorFields('name')('Preencha o campo obrigatório')
            errorMessages.push({ field: 'name', message: 'Preencha o campo obrigatório' })
        }

        if (this._description == null || this._description.length == 0) {
            changeErrorFields('description')('Preencha o campo obrigatório')
            errorMessages.push({ field: 'description', message: 'Preencha o campo obrigatório' })
        }

        if (this._pickets == null || this._pickets <= 0) {
            changeErrorFields('pickets')('Preencha o campo obrigatório')
            errorMessages.push({ field: 'pickets', message: 'Preencha o campo obrigatório' })
        }

        if (this._name && this._name.length > 30) {
            changeErrorFields('name')('Max. 100 caracteres')
            errorMessages.push({ field: 'name', message: 'Max. 30 caracteres' })
        }

        if (this._description && this._description.length > 50) {
            changeErrorFields('description')('Max. 50 caracteres')
            errorMessages.push({ field: 'description', message: 'Max. 100 caracteres' })
        }

        if (this._pickets && this._pickets > 99999) {
            changeErrorFields('pickets')('Max. 99999 estacas')
            errorMessages.push({ field: 'pickets', message: 'Max. 99999 estacas' })
        }

        if (errorMessages.length > 0) {
            throw new Error('Entity validation failed', {
                cause: 'Erros de validação:\n- ' + errorMessages.join('\n- '),
            })
        }

        console.log('Entity valid')
    }

    dtoToEntity?(data: WorkDto): WorkEntity {
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

        return this
    }

    modelToEntity?(data: WorkModel): WorkEntity {
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
        this.createdAt = +data.createdAt
        this.updatedAt = +data.updatedAt
        this.status = data._raw._status

        return this
    }
}
