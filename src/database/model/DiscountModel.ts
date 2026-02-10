import { Model } from '@nozbe/watermelondb'
import { date, readonly, field } from '@nozbe/watermelondb/decorators'

export default class DiscountModel extends Model {
    static table = 'discounts'

    @field('server_id')
    serverId: number

    @field('value')
    value: number

    @field('description')
    public description: string

    @field('type')
    public type: string

    @field('transport_vehicle_or_equipment_id')
    transportVehicleOrEquipmentId: string

    @field('invoice_id')
    public invoiceId: number

    @field('invoice_status')
    public invoiceStatus: string

    @field('work_id')
    workId: string

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
