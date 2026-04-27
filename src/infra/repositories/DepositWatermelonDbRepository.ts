import { Q } from '@nozbe/watermelondb'
import { database } from '../../database'
import DepositModel from '../../database/model/DepositModel'
import { DepositRepositoryGateway } from '@domin/application/gateways/DepositRepositoryGateway'
import { TableName, UserAction } from '../../types'
import DepositEntity from '@domin/entity/deposit/DepositEntity'
import Mappers from './mappers'

export class DepositWatermelonDbRepository implements DepositRepositoryGateway {
    saveDepositServerId(entitys: DepositEntity[]): void {
        throw new Error('Method not implemented.')
    }
    async createDepositInLocalDatabase(entity: DepositEntity): Promise<DepositEntity> {
        try {
            const entityCreated = await database.write(async () => {
                return await database.get<DepositModel>('deposits').create((item) => {
                    item.description = entity.description
                    item.name = entity.name
                    item.serverId = +0
                    item.enterpriseId = entity.enterpriseId
                    item.userId = entity.userId
                    item.userAction = UserAction.CREATE
                    item.isValid = true
                })
            })

            return new DepositEntity().modelToEntity(Mappers.depositMapper(entityCreated))
        } catch (error) {
            console.error('[Deposits]: ' + error)
            throw new Error('Error create Deposit in local database.', {
                cause: error.message,
            })
        }
    }
    async updateDepositInLocalDatabase(entity: DepositEntity): Promise<DepositEntity> {
        try {
            const entityUpdeted = await database.write(async () => {
                const item = await database.get<DepositModel>('deposits').find(entity.id)
                return await item.update(() => {
                    item.description = entity.description
                    item.name = entity.name
                    item.userId = entity.userId
                    item.userAction = UserAction.UPDATE
                })
            })
            return new DepositEntity().modelToEntity(Mappers.depositMapper(entityUpdeted))
        } catch (error) {
            console.error('[Deposits]: ' + error)
            throw new Error('Error updating deposit in local database.', {
                cause: error.message,
            })
        }
    }
    async deleteDepositInLocalDatabase(id: string, userId: string): Promise<void> {
        const t = await database
            .get('work_routes')
            .query(Q.unsafeSqlQuery(`select count(*) as count from work_routes where deposit_id = ?`, [id]))

            .fetchCount()

        const result = t
        if (result > 0) {
            throw new Error('Não é possível apagar a Jazida')
        }
        try {
            let result

            await database.write(async () => {
                const result = await database.get<DepositModel>('deposits').find(id)
                await result.update(() => {
                    result.userAction = UserAction.DELETE
                    result.userId = userId
                    result.isValid = false
                })
            })
            return result
        } catch (error) {
            console.error('[Deposits]: ' + error)
            throw new Error('Error deleting deposit routes in local database.', {
                cause: error,
            })
        }
    }
    async findDepositByIdInLocalDatabase(id: string): Promise<DepositEntity> {
        try {
            const result = await database.get<DepositModel>(TableName.DEPOSITS).find(id)
            if (result) {
                return new DepositEntity().modelToEntity(Mappers.depositMapper(result))
            }
            return null
        } catch (error) {
            console.error('[Deposits]: ' + error)
            throw new Error('Error deleting deposit routes in local database.', {
                cause: error,
            })
        }
    }
    async loadAllDepositByEnterpriseIdFromLocalDatabase(enterpriseId: string): Promise<DepositEntity[]> {
        try {
            const result = await database
                .get<DepositModel>('deposits')
                .query(
                    Q.sortBy('created_at', Q.desc),
                    Q.where('enterprise_id', enterpriseId),
                    Q.where('is_valid', true)
                )
                .fetch()
            return result.map((item) => {
                return new DepositEntity().modelToEntity(Mappers.depositMapper(item))
            })
        } catch (error) {
            console.error('[Deposits]: ' + error)
            throw new Error('Error loading deposit from local database.', {
                cause: error,
            })
        }
    }

    /*async saveDepositServerId(entity: DepositEntity): Promise<void> {
        try {
            await database.write(async () => {
                const deposit = await database.get<DepositModel>(TableName.DEPOSITS).find(entity.id)

                await deposit.update((record) => {
                    record.serverId = entity.serverId
                })
            })
        } catch (error) {
            console.error(`[Deposits Error] ID: ${entity.id}:`, error)
            throw new Error(
                `Não foi possível salvar o Server ID do depósito: ${
                    error instanceof Error ? error.message : 'Erro desconhecido'
                }`
            )
        }
    }*/
}
