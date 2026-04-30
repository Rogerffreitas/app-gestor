import DepositEntity from './DepositEntity'

export default class DepositDto {
    name: string
    description: string

    enterpriseId: string
    userId: string
    userAction?: number
    serverId?: number
    isValid?: boolean
    id?: string
    createdAt?: number
    updatedAt?: number
    status?: string

    toDto(data: DepositEntity): DepositDto {
        this.name = data.name
        this.description = data.description
        this.serverId = data.serverId
        this.userId = data.userId
        this.userAction = data.userAction
        this.enterpriseId = data.enterpriseId
        this.isValid = data.isValid
        this.id = data.id
        this.createdAt = Number(data.createdAt)
        this.updatedAt = Number(data.createdAt)
        this.status = data.status
        return this
    }
}
