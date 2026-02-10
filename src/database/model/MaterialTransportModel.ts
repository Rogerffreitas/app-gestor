import { Model } from '@nozbe/watermelondb'
import { date, field, readonly } from '@nozbe/watermelondb/decorators'
import WorkRoutesModel from './WorkRoutesModel'
import { TableName } from '../../types'
import MaterialModel from './MaterialModel'
import TransportVehicleModel from './TransportVehicleModel'

export default class MaterialTransportModel extends Model {
    static table = 'material_transports'

    @field('server_id') serverId: number

    @field('work_routes_id') workRoutesId: string

    @field('arrival_location') arrivalLocation: string

    @field('departure_location') departureLocation: string

    @field('km') km: number

    @field('unit_value') unitValue: number

    @field('value') value: number

    @field('transport_vehicle_id') transportVehicleId: string

    @field('name_proprietary') nameProprietary: string

    @field('cpf_cnpj_proprietary') cpfCnpjProprietary: string

    @field('tel_proprietary') telProprietary: string

    @field('motorist') motorist: string

    @field('plate') plate: string

    @field('capacity') capacity: number

    @field('material_id') materialId: string

    @field('material_name') materialName: string

    @field('is_reference_capacity') isReferenceCapacity: boolean

    @field('quantity') quantity: number

    @field('delivery_picket') deliveryPicket: string

    @field('total_pickets') totalPickets: number

    @field('distance_traveled_within_the_work') distanceTraveledWithinTheWork: number

    @field('observation') observation: string

    @field('invoice_id') invoiceId: number

    @field('invoice_status') invoiceStatus: string

    @field('work_id') workId: string

    @field('enterprise_id') enterpriseId: string

    @field('user_id') userId: string

    @field('user_action') userAction: number

    @field('is_valid') isValid: boolean

    @readonly @date('created_at') createdAt: number

    @date('updated_at') updatedAt: number

    async workRoutes(): Promise<WorkRoutesModel> {
        return await this.database.get<WorkRoutesModel>(TableName.WORK_ROUTES).find(this.workRoutesId)
    }

    async transportVehicle(): Promise<TransportVehicleModel> {
        return await this.database
            .get<TransportVehicleModel>(TableName.TRANSPORT_VEHICLES)
            .find(this.transportVehicleId)
    }

    async material(): Promise<MaterialModel> {
        return await this.database.get<MaterialModel>(TableName.MATERIAL).find(this.materialId)
    }
}
