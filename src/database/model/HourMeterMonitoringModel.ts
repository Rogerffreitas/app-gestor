import Model from '@nozbe/watermelondb/Model'
import { date, readonly } from '@nozbe/watermelondb/decorators'
import field from '@nozbe/watermelondb/decorators/field'

export default class HourMeterMonitoringModel extends Model {
    static table = 'hour_meter_monitorings'

    @field('server_id')
    serverId: number

    @field('date')
    date: string

    @field('initial_hour_meter_value')
    initialHourMeterValue: number

    @field('current_hour_meter_value')
    currentHourMeterValue: number

    @field('observation')
    observacao: string

    @field('total_calculated_in_the_period_informed')
    totalCalculatedInThePeriodInformed: number

    @field('value')
    value: number

    @field('invoice_id')
    public invoiceId: number

    @field('invoice_status')
    public invoiceStatus: string

    @field('work_equipment_id')
    public workEquipmentId: string

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
