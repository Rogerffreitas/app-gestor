import { Model } from '@nozbe/watermelondb'
import { date, field, readonly } from '@nozbe/watermelondb/decorators'

export default class DepositModel extends Model {
    static table = 'deposits'

    @field('server_id')
    serverId: number

    @field('name')
    name: string

    @field('description')
    description: string

    @field('enterprise_id')
    enterpriseId: string

    @field('user_id')
    userId: string

    @field('user_action')
    userAction: number

    @field('is_valid')
    isValid: boolean

    @readonly
    @date('created_at')
    createdAt: number

    @date('updated_at')
    updatedAt: number
}
