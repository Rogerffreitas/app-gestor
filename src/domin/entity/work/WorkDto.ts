import { UserAction } from '../../../types'
import WorkEntity from './WorkEntity'

export default class WorkDto {
    name: string
    description: string
    pickets: number
    usersList: string

    serverId: number
    userId: string
    userAction: UserAction
    enterpriseId: string
    isValid: boolean
    id?: string
    createdAt?: number
    updatedAt?: number
    status?: string

    entityToDto?(data: WorkEntity) {
        this.name = data.name
        this.description = data.description
        this.pickets = data.pickets
        this.usersList = data.usersList
        this.serverId = data.serverId
        this.id = data.id
        this.userId = data.userId
        this.userAction = data.userAction
        this.enterpriseId = data.enterpriseId
        this.isValid = data.isValid
        this.createdAt = +data.createdAt
        this.updatedAt = +data.updatedAt
        this.status = data.status
        return this
    }
}
