import Model from '@nozbe/watermelondb/Model'
import { date, field, readonly } from '@nozbe/watermelondb/decorators/index.js'

export default class MaintenanceTruckModel extends Model {
    public static table = 'maintenance_trucks'

    @field('server_id') serverId: number

    @field('users_list') usersList: string

    @field('capacity') capacity: number

    @field('name_proprietary') nameProprietary: string

    @field('work_equipment_id') workEquipmentId: string

    @field('model_or_plate') modelOrPlate: string

    @field('operator_motorist') operatorMotorist: string

    @field('work_id') workId: string

    @field('enterprise_id') enterpriseId: string

    @field('user_id') userId: string

    @field('user_action') userAction: number

    @field('is_valid') isValid: boolean

    @readonly @date('created_at') createdAt: number

    @date('updated_at') updatedAt: number
}
