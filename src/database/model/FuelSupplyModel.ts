import { Model } from '@nozbe/watermelondb'
import { date, readonly, field } from '@nozbe/watermelondb/decorators'

export default class FuelSupplyModel extends Model {
    static table = 'fuel_supplys'

    @field('server_id')
    serverId: number

    @field('quantity')
    quantity: number

    @field('value_per_liter')
    valuePerLiter: number

    @field('value')
    value: number

    @field('description')
    public description: string

    @field('type')
    public type: string

    @field('transport_vehicle_or_equipment_id')
    transportVehicleOrEquipmentId: string

    @field('observation')
    public observation: string

    @field('is_gas_station')
    public isGasStation: boolean

    @field('maintenance_trucks_work_equipment_id')
    public maintenanceTrucksWorkEquipmentId: string

    @field('hour_meter_or_km_meter')
    public hourMeterOrKmMeter: number

    @field('is_discount')
    isDiscount: boolean

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
