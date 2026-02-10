import { UserAction } from '../../types'

export default abstract class AbstratcEntity {
    public serverId: number
    public userId: string
    public userAction: UserAction
    public enterpriseId: string
    public isValid: boolean
    public id?: string
    public createdAt?: number
    public updatedAt?: number
    public status?: string
}
