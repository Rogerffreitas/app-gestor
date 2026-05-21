import { Database, Q } from '@nozbe/watermelondb'
import WorkModel from '../../database/model/WorkModel'
import { UserAction } from '../../types'
import { TableName } from '../../types'
import { WorkRepositoryGateway } from '../../domain/application/gateways/WorkRepositoryGateway'
import WorkEntity from '../../domain/entity/work/WorkEntity'
import Mappers from './mappers'

export class WorkWatermelonDbRepository implements WorkRepositoryGateway {
    private readonly database: Database

    constructor(db: Database) {
        this.database = db
    }

    async createWorkInLocalDatabase(entity: WorkEntity): Promise<WorkEntity> {
        try {
            const entityCreated = await this.database.write(async () => {
                return await this.database.get<WorkModel>(TableName.WORKS).create((work) => {
                    work.name = entity.name
                    work.description = entity.description
                    work.pickets = +entity.pickets
                    work.enterpriseId = entity.enterpriseId
                    work.userId = entity.userId
                    work.usersList = entity.usersList
                    work.userAction = UserAction.CREATE
                    work.isValid = true
                    work.serverId = 0
                })
            })
            return new WorkEntity().toEntity(Mappers.workMapper(entityCreated))
        } catch (error) {
            console.log('[WorkRepository]: ' + error)
            throw new Error('Error create work in local database.' + error)
        }
    }
    async updateWorkInLocalDatabase(entity: WorkEntity): Promise<WorkEntity> {
        try {
            const entityUpdated = await this.database.write(async () => {
                const result = await this.database.get<WorkModel>(TableName.WORKS).find(entity.id)
                return await result.update(() => {
                    result.userAction = UserAction.UPDATE
                    result.userId = entity.userId
                    result.name = entity.name
                    result.description = entity.description
                    result.pickets = +entity.pickets
                })
            })
            return new WorkEntity().toEntity(Mappers.workMapper(entityUpdated))
        } catch (error) {
            console.log('[WorkRepositoty]: ' + error)
            throw new Error('Error updating work in local database.' + error)
        }
    }
    async deleteWorkInLocalDatabase(id: string, userId: string): Promise<void> {
        const [transportCount, fuelCount, discountCount] = await Promise.all([
            this.database.get(TableName.MATERIAL_TRANSPORTS).query(Q.where('work_id', id)).fetchCount(),
            this.database.get(TableName.FUEL_SUPPLYS).query(Q.where('work_id', id)).fetchCount(),
            this.database.get(TableName.DISCOUNTS).query(Q.where('work_id', id)).fetchCount(),
        ])

        const totalDependencies = transportCount + fuelCount + discountCount

        if (totalDependencies > 0) {
            throw new Error(
                'A obra não pode ser excluída, pois existem registros associados (transporte, combustível ou descontos).'
            )
        }

        try {
            await this.database.write(async () => {
                const workToUpdate = await this.database.get<WorkModel>(TableName.WORKS).find(id)
                await workToUpdate.update(() => {
                    workToUpdate.userAction = UserAction.DELETE
                    workToUpdate.userId = userId
                    workToUpdate.isValid = false
                })
            })
        } catch (error) {
            console.error('[WorkRepositoty]: Error deleting work in local database.' + error)
            throw new Error('Error deleting work in local database.' + error)
        }
    }
    async findWorkByIdInLocalDatabase(id: string): Promise<WorkEntity> {
        try {
            const result = await this.database.get<WorkModel>(TableName.WORKS).find(id)
            return new WorkEntity().toEntity(Mappers.workMapper(result))
        } catch (error) {
            throw new Error('Error loading works from local database.' + error)
        }
    }
    async loadAllWorksByEnterpriseIdFromLocalDatabase(enterpriseId: string): Promise<WorkEntity[]> {
        try {
            const result = await this.database
                .get<WorkModel>(TableName.WORKS)
                .query(
                    Q.sortBy('created_at', Q.desc),
                    Q.where('enterprise_id', enterpriseId),
                    Q.where('is_valid', true)
                )
                .fetch()
            return result.map((item: WorkModel) => {
                return new WorkEntity().toEntity(Mappers.workMapper(item))
            })
        } catch (error) {
            console.log('[WorkRepositoty]: ' + error)
            throw new Error('Error loading works from local database.' + error)
        }
    }
    async loadAllWorksByEnterpriseIdAndUserIdFromLocalDatabase(
        enterpriseId: string,
        userId: string
    ): Promise<WorkEntity[]> {
        try {
            const result = await this.database
                .get<WorkModel>(TableName.WORKS)
                .query(
                    Q.sortBy('created_at', Q.desc),
                    Q.where('enterprise_id', enterpriseId),
                    Q.where('is_valid', true),
                    Q.where('users_list', Q.like(`%${userId}%`))
                )
                .fetch()
            return result.map((item: WorkModel) => {
                return new WorkEntity().toEntity(Mappers.workMapper(item))
            })
        } catch (error) {
            console.log('[WorkRepositoty]: ' + error)
            throw new Error('Error loading works from local database.' + error)
        }
    }
    async saveWorkServerId(entitys: WorkEntity[]): Promise<void> {
        const result = entitys.map(async (item) => {
            await this.database
                .write(async () => {
                    const result = await this.database.get<WorkModel>(TableName.WORKS).find(item.id)
                    await result.update(() => {
                        result.serverId = item.serverId
                    })
                })
                .catch((error) => {
                    throw new Error(error)
                })
        })
    }
    async loadAllWorkByEnterpriseIdAndUserIdAndValidServerIdFromDatabase(
        enterpriseId: string,
        userId: string
    ): Promise<WorkEntity[]> {
        try {
            const result = await this.database
                .get<WorkModel>(TableName.WORKS)
                .query(
                    Q.sortBy('created_at', Q.desc),
                    Q.where('enterprise_id', enterpriseId),
                    Q.where('is_valid', true),
                    Q.where('users_list', Q.like(`%${userId}%`)),
                    Q.where('server_id', Q.gt(0))
                )
                .fetch()
            return result.map((item: WorkModel) => {
                return new WorkEntity().toEntity(Mappers.workMapper(item))
            })
        } catch (error) {
            console.log('[WorkRepositoty]: ' + error)
            throw new Error('Error loading works from local database.' + error)
        }
    }
}
