import { database } from '../database'
import MaintenanceTruckModel from '../database/model/MaintenanceTruckModel'
import { MaintenanceTruckRepositoryGateway } from '../domin/application/gateways/MaintenanceTruckRepositoryGateway'
import { MaintenanceTruckEntity } from '../domin/entity/maintenance-truck/MaintenanceTruckEntity'
import { TableName, UserAction } from '../types'
import { Q } from '@nozbe/watermelondb'

export class MaintenanceTruckWatermelonDbRepository implements MaintenanceTruckRepositoryGateway {
    async createMaintenanceTruckInLocalDatabase(
        entity: MaintenanceTruckEntity
    ): Promise<MaintenanceTruckEntity> {
        try {
            const entityCreated = await database.write(async () => {
                return await database
                    .get<MaintenanceTruckModel>(TableName.MAINTENANCE_TRUCKS)
                    .create((item) => {
                        item.capacity = +entity.capacity
                        item.operatorMotorist = entity.operatorMotorist
                        item.nameProprietary = entity.nameProprietary
                        item.modelOrPlate = entity.modelOrPlate
                        item.usersList = entity.usersList
                        item.workId = entity.workId
                        item.workEquipmentId = entity.workEquipmentId
                        item.enterpriseId = entity.enterpriseId
                        item.userId = entity.userId
                        item.userAction = entity.userAction
                        item.isValid = entity.isValid
                        item.serverId = entity.serverId
                    })
            })
            return new MaintenanceTruckEntity().modelToEntity(entityCreated)
        } catch (error) {
            console.log('[MaintenanceTruckRepository]: ' + error)
            throw new Error('Error create maintenace trucks in local database. ', { cause: error })
        }
    }
    async updateMaintenanceTruckInLocalDatabase(
        entity: MaintenanceTruckEntity
    ): Promise<MaintenanceTruckEntity> {
        try {
            const entityUpdated = await database.write(async () => {
                const result = await database
                    .get<MaintenanceTruckModel>(TableName.MAINTENANCE_TRUCKS)
                    .find(entity.id)
                return await result.update(() => {
                    result.capacity = entity.capacity
                    result.operatorMotorist = entity.operatorMotorist
                    result.nameProprietary = entity.nameProprietary
                    result.modelOrPlate = entity.modelOrPlate
                    result.usersList = entity.usersList
                    result.userAction = entity.userAction
                    result.userId = entity.userId
                    result.isValid = entity.isValid
                })
            })
            return new MaintenanceTruckEntity().modelToEntity(entityUpdated)
        } catch (error) {
            console.log('[MaintenanceTruckRepository]: ' + error)
            throw new Error('Error updating maintenace trucks in local database. ', { cause: error })
        }
    }
    async deleteMaintenanceTruckInLocalDatabase(
        id: string,
        workEquipmentId: string,
        userId: string
    ): Promise<void> {
        const [fuelCount1, fuelCount2] = await Promise.all([
            database
                .get(TableName.FUEL_SUPPLYS)
                .query(Q.where('transport_vehicle_or_equipment_id', workEquipmentId))
                .fetchCount(),
            database
                .get(TableName.FUEL_SUPPLYS)
                .query(Q.where('maintenance_trucks_work_equipment_id', workEquipmentId))
                .fetchCount(),
        ])

        const totalDependencies = fuelCount1 + fuelCount2

        if (totalDependencies > 0) {
            throw new Error('Error deleting maintenace trucks in local database.')
        }
        try {
            await database.write(async () => {
                const result = await database
                    .get<MaintenanceTruckModel>(TableName.MAINTENANCE_TRUCKS)
                    .find(id)
                await result.update(() => {
                    result.userId = userId
                    result.userAction = UserAction.DELETE
                    result.isValid = false
                })
            })
        } catch (error) {
            console.log('[MaintenanceTruckRepository]: ' + error)
            throw new Error('Error deleting maintenace trucks in local database.')
        }
    }
    findMaintenanceTruckByIdInLocalDatabase(id: string): Promise<MaintenanceTruckEntity> {
        throw new Error('Method not implemented.')
    }
    saveMaintenanceTruckServerId(entities: MaintenanceTruckEntity[]): void {
        throw new Error('Method not implemented.')
    }
    async loadAllMaintenanceTruckByEnterpriseIdAndWorkIdFromLocalDatabase(
        enterpriseId: string,
        workId: string
    ): Promise<MaintenanceTruckEntity[]> {
        try {
            const result = await database
                .get<MaintenanceTruckModel>(TableName.MAINTENANCE_TRUCKS)
                .query(
                    Q.sortBy('created_at', Q.desc),
                    Q.where('is_valid', true),
                    Q.where('enterprise_id', enterpriseId),
                    Q.where('work_id', workId)
                )

            return result.map((item: MaintenanceTruckModel) => {
                return new MaintenanceTruckEntity().modelToEntity(item)
            })
        } catch (error) {
            console.log('[MaintenanceTruckRepository]: ' + error)
            throw new Error('Error loading maintenace trucks from local database.', { cause: error })
        }
    }
    async loadAllMaintenanceTruckByEnterpriseIdAndServerIdValidFromLocalDatabase(
        enterpriseId: string,
        workId: string
    ): Promise<MaintenanceTruckEntity[]> {
        try {
            const result = await database.get<MaintenanceTruckModel>(TableName.MAINTENANCE_TRUCKS).query(
                Q.sortBy('created_at', Q.desc),
                Q.where('is_valid', true),
                Q.where('enterprise_id', enterpriseId),
                Q.where('work_id', workId)
                //Q.where('server_id', Q.gt(0))
            )
            return await Promise.all(
                result.map((item: MaintenanceTruckModel) => {
                    return new MaintenanceTruckEntity().modelToEntity(item)
                })
            )
        } catch (error) {
            console.log('[MaintenanceTruckRepository]: ' + error)
            throw new Error('Error loading maintenace trucks from local database.', { cause: error })
        }
    }
}
