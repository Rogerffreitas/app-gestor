import { TableName, UserAction } from '../../../types'
import DepositModel from '../../../database/model/DepositModel'
import { DepositWatermelonDbRepository } from '../DepositWatermelonDbRepository'
import { database } from './database-test'
import DepositEntity from '@/src/domain/entity/deposit/DepositEntity'
import { DepositDtoFactory } from '@/src/domain/utils/factories/DepositDtoFactory'
import { Q } from '@nozbe/watermelondb'

describe('DepositWatermelonDbRepository', () => {
    const repository = new DepositWatermelonDbRepository(database)

    beforeEach(async () => {
        await database.write(async () => {
            await database.unsafeResetDatabase()
        })
    })

    describe('Tests for the Deposit repository', () => {
        it('Must successfully create a model and return to the entity.', async () => {
            const countBeforeCreate = (await database.get<DepositModel>(TableName.DEPOSITS).query().fetch())
                .length

            const result = await repository.createDepositInLocalDatabase(
                new DepositEntity().dtoToEntity(DepositDtoFactory.create())
            )

            console.info()

            const countAfterCreate = (await database.get<DepositModel>(TableName.DEPOSITS).query().fetch())
                .length

            expect(result).toBeDefined()
            expect(result).toBeInstanceOf(DepositEntity)
            expect(countBeforeCreate).toEqual(0)
            expect(countAfterCreate).toEqual(1)
        })

        it('hould throw a custom error if writing to the database fails.', async () => {
            await expect(repository.createDepositInLocalDatabase(undefined)).rejects.toThrow(
                /Error create Deposit in local database/
            )
        })

        it('You should search for a model by ID, update it, and return an entity.', async () => {
            const countBeforeCreate = (await database.get<DepositModel>(TableName.DEPOSITS).query().fetch())
                .length
            const createdEntity = await repository.createDepositInLocalDatabase(
                new DepositEntity().dtoToEntity(DepositDtoFactory.create())
            )
            const countAfterCreate = (await database.get<DepositModel>(TableName.DEPOSITS).query().fetch())
                .length

            const result = await repository.updateDepositInLocalDatabase(createdEntity)
            expect(countBeforeCreate).toEqual(0)
            expect(countAfterCreate).toEqual(1)
            expect(result.userAction).toBe(UserAction.UPDATE)
        })

        it('Should create and then delete a record.', async () => {
            const entityCreated = await repository.createDepositInLocalDatabase(
                new DepositEntity().dtoToEntity(DepositDtoFactory.create())
            )
            const countAfterCreate = (await database.get<DepositModel>(TableName.DEPOSITS).query().fetch())
                .length

            await database.write(async () => {
                const result = await database.get<DepositModel>(TableName.DEPOSITS).find(entityCreated.id)
                await result.update(() => {
                    result.isValid = false
                    result.userId = entityCreated.userId
                    result.userAction = UserAction.DELETE
                })
            })
            const countAfterDelete = (
                await database.get<DepositModel>(TableName.DEPOSITS).query(Q.where('is_valid', true)).fetch()
            ).length

            expect(countAfterCreate).toEqual(1)
            expect(countAfterDelete).toEqual(0)
        })

        it('Should look for a list.', async () => {
            const result = await repository.loadAllDepositByEnterpriseIdFromLocalDatabase('e-1')
            expect(result).toBeDefined()
        })
    })
})
