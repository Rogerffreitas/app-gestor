import { Model } from '@nozbe/watermelondb'
import { date, field, readonly } from '@nozbe/watermelondb/decorators'
import DepositModel from './DepositModel'
import { TableName } from '../../types'
import WorkModel from './WorkModel'

export default class WorkRoutesModel extends Model {
    static table = TableName.WORK_ROUTES

    @field('server_id') serverId: number

    @field('arrival_location') arrivalLocation: string

    @field('departure_location') departureLocation: string

    @field('km') km: number

    @field('initial_picket') initialPicket: number

    @field('value') value: number

    @field('is_fixed_value') isFixedValue: boolean

    @field('work_id') workId: string

    @field('deposit_id') depositId: string

    @field('enterprise_id') enterpriseId: string

    @field('user_id') userId: string

    @field('user_action') userAction: number

    @field('is_valid') isValid: boolean

    @readonly @date('created_at') createdAt: number

    @date('updated_at') updatedAt: number

    async deposit(): Promise<DepositModel> {
        return await this.database.get<DepositModel>(TableName.DEPOSITS).find(this.depositId)
    }

    async work(): Promise<WorkModel> {
        return await this.database.get<WorkModel>(TableName.WORKS).find(this.workId)
    }
}
