import { database } from '../database'
import { Q } from '@nozbe/watermelondb'
import FuelSupplyModel from '../database/model/FuelSupplyModel'
import { FuelSupplyRepositoryGateway } from '../domin/application/gateways/FuelSupplyRepositoryGateway'
import { FuelSupplyEntity } from '../domin/entity/fuel-supply/FuelSupplyEntity'
import { FuelSupplyTypes, InvoiceStatus, TableName, UserAction } from '../types'

export class FuelSupplyWatermelonDbRepository implements FuelSupplyRepositoryGateway {
    async createFuelSupplyInLocalDatabase(entity: FuelSupplyEntity): Promise<FuelSupplyEntity> {
        console.log('Creating Fuel Supply in the database')
        console.log(entity)
        try {
            const entityCreated = await database.write(async () => {
                return await database
                    .get<FuelSupplyModel>('fuel_supples')
                    .create((item) => {
                        ;((item.quantity = 100),
                            (item.valuePerLiter = 100),
                            (item.value = 100),
                            (item.description = 'teste'),
                            (item.type = 'teste'),
                            (item.transportVehicleOrWorkEquipmentId = 'tetste'),
                            (item.isGasStation = false),
                            (item.maintenanceTrucksWorkEquipmentId = 'teste'),
                            (item.hourMeterOrKmMeter = 100),
                            (item.isDiscount = true),
                            (item.observation = 'entity.observation'),
                            (item.invoiceId = 2),
                            (item.invoiceStatus = 'InvoiceStatus.PENDING'),
                            (item.workId = 'sdsdsds'),
                            (item.enterpriseId = 'tetste'),
                            (item.userId = 'entity.userId'),
                            (item.userAction = 1),
                            (item.isValid = true),
                            (item.serverId = 1))
                    })
                    .catch((e) => console.log('error ' + e))
            })
            if (entityCreated) {
                console.log('Entity created= ' + entityCreated)
                return FuelSupplyEntity.modelToEntity({} as FuelSupplyModel)
            }
        } catch (error) {
            console.log('[FuelSupply]= ' + error)
            throw new Error('Error create Fuel Supply in local database ', { cause: error })
        }
    }
    async updateFuelSupplyInLocalDatabase(entity: FuelSupplyEntity): Promise<FuelSupplyEntity> {
        console.log('Updating Fuel Supply in the database')
        try {
            const result = await database.write(async () => {
                const item = await database.get<FuelSupplyModel>(TableName.FUEL_SUPPLYS).find(entity.id)
                return await item.update(() => {
                    item.quantity = +entity.quantity
                    item.valuePerLiter = +entity.valuePerLiter
                    item.value = +entity.value
                    item.description = entity.description
                    item.type = entity.type
                    item.isGasStation = entity.isGasStation
                    item.hourMeterOrKmMeter = entity.hourMeterOrKmMeter
                    item.isDiscount = entity.isDiscount
                    item.observation = entity.observation
                    item.userId = entity.userId
                    item.userAction = UserAction.UPDATE
                })
            })
            return FuelSupplyEntity.modelToEntity(result)
        } catch (error) {
            console.log('[FuelSupply]= ' + error)
            throw new Error('Error create Fuel Supply in local database= ', { cause: error })
        }
    }
    async deleteFuelSupplyInLocalDatabase(id: string, userId: string): Promise<void> {
        const a = await database
            .get(TableName.FUEL_SUPPLYS)
            .query(Q.where('id', id), Q.where('invoice_status', Q.notEq(InvoiceStatus.PENDING)))
            .fetchCount()

        if (a > 0) {
            throw new Error('Não é possível apagar o Abastecimento')
        }
        await database.write(async () => {
            const result = await database.get<FuelSupplyModel>(TableName.FUEL_SUPPLYS).find(id)
            await result.update(() => {
                result.isValid = false
                result.userId = userId
                result.userAction = UserAction.DELETE
            })
        })
    }
    saveFuelSupplyServerId(entiteis: FuelSupplyEntity[]): void {
        throw new Error('Method not implemented.')
    }

    loadById(id: string): Promise<FuelSupplyEntity> {
        throw new Error('Method not implemented.')
    }

    async loadLastSupplyByEnterpriseIdAndWorkIdAndMaintenanceTruckIdFromLocalDatabase(
        enterpriseId: string,
        workId: string,
        maintenanceTrucksWorkEquipmentId: string
    ): Promise<FuelSupplyEntity> {
        try {
            const result = await database
                .get<FuelSupplyModel>(TableName.FUEL_SUPPLYS)
                .query(
                    Q.sortBy('created_at', Q.desc),
                    Q.where('enterprise_id', enterpriseId),
                    Q.where('work_id', workId),
                    Q.where('is_valid', true),
                    Q.where('maintenance_trucks_work_equipment_id', maintenanceTrucksWorkEquipmentId),
                    Q.where('type', FuelSupplyTypes.MAINTENANCE_TRUCK_TANK),
                    Q.take(1)
                )
                .fetch()

            return FuelSupplyEntity.modelToEntity(result[0])
        } catch (error) {
            console.log('[FuelSupplyRepository]= ' + error)
            throw new Error('Error loading maintenace trucks fuel supply from local database.', {
                cause: error,
            })
        }
    }

