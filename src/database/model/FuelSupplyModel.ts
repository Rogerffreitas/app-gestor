import { Model } from '@nozbe/watermelondb'
import { date, readonly, field } from '@nozbe/watermelondb/decorators'

export default class FuelSupplyModel extends Model {
    static table = 'fuel_supplies'

    @field('quantity') quantity: number

    @field('value_per_liter') valuePerLiter: number

    @field('value') value: number

    @field('description') description: string

    @field('server_id') serverId: number

    @field('supply_type') supplyType: string

    @field('transport_vehicle_or_work_equipment_id') transportVehicleOrWorkEquipmentId: string

    @field('observation') observation: string

    @field('is_gas_station') isGasStation: boolean

    @field('maintenance_trucks_work_equipment_id') maintenanceTrucksWorkEquipmentId: string

    @field('hour_meter_or_odometer') hourMeterOrOdometer: number

    @field('is_discount') isDiscount: boolean

    @field('invoice_id') invoiceId: number

    @field('invoice_status') invoiceStatus: string

    @field('work_id') workId: string

    @field('enterprise_id') enterpriseId: string

    @field('user_id') userId: string

    @field('user_action') userAction: number

    @field('is_valid') isValid: boolean

    @readonly @date('created_at') createdAt: number

    @date('updated_at') updatedAt: number
}
