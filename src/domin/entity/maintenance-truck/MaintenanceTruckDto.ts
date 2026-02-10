import { UserAction } from '../../../types'
import { MaintenanceTruckEntity } from './MaintenanceTruckEntity'

export class MaintenanceTruckDto {
    capacity: number
    operatorMotorist: string
    nameProprietary: string
    modelOrPlate: string
    usersList: string

    workEquipmentId: string
    workId: string
    serverId: number
    userId: string
    userAction: UserAction
    enterpriseId: string
    isValid: boolean
    id?: string
    createdAt?: number
    updatedAt?: number
    status?: string

    public entityToDto?(data: MaintenanceTruckEntity): MaintenanceTruckDto {
        this.capacity = data.capacity
        this.operatorMotorist = data.operatorMotorist
        this.nameProprietary = data.nameProprietary
        this.modelOrPlate = data.modelOrPlate
        this.usersList = data.usersList
        this.workEquipmentId = data.workEquipmentId
        this.workId = data.workId
        this.serverId = data.serverId
        this.userId = data.userId
        this.userAction = data.userAction
        this.enterpriseId = data.enterpriseId
        this.isValid = data.isValid
        this.id = data.id
        this.createdAt = data.createdAt
        this.updatedAt = data.updatedAt
        this.status = data.status
        return this
    }
}
