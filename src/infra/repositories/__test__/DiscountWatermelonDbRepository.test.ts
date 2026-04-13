import { Database } from '@nozbe/watermelondb'
import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs'
import { DiscountTypes, TableName, UserAction } from '../../../types'
import { schemas } from '../../../database/schemas'
import DiscountModel from '../../../database/model/DiscountModel'
import { DiscountWatermelonDbRepository } from '../DiscountWatermelonDbRepository'
import { discountEntityEQ, discountEntityT } from './feke-data/DiscountData'
import DiscountEntity from '../../../domin/entity/discount/DiscountEntity'

const adapter = new LokiJSAdapter({
    dbName: 'TEST-DB',
    schema: schemas,
    useWebWorker: false,
    useIncrementalIndexedDB: true,
})

const database = new Database({
    adapter,
    modelClasses: [DiscountModel],
})

describe('DiscountWatermelonDbRepository', () => {
    let repository: DiscountWatermelonDbRepository

    beforeEach(async () => {
        repository = new DiscountWatermelonDbRepository()
        await database.write(async () => {
            await database.get(TableName.DISCOUNTS).query().destroyAllPermanently()
        })
    })

    describe('Tests for the Deposit repository', () => {
        it('Must successfully create a model and return to the entity.', async () => {
            const result = await repository.createDiscountInLocalDatabase(discountEntityT)
            const entityReturned = await repository.findDiscountByIdInLocalDatabase(result.id)
            expect(entityReturned).toBeDefined()
            expect(entityReturned).toBeInstanceOf(DiscountEntity)
        })

        it('hould throw a custom error if writing to the database fails.', async () => {
            await expect(repository.createDiscountInLocalDatabase(undefined)).rejects.toThrow(
                'Error create Discount in local database '
            )
        })

        it('You should search for a model by ID, update it, and return an entity.', async () => {
            const list = await repository.loadAllDiscountByEnterpriseIdAndWorkIdFromLocalDatabase(
                discountEntityT.enterpriseId,
                discountEntityT.workId,
                DiscountTypes.TRANSPORT_VEHICLE,
                discountEntityT.transportVehicleOrWorkEquipmentId
            )
            const result = await repository.updateDiscountInLocalDatabase(list[0])
            expect(result.userAction).toBe(UserAction.UPDATE)
        })

        it('Should create and then delete a record.', async () => {
            const result = await repository.createDiscountInLocalDatabase(discountEntityEQ)
            const EntityVoid = await repository.deleteDiscountInLocalDatabase(
                result.id,
                discountEntityEQ.userId
            )
            expect(EntityVoid).toBeUndefined()
        })

        it('Should look for a list.', async () => {
            const result = await repository.loadAllDiscountByEnterpriseIdAndWorkIdFromLocalDatabase(
                discountEntityT.enterpriseId,
                discountEntityT.workId,
                DiscountTypes.TRANSPORT_VEHICLE,
                discountEntityT.transportVehicleOrWorkEquipmentId
            )
            expect(result).toBeDefined()
        })
    })
})
