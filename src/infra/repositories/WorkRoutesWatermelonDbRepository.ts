import { Q } from '@nozbe/watermelondb'
import { database } from '../../database'
import WorkRoutesModel from '../../database/model/WorkRouteModel'
import { UserAction } from '../../types'
import { TableName } from '../../types'
import { WorkRoutesRepositoryGateway } from '@domin/application/gateways/WorkRoutesRepositoryGateway'
import WorkRoutesEntity from '@domin/entity/work-routes/WorkRoutesEntity'
import Mappers from './mappers'

export class WorkRoutesWatermelonDbRepository implements WorkRoutesRepositoryGateway {
    async createWorkRoutesInLocalDatabase(entity: WorkRoutesEntity): Promise<WorkRoutesEntity> {
        try {
            const entityCreated = await database.write(async () => {
                return await database.get<WorkRoutesModel>(TableName.WORK_ROUTES).create((item) => {
                    item.workId = entity.work.id
                    item.depositId = entity.deposit.id
                    item.arrivalLocation = entity.arrivalLocation
                    item.departureLocation = entity.departureLocation

                    item.km = +entity.km
                    item.initialPicket = +entity.initialPicket
                    item.value = +entity.value
                    item.isFixedValue = entity.isFixedValue
                    item.enterpriseId = entity.enterpriseId
                    item.userId = entity.userId
                    item.userAction = UserAction.CREATE
                    item.isValid = true
                    item.serverId = 0
                })
            })

            return new WorkRoutesEntity().modelToEntity(await Mappers.workRoutesMapper(entityCreated))
        } catch (error) {
            console.log('[WorkRoutes]: ' + error)
            throw new Error('Error create route in local database. ' + error)
        }
    }
    async updateWorkRoutesInLocalDatabase(entity: WorkRoutesEntity): Promise<WorkRoutesEntity> {
        try {
            const entityUpdated = await database.write(async () => {
                const item = await database.get<WorkRoutesModel>(TableName.WORK_ROUTES).find(entity.id)
                return await item.update(() => {
                    item.arrivalLocation = entity.arrivalLocation
                    item.departureLocation = entity.departureLocation
                    item.km = +entity.km
                    item.initialPicket = +entity.initialPicket
                    item.value = +entity.value
                    item.isFixedValue = entity.isFixedValue
                    item.userAction = UserAction.UPDATE
                    item.userId = entity.userId
                })
            })
            return new WorkRoutesEntity().modelToEntity(await Mappers.workRoutesMapper(entityUpdated))
        } catch (error) {
            console.log('[WorkRoutes]: ' + error)
            throw new Error('Error updating route in local database. ' + error)
        }
    }
    async deleteWorkRoutesInLocalDatabase(id: string, userId: string): Promise<void> {
        const t = await database
            .get(TableName.MATERIAL_TRANSPORTS)
            .query(
                Q.unsafeSqlQuery(
                    `select count(*) as count from ${TableName.MATERIAL_TRANSPORTS} where work_routes_id = ?`,
                    [id]
                )
            )
            .fetchCount()

        if (t > 0) {
            throw new Error('Não é possível apagar a Rota')
        }
        try {
            let result

            await database.write(async () => {
                const result = await database.get<WorkRoutesModel>(TableName.WORK_ROUTES).find(id)
                await result.update(() => {
                    result.userAction = UserAction.DELETE
                    result.userId = userId
                    result.isValid = false
                })
            })
            return result
        } catch (error) {
            console.log('[WorkRoutes]: ' + error)
            throw new Error('Error deleting route in local database.')
        }
    }
    findWorkRoutesByIdInLocalDatabase(id: string): Promise<WorkRoutesEntity> {
        throw new Error('Method not implemented.')
    }

    async loadAllWorkRoutesByEnterpriseIdAndWorkIdFromLocalDatabase(
        enterpriseId: string,
        workId: string
    ): Promise<WorkRoutesEntity[]> {
        try {
            const result = await database
                .get<WorkRoutesModel>(TableName.WORK_ROUTES)
                .query(
                    Q.sortBy('created_at', Q.desc),
                    Q.where('work_id', workId),
                    Q.where('enterprise_id', enterpriseId),
                    Q.where('is_valid', true)
                )
                .fetch()

            return await Promise.all(
                result.map(async (item) => {
                    return new WorkRoutesEntity().modelToEntity(await Mappers.workRoutesMapper(item))
                })
            )
        } catch (error) {
            console.log('[WorkRoutes]: ' + error)
            throw new Error('Error loading routes from local database.' + error)
        }
    }

    async loadAllWorkRoutesByEnterpriseIdAndServerIdValidFromLocalDatabase(
        enterpriseId: string,
        workId: string
    ): Promise<WorkRoutesEntity[]> {
        try {
            const result = await database
                .get<WorkRoutesModel>(TableName.WORK_ROUTES)
                .query(
                    Q.where('is_valid', true),
                    Q.sortBy('created_at', Q.desc),
                    Q.where('work_id', workId),
                    Q.where('enterprise_id', enterpriseId),
                    Q.where('server_id', Q.gt(0))
                )
                .fetch()
            return await Promise.all(
                result.map(async (item) => {
                    return new WorkRoutesEntity().modelToEntity(await Mappers.workRoutesMapper(item))
                })
            )
        } catch (error) {
            console.log('[WorkRoutes]: ' + error)
            throw new Error('Error loading routes from local database.' + error)
        }
    }

    async saveWorkRoutesServerId(entitys: WorkRoutesEntity[]): Promise<void> {
        const result = entitys.map(async (item) => {
            await database
                .write(async () => {
                    const result = await database.get<WorkRoutesModel>(TableName.WORK_ROUTES).find(item.id)
                    await result.update(() => {
                        result.serverId = item.serverId
                    })
                })
                .catch((error) => {
                    throw new Error(error)
                })
        })
    }
}
