import { Model } from '@nozbe/watermelondb'
import { Associations } from '@nozbe/watermelondb/Model'
import { children, date, field, readonly } from '@nozbe/watermelondb/decorators'

export default class WorkModel extends Model {
    static table = 'works'

    static associations: Associations = {
        rotas: { type: 'has_many', foreignKey: 'obra_id' },
    }

    @field('server_id')
    serverId: number

    @field('name')
    name: string

    @field('description')
    description: string

    @field('pickets')
    pickets: number

    @field('users_list')
    usersList: string

    @field('enterprise_id')
    enterpriseId: string

    @field('user_id')
    userId: string

    @field('user_action')
    userAction: number

    @field('is_valid')
    isValid: boolean

    @children('deposits')
    deposits?

    @readonly
    @date('created_at')
    createdAt?: number

    @date('updated_at')
    updatedAt?: number

    public setName(name: string) {
        this.name = name
    }
}
