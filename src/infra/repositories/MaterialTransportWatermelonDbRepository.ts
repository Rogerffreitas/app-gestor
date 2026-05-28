import { MaterialTransportRepositoryGateway } from '@gestor/domain/application/gateways/MaterialTransportRepositoryGateway'
import MaterialTransportModel from '../../database/model/MaterialTransportModel'
import { InvoiceStatus, TableName, UserAction } from '../../types'
import { Database, Q } from '@nozbe/watermelondb'
import { MaterialTransportEntity } from '@gestor/domain/entity/material-transport/MaterialTransportEntity'
import Mappers from './mappers'

export class MaterialTransportWatermelonDbRepository implements MaterialTransportRepositoryGateway {
    private readonly database: Database
    constructor(db: Database) {
        this.database = db
    }

    async createMaterialTransportInLocalDatabase(
        entity: MaterialTransportEntity
    ): Promise<MaterialTransportEntity> {
        console.log('Creating Material Transport in the database')
        try {
            const entityCreated = await this.database.write(async () => {
                return await this.database
                    .get<MaterialTransportModel>(TableName.MATERIAL_TRANSPORTS)
                    .create((item) => {
                        item.workRoutesId = entity.workRoutesId
                        item.arrivalLocation = entity.arrivalLocation
                        item.departureLocation = entity.departureLocation
                        item.km = +entity.km
                        item.unitValue = +entity.unitValue
                        item.transportVehicleId = entity.transportVehicleId
                        item.nameProprietary = entity.nameProprietary
                        item.cpfCnpjProprietary = entity.cpfCnpjProprietary
                        item.telProprietary = entity.telProprietary
                        item.motorist = entity.motorist
                        item.plate = entity.plate
                        item.capacity = +entity.capacity
                        item.materialId = entity.materialId
                        item.materialName = entity.materialName

                        item.value = +entity.value
                        item.isReferenceCapacity = entity.isReferenceCapacity
                        item.quantity = +entity.quantity
                        item.deliveryPicket = entity.deliveryPicket
                        item.totalPickets = +entity.totalPickets
                        item.distanceTraveledWithinTheWork = +entity.distanceTraveledWithinTheWork
                        item.observation = entity.observation

                        item.invoiceId = +0
                        item.invoiceStatus = InvoiceStatus.PENDING
                        item.workId = entity.workId
                        item.enterpriseId = entity.enterpriseId
                        item.userId = entity.userId
                        item.userAction = UserAction.CREATE
                        item.isValid = true
                        item.serverId = +0
                    })
            })
            console.log('Entity created: ' + entityCreated)
            return await new MaterialTransportEntity().modelToEntity(
                await Mappers.materialTransportMapper(entityCreated)
            )
        } catch (error) {
            console.log('[MaterialTransport]: ' + error)
            throw new Error('Error create Material Transport in local database ', { cause: error })
        }
    }
    async deleteMaterialTransportInLocalDatabase(id: string, userId: string): Promise<void> {
        try {
            await this.database.write(async () => {
                const result = await this.database
                    .get<MaterialTransportModel>(TableName.MATERIAL_TRANSPORTS)
                    .find(id)
                await result.update(() => {
                    result.userId = userId
                    result.userAction = UserAction.DELETE
                    result.isValid = false
                })
            })
        } catch (error) {
            console.log('[MaterialTransport]: ' + error)
            throw new Error('Error deleting Material Transport in local database.')
        }
    }
    saveMaterialTransportServerId(entiteis: MaterialTransportEntity[]): void {
        throw new Error('Method not implemented.')
    }
    async loadAllMaterialTransportByEnterpriseIdAndWorkIdAndVehicleIdFromLocalDatabase(
        enterpriseId: string,
        workId: string,
        vehicleId: string
    ): Promise<MaterialTransportEntity[]> {
        try {
            const result = await this.database
                .get<MaterialTransportModel>(TableName.MATERIAL_TRANSPORTS)
                .query(
                    Q.sortBy('created_at', Q.desc),
                    Q.where('is_valid', true),
                    Q.where('enterprise_id', enterpriseId),
                    Q.where('work_id', workId),
                    Q.where('transport_vehicle_id', vehicleId),
                    Q.where('invoice_id', 0),
                    Q.where('invoice_status', InvoiceStatus.PENDING)
                )

            return await Promise.all(
                result.map(async (item: MaterialTransportModel) => {
                    return new MaterialTransportEntity().modelToEntity(
                        await Mappers.materialTransportMapper(item)
                    )
                })
            )
        } catch (error) {
            console.log('[MaintenanceTruckRepository]: ' + error)
            throw new Error('Error loading maintenace trucks from local database.', { cause: error })
        }
    }

    async findMaterialTransportVehicleByIdInLocalDatabase(id: string): Promise<MaterialTransportEntity> {
        try {
            const result = await this.database
                .get<MaterialTransportModel>(TableName.MATERIAL_TRANSPORTS)
                .find(id)

            return new MaterialTransportEntity().modelToEntity(await Mappers.materialTransportMapper(result))
        } catch (error) {
            console.log('[TransportVehicleEntityRepository]: ' + error)
            throw new Error('an error occurred while trying to load model ', { cause: error })
        }
    }
}
