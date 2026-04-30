import { Database } from '@nozbe/watermelondb'
import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs'
import { TableName, UserAction } from '../../../types'
import { schemas } from '../../../database/schemas'
import DepositModel from '../../../database/model/DepositModel'
import DepositEntity from '@gestor/domain/entity/deposit/DepositEntity'
import { DepositWatermelonDbRepository } from '../DepositWatermelonDbRepository'
import { depositEntity } from './feke-data/DepositData'

const adapter = new LokiJSAdapter({
    dbName: 'TEST-DB',
    schema: schemas,
    useWebWorker: false,
    useIncrementalIndexedDB: true,
})

const database = new Database({
    adapter,
    modelClasses: [DepositModel],
})

describe('DepositWatermelonDbRepository', () => {
    let repository: DepositWatermelonDbRepository

    beforeEach(async () => {
        repository = new DepositWatermelonDbRepository()
        await database.write(async () => {
            await database.get(TableName.DEPOSITS).query().destroyAllPermanently()
        })
    })

    describe('Tests for the Deposit repository', () => {
        it('Must successfully create a model and return to the entity.', async () => {
            const result = await repository.createDepositInLocalDatabase(depositEntity)
            const entityReturned = await repository.findDepositByIdInLocalDatabase(result.id)
            expect(entityReturned).toBeDefined()
            expect(entityReturned).toBeInstanceOf(DepositEntity)
        })

        it('hould throw a custom error if writing to the database fails.', async () => {
            await expect(repository.createDepositInLocalDatabase(undefined)).rejects.toThrow(
                'Error create Deposit in local database'
            )
        })

        it('You should search for a model by ID, update it, and return an entity.', async () => {
            const list = await repository.loadAllDepositByEnterpriseIdFromLocalDatabase(
                depositEntity.enterpriseId
            )
            const result = await repository.updateDepositInLocalDatabase(list[0])
            expect(result.userAction).toBe(UserAction.UPDATE)
        })

        it('Should create and then delete a record.', async () => {
            const result = await repository.createDepositInLocalDatabase(depositEntity)
            const EntityVoid = await repository.deleteDepositInLocalDatabase(result.id, depositEntity.userId)
            expect(EntityVoid).toBeUndefined()
        })

        it('Should look for a list.', async () => {
            const result = await repository.loadAllDepositByEnterpriseIdFromLocalDatabase(
                depositEntity.enterpriseId
            )
            expect(result).toBeDefined()
        })
    })
})
