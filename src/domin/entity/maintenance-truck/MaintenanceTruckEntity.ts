import MaintenanceTruckModel from '../../../database/model/MaintenanceTruckModel'
import { ChangeErrorFields, ErrorMessages } from '../../../types'
import AbstratcEntity from '../AbstratcEntity'
import { MaintenanceTruckDto } from './MaintenanceTruckDto'

export class MaintenanceTruckEntity extends AbstratcEntity {
    private _capacity: number
    private _operatorMotorist: string
    private _nameProprietary: string
    private _modelOrPlate: string
    private _usersList: string
    private _workEquipmentId: string
    private _workId: string

    public modelToEntity(data: MaintenanceTruckModel): MaintenanceTruckEntity {
        this._capacity = +data.capacity
        this._operatorMotorist = data.operatorMotorist
        this._nameProprietary = data.nameProprietary
        this._modelOrPlate = data.modelOrPlate
        this._usersList = data.usersList
        this._workId = data.workId
        this._workEquipmentId = data.workEquipmentId
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
    public dtoToEntity(data: MaintenanceTruckDto): MaintenanceTruckEntity {
        this._capacity = +data.capacity
        this._operatorMotorist = data.operatorMotorist
        this._nameProprietary = data.nameProprietary
        this._modelOrPlate = data.modelOrPlate
        this._usersList = data.usersList
        this._workId = data.workId
        this._workEquipmentId = data.workEquipmentId
        this.serverId = data.serverId
        this.id = data.id
        this.userId = data.userId
        this.userAction = data.userAction
        this.enterpriseId = data.enterpriseId
        this.isValid = data.isValid
        this.createdAt = +data.createdAt
        this.updatedAt = +data.updatedAt
        return this
    }

    public validate(changeErrorFields: ChangeErrorFields) {
        console.log('[MaintenanceTruckEntity]: validated entity')
        let errorMessages: ErrorMessages[] = []

        if (!this._workId || this._workId.trim() === '') {
            errorMessages.push({ field: 'workId', message: 'O id da obra é obrigatório.' })
        }

        if (!this._workEquipmentId || this._workEquipmentId.trim() === '') {
            errorMessages.push({ field: 'workId', message: 'O id do equipamento é obrigatório.' })
        }

        if (this._capacity == null || this._capacity == 0) {
            errorMessages.push({ field: 'capacity', message: 'Preencha o campo obrigatório' })
            changeErrorFields('capacity')('Preencha o campo obrigatório')
        }

        if (!Number.isInteger(this._capacity)) {
            errorMessages.push({ field: 'capacity', message: 'Informe um Número Inteiro.' })
            changeErrorFields('capacity')('Informe um Número Inteiro.')
        }

        if (this._nameProprietary == null || this._nameProprietary.trim().length == 0) {
            changeErrorFields('proprietary')('O nome do proprietário é obrigatório.')
            errorMessages.push({ field: 'proprietary', message: 'O nome do proprietário é obrigatório.' })
        }

        if (this._operatorMotorist == null || this._operatorMotorist.trim().length == 0) {
            changeErrorFields('operatorMotorist')('Obrigatório.')
            errorMessages.push({ field: 'operatorMotorist', message: 'O nome do operador é obrigatório.' })
        }

        if (this._modelOrPlate == null || this._modelOrPlate.trim().length == 0) {
            changeErrorFields('modelOrPlate')('Obrigatório.')
            errorMessages.push({ field: 'modelOrPlate', message: 'O modelo/placa é obrigatório.' })
        }

        if (this._usersList && this._usersList.trim().length <= 0) {
            changeErrorFields('usersList')('Selecione um usuário')
            errorMessages.push({ field: 'userList', message: 'Selecione um usuário' })
        }

        if (errorMessages.length > 0) {
            console.log(errorMessages)
            throw new Error('Entity validation failed', {
                cause: 'Erros de validação:\n- ' + errorMessages.join('\n- '),
            })
        }

        console.log('[MaintenanceTruckEntity]: valid entity')
    }

    public get capacity(): number {
        return this._capacity
    }

    public get operatorMotorist(): string {
        return this._operatorMotorist
    }

    public get nameProprietary(): string {
        return this._nameProprietary
    }

    public get modelOrPlate(): string {
        return this._modelOrPlate
    }

    public get usersList(): string {
        return this._usersList
    }

    public get workEquipmentId(): string {
        return this._workEquipmentId
    }

    public get workId(): string {
        return this._workId
    }
}