    async loadCurrentBalanceTankByEnterpriseIdAndWorkIdAndMaintenanceTruckIdFromLocalDatabase(
        enterpriseId: string,
        workId: string,
        maintenanceTrucksWorkEquipmentId: string
    ): Promise<number> {
        try {
            const sum = await database
                .get(TableName.FUEL_SUPPLYS)
                .query(
                    Q.unsafeSqlQuery(
                        `select sum(quantity) as total_tank from ${TableName.FUEL_SUPPLYS} where work_id == ${workId} and maintenance_trucks_work_equipment_id == ${maintenanceTrucksWorkEquipmentId} and enterprise_id == ${enterpriseId} and type == ${FuelSupplyTypes.MAINTENANCE_TRUCK_TANK} and is_valid == true`
                    )
                )
                .unsafeFetchRaw()
            const sum2 = await database
                .get(TableName.FUEL_SUPPLYS)
                .query(
                    Q.unsafeSqlQuery(
                        `select sum(quantity) as total_fuel_supply from ${TableName.FUEL_SUPPLYS} where work_id == ${workId} and maintenance_trucks_work_equipment_id == ${maintenanceTrucksWorkEquipmentId} and enterprise_id == ${enterpriseId} and type != ${FuelSupplyTypes.MAINTENANCE_TRUCK_TANK} and is_valid == true`
                    )
                )
                .unsafeFetchRaw()

            return sum[0].total_tank - sum2[0].total_fuel_supply
        } catch (err) {
            console.log(err.message)
        }
    }

    async loadAllFuelSupplyByEnterpriseIdAndWorkIdAndMaintenanceTruckIdFromLocalDatabase(
        enterpriseId: string,
        workId: string,
        maintenanceTrucksWorkEquipmentId: string
    ): Promise<FuelSupplyEntity[]> {
        try {
            const result = await database
                .get<FuelSupplyModel>(TableName.FUEL_SUPPLYS)
                .query(
                    Q.sortBy('created_at', Q.desc),
                    Q.where('enterprise_id', enterpriseId),
                    Q.where('work_id', workId),
                    Q.where('is_valid', true),
                    Q.where('maintenance_trucks_work_equipment_id', maintenanceTrucksWorkEquipmentId),
                    Q.where('invoice_status', InvoiceStatus.PENDING)
                )
                .fetch()

            return await Promise.all(
                result.map(async (item: FuelSupplyModel) => {
                    return FuelSupplyEntity.modelToEntity(item)
                })
            )
        } catch (error) {
            console.log('[FuelSupplyRepository]: ' + error)
            throw new Error('Error loading fuel supply from local database.', {
                cause: error,
            })
        }
    }

    async loadAllFuelSupplyByEnterpriseIdAndWorkIdAndMaintenanceTruckIdAndTypeFromLocalDatabase(
        enterpriseId: string,
        workId: string,
        maintenanceTrucksWorkEquipmentId: string,
        type: string
    ): Promise<FuelSupplyEntity[]> {
        try {
            const result = await database
                .get<FuelSupplyModel>(TableName.FUEL_SUPPLYS)
                .query(
                    Q.sortBy('created_at', Q.desc),
                    Q.where('enterprise_id', enterpriseId),
                    Q.where('work_id', workId),
                    Q.where('is_valid', true),
                    Q.where('maintenance_trucks_work_equipment_id', maintenanceTrucksWorkEquipmentId),
                    Q.where('type', type),
                    Q.where('invoice_status', InvoiceStatus.PENDING)
                )
                .fetch()

            return await Promise.all(
                result.map(async (item: FuelSupplyModel) => {
                    return FuelSupplyEntity.modelToEntity(item)
                })
            )
        } catch (error) {
            console.log('[FuelSupplyRepository]= ' + error)
            throw new Error('Error loading fuel supply from local database.', {
                cause: error,
            })
        }
    }

    async loadAllFuelSupplyByEnterpriseIdAndWorkIdAndVehicleIdAndTypeFromLocalDatabase(
        enterpriseId: string,
        workId: string,
        transportVehicleOrWorkEquipmentId: string,
        type: string
    ): Promise<FuelSupplyEntity[]> {
        try {
            const result = await database
                .get<FuelSupplyModel>(TableName.FUEL_SUPPLYS)
                .query(
                    Q.sortBy('created_at', Q.desc),
                    Q.where('enterprise_id', enterpriseId),
                    Q.where('work_id', workId),
                    Q.where('is_valid', true),
                    Q.where('transport_vehicle_or_work_equipment_id', transportVehicleOrWorkEquipmentId),
                    Q.where('type', type),
                    Q.where('invoice_status', InvoiceStatus.PENDING)
                )
                .fetch()
            return await Promise.all(
                result.map(async (item: FuelSupplyModel) => {
                    return FuelSupplyEntity.modelToEntity(item)
                })
            )
        } catch (error) {
            console.log('[FuelSupplyRepository]= ' + error)
            throw new Error('Error loading fuel supply from local database.', {
                cause: error,
            })
        }
    }
}
