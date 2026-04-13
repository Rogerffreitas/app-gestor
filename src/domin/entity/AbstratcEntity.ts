import { UserAction } from '../../types'

export default abstract class AbstratcEntity {
    public userId: string
    public enterpriseId: string
    public userAction?: UserAction
    public serverId?: number
    public isValid?: boolean
    public id?: string
    public createdAt?: number
    public updatedAt?: number
    public status?: string
}
