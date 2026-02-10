import { Model } from '@nozbe/watermelondb'
import { date, readonly, field } from '@nozbe/watermelondb/decorators'

export default class EquipmentModel extends Model {
    static table = 'equipments'

    @field('server_id')
    public serverId: number

    @field('name_proprietary') nameProprietary: string

    @field('cpf_cnpj_proprietary') cpfCnpjProprietary: string

    @field('tel_proprietary') telProprietary: string

    @field('operator_motorist') operatorMotorist: string

    @field('is_equipment') isEquipment: boolean

    @field('model_or_plate') modelOrPlate: string

    @field('start_rental') startRental: string

    @field('hour_meter_or_odometer') hourMeterOrOdometer: number

    @field('monthly_payment') monthlyPayment: number

    @field('value_per_hour_km') valuePerHourKm: number

    @field('value_per_day') valuePerDay: number

    @field('bank') bank: string

    @field('beneficiary') beneficiary: string

    @field('agency') agency: string

    @field('account') account: string

    @field('pix') pix: string

    @field('enterprise_id') enterpriseId: string

    @field('user_id') userId: string

    @field('user_action') userAction: number

    @field('is_valid') isValid: boolean

    @readonly @date('created_at') createdAt: number

    @date('updated_at') updatedAt: number
}
