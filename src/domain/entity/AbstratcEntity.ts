import { UserAction } from '../types'

export default abstract class AbstratcEntity {
    userId: string
    enterpriseId: string
    userAction?: UserAction
    serverId?: number
    isValid?: boolean
    id?: string
    createdAt?: number
    updatedAt?: number
    status?: string
}
