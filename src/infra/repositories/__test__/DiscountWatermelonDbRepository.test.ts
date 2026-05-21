import { DiscountTypes, TableName, UserAction } from '../../../types'
import DiscountModel from '../../../database/model/DiscountModel'
import { DiscountWatermelonDbRepository } from '../DiscountWatermelonDbRepository'
import DiscountEntity from '@gestor/domain/entity/discount/DiscountEntity'
import { DiscountDtoFactory } from '@/src/domain/utils/factories/DiscountDtoFactory'
import { database } from './database-test'

describe('DiscountWatermelonDbRepository', () => {
    const repository = new DiscountWatermelonDbRepository(database)

    beforeEach(async () => {
        await database.write(async () => {
            await database.unsafeResetDatabase()
        })
    })

    describe('Tests for the Deposit repository', () => {
        it('Must successfully create a model and return to the entity.', async () => {
            const countBeforeCreate = (await database.get<DiscountModel>(TableName.DISCOUNTS).query().fetch())
                .length

            const result = await repository.createDiscountInLocalDatabase(
                new DiscountEntity().dtoToEntity(DiscountDtoFactory.create())
            )

            console.info()

            const countAfterCreate = (await database.get<DiscountModel>(TableName.DISCOUNTS).query().fetch())
                .length

            expect(result).toBeDefined()
            expect(result).toBeInstanceOf(DiscountEntity)
            expect(countBeforeCreate).toEqual(0)
            expect(countAfterCreate).toEqual(1)
        })

        it('hould throw a custom error if writing to the database fails.', async () => {
            await expect(repository.createDiscountInLocalDatabase(undefined)).rejects.toThrow(
                /Error create Discount in local database/
            )
        })

        it('You should search for a model by ID, update it, and return an entity.', async () => {
            const countBeforeCreate = (await database.get<DiscountModel>(TableName.DISCOUNTS).query().fetch())
                .length
            const createdEntity = await repository.createDiscountInLocalDatabase(
                new DiscountEntity().dtoToEntity(DiscountDtoFactory.create())
            )
            const countAfterCreate = (await database.get<DiscountModel>(TableName.DISCOUNTS).query().fetch())
                .length

            const result = await repository.updateDiscountInLocalDatabase(createdEntity)
            expect(countBeforeCreate).toEqual(0)
            expect(countAfterCreate).toEqual(1)
            expect(result.userAction).toBe(UserAction.UPDATE)
        })

        it('Should look for a list.', async () => {
            const result = await repository.loadAllDiscountByEnterpriseIdAndWorkIdFromLocalDatabase(
                'e1',
                'w1',
                DiscountTypes.TRANSPORT_VEHICLE,
                't1'
            )
            expect(result).toBeDefined()
        })
    })
})
