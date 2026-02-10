import Model from '@nozbe/watermelondb/Model'
import { date, field, readonly } from '@nozbe/watermelondb/decorators/index.js'
import EquipmentModel from './EquipmentModel'

export default class WorkEquipmentModel extends Model {
    public static table = 'work_equipments'

    @field('equipment_id') equipmentId: string

    @field('is_equipment') isEquipment: boolean

    @field('model_or_plate') modelOrPlate: string

    @field('name_proprietary') nameProprietary: string

    @field('operator_motorist') public operatorMotorist: string

    @field('hour_meter_or_odometer') hourMeterOrOdometer: number

    @field('start_rental') startRental: string

    @field('monthly_payment') monthlyPayment: number

    @field('value_per_hour_km') valuePerHourKm: number

    @field('value_per_day') valuePerDay: number

    @field('work_id') workId: string

    @field('server_id') serverId: number

    @field('enterprise_id') enterpriseId: string

    @field('user_id') userId: string

    @field('user_action') userAction: number

    @field('is_valid') isValid: boolean

    @readonly @date('created_at') createdAt: number

    @date('updated_at') updatedAt: number

    public equipment(): Promise<EquipmentModel | undefined> {
        return this.database.get<EquipmentModel>('equipments').find(this.equipmentId)
    }
}
