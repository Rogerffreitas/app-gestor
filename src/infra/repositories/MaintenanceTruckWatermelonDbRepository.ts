import { MaintenanceTruckRepositoryGateway } from '@gestor/domain/application/gateways/MaintenanceTruckRepositoryGateway'
import MaintenanceTruckModel from '../../database/model/MaintenanceTruckModel'
import { TableName, UserAction } from '../../types'
import { Database, Q } from '@nozbe/watermelondb'
import { MaintenanceTruckEntity } from '@gestor/domain/entity/maintenance-truck/MaintenanceTruckEntity'
import Mappers from './mappers'

export class MaintenanceTruckWatermelonDbRepository implements MaintenanceTruckRepositoryGateway {
    private readonly database: Database
    constructor(db: Database) {
        this.database = db
    }

    async createMaintenanceTruckInLocalDatabase(
        entity: MaintenanceTruckEntity
    ): Promise<MaintenanceTruckEntity> {
        try {
            const entityCreated = await this.database.write(async () => {
                return await this.database
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
                        item.userAction = UserAction.CREATE
                        item.isValid = true
                        item.serverId = +0
                    })
            })
            return new MaintenanceTruckEntity().modelToEntity(Mappers.maintenanceTruckMapper(entityCreated))
        } catch (error) {
            console.log('[MaintenanceTruckRepository]: ' + error)
            throw new Error('Error create maintenace trucks in local database. ', { cause: error })
        }
    }
    async updateMaintenanceTruckInLocalDatabase(
        entity: MaintenanceTruckEntity
    ): Promise<MaintenanceTruckEntity> {
        try {
            const entityUpdated = await this.database.write(async () => {
                const result = await this.database
                    .get<MaintenanceTruckModel>(TableName.MAINTENANCE_TRUCKS)
                    .find(entity.id)
                return await result.update(() => {
                    result.capacity = entity.capacity
                    result.operatorMotorist = entity.operatorMotorist
                    result.nameProprietary = entity.nameProprietary
                    result.modelOrPlate = entity.modelOrPlate
                    result.usersList = entity.usersList
                    result.userAction = UserAction.UPDATE
                    result.userId = entity.userId
                })
            })
            return new MaintenanceTruckEntity().modelToEntity(Mappers.maintenanceTruckMapper(entityUpdated))
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
        try {
            const [fuelCount1, fuelCount2] = await Promise.all([
                this.database
                    .get(TableName.FUEL_SUPPLYS)
                    .query(Q.where('transport_vehicle_or_work_equipment_id', workEquipmentId))
                    .fetchCount(),
                this.database
                    .get(TableName.FUEL_SUPPLYS)
                    .query(Q.where('maintenance_trucks_work_equipment_id', workEquipmentId))
                    .fetchCount(),
            ])

            const totalDependencies = fuelCount1 + fuelCount2

            if (totalDependencies > 0) {
                throw new Error('Error deleting maintenace trucks in local database.')
            }

            await this.database.write(async () => {
                const result = await this.database
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
    async findMaintenanceTruckByIdInLocalDatabase(id: string): Promise<MaintenanceTruckEntity> {
        try {
            const result = await this.database.get<MaintenanceTruckModel>(TableName.EQUIPMENTS).find(id)
            return new MaintenanceTruckEntity().modelToEntity(Mappers.maintenanceTruckMapper(result))
        } catch (error) {
            console.log('[MaintenanceTruckRepository]: ' + error)
            throw new Error('Error find MaintenanceTruck in local database: ', { cause: error })
        }
    }

    async loadAllMaintenanceTruckByEnterpriseIdAndWorkIdFromLocalDatabase(
        enterpriseId: string,
        workId: string
    ): Promise<MaintenanceTruckEntity[]> {
        try {
            const result = await this.database
                .get<MaintenanceTruckModel>(TableName.MAINTENANCE_TRUCKS)
                .query(
                    Q.sortBy('created_at', Q.desc),
                    Q.where('is_valid', true),
                    Q.where('enterprise_id', enterpriseId),
                    Q.where('work_id', workId)
                )

            return result.map((item: MaintenanceTruckModel) => {
                return new MaintenanceTruckEntity().modelToEntity(Mappers.maintenanceTruckMapper(item))
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
            const result = await this.database.get<MaintenanceTruckModel>(TableName.MAINTENANCE_TRUCKS).query(
                Q.sortBy('created_at', Q.desc),
                Q.where('is_valid', true),
                Q.where('enterprise_id', enterpriseId),
                Q.where('work_id', workId)
                //Q.where('server_id', Q.gt(0))
            )
            return await Promise.all(
                result.map((item: MaintenanceTruckModel) => {
                    return new MaintenanceTruckEntity().modelToEntity(Mappers.maintenanceTruckMapper(item))
                })
            )
        } catch (error) {
            console.log('[MaintenanceTruckRepository]: ' + error)
            throw new Error('Error loading maintenace trucks from local database.', { cause: error })
        }
    }
}
