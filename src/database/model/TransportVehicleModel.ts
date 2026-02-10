import { Model } from '@nozbe/watermelondb'
import { date, field, readonly } from '@nozbe/watermelondb/decorators'

export default class TransportVehicleModel extends Model {
    static table = 'transport_vehicles'

    @field('server_id') serverId: number

    @field('name_proprietary') nameProprietary: string

    @field('cpf_cnpj_proprietary') cpfCnpjProprietary: string

    @field('tel_proprietary') telProprietary: string

    @field('motorist') motorist: string

    @field('plate') plate: string

    @field('color') color: string

    @field('capacity') capacity: number

    @field('bank') bank: string

    @field('beneficiary') beneficiary: string

    @field('agency') agency: string

    @field('account') account: string

    @field('pix') pix: string

    @field('work_id') workId: string

    @field('enterprise_id') enterpriseId: string

    @field('user_id') userId: string

    @field('user_action') userAction: number

    @field('is_valid') isValid: boolean

    @readonly @date('created_at') createdAt: number

    @date('updated_at') updatedAt: number
}
