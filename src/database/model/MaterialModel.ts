import { Model } from '@nozbe/watermelondb'
import { date, field, readonly } from '@nozbe/watermelondb/decorators'

export default class MaterialModel extends Model {
    static table = 'materials'

    @field('server_id')
    serverId: number

    @field('name')
    name: string

    @field('density')
    density: number

    @field('reference_material_calculation')
    referenceMaterialCalculation: number

    @field('value')
    value: number

    @field('deposit_id')
    depositId: string

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
