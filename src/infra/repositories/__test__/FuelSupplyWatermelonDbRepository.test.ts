import { FuelSupplyTypes, UserAction } from '../../../types'
import { FuelSupplyEntity } from '../../../domain/entity/fuel-supply/FuelSupplyEntity'
import { FuelSupplyWatermelonDbRepository } from '../FuelSupplyWatermelonDbRepository'
import { database } from './database-test'
import FuelSupplyModel from '../../../database/model/FuelSupplyModel'
import { InvoiceStatus, TableName } from '../../../domain/types'
import { Q } from '@nozbe/watermelondb'
import { FuelSupplyDtoFactory } from '@/src/domain/utils/factories/FuelSupplyDtoFactory'

describe('FuelSupplyWatermelonDbRepository', () => {
    const repository = new FuelSupplyWatermelonDbRepository(database)
    beforeEach(async () => {
        await database.write(async () => {
            await database.unsafeResetDatabase()
        })
    })

    describe('Tests for the FuelSupplies repository', () => {
        it('Must successfully create a fuel supply and return to the entity.', async () => {
            const countBeforeCreate = (
                await database.get<FuelSupplyModel>(TableName.FUEL_SUPPLIES).query().fetch()
            ).length

            const result = await repository.createFuelSupplyInLocalDatabase(
                new FuelSupplyEntity().dtoToEntity(FuelSupplyDtoFactory.create())
            )

            const countAfterCreate = (
                await database.get<FuelSupplyModel>(TableName.FUEL_SUPPLIES).query().fetch()
            ).length

            expect(result).toBeDefined()
            expect(result).toBeInstanceOf(FuelSupplyEntity)
            expect(countBeforeCreate).toEqual(0)
            expect(countAfterCreate).toEqual(1)
        })

        it('hould throw a custom error if writing to the database fails.', async () => {
            await expect(repository.createFuelSupplyInLocalDatabase(undefined)).rejects.toThrow(
                'Error create Fuel Supply in local database'
            )
        })

        it('You should search for a model by ID, update it, and return an entity.', async () => {
            const countBeforeCreate = (
                await database.get<FuelSupplyModel>(TableName.FUEL_SUPPLIES).query().fetch()
            ).length
            const createdEntity = await repository.createFuelSupplyInLocalDatabase(
                new FuelSupplyEntity().dtoToEntity(
                    FuelSupplyDtoFactory.create({
                        transportVehicleOrWorkEquipmentId: 't-1',
                        isDiscount: true,
                        isGasStation: true,
                        supplyType: FuelSupplyTypes.TRANSPORT_VEHICLE,
                    })
                )
            )
            const countAfterCreate = (
                await database.get<FuelSupplyModel>(TableName.FUEL_SUPPLIES).query().fetch()
            ).length

            const result = await repository.updateFuelSupplyInLocalDatabase(createdEntity)
            expect(countBeforeCreate).toEqual(0)
            expect(countAfterCreate).toEqual(1)
            expect(result.userAction).toBe(UserAction.UPDATE)
        })

        it('Should create and then delete a record.', async () => {
            const entityCreated = await repository.createFuelSupplyInLocalDatabase(
                new FuelSupplyEntity().dtoToEntity(
                    FuelSupplyDtoFactory.create({ invoiceId: 0, invoiceStatus: InvoiceStatus.PENDING })
                )
            )
            const countAfterCreate = (
                await database.get<FuelSupplyModel>(TableName.FUEL_SUPPLIES).query().fetch()
            ).length

            await database.write(async () => {
                const result = await database
                    .get<FuelSupplyModel>(TableName.FUEL_SUPPLIES)
                    .find(entityCreated.id)
                await result.update(() => {
                    result.isValid = false
                    result.userId = entityCreated.userId
                    result.userAction = UserAction.DELETE
                })
            })
            const countAfterDelete = (
                await database
                    .get<FuelSupplyModel>(TableName.FUEL_SUPPLIES)
                    .query(Q.where('is_valid', true))
                    .fetch()
            ).length

            expect(countAfterCreate).toEqual(1)
            expect(countAfterDelete).toEqual(0)
        })
    })
})
