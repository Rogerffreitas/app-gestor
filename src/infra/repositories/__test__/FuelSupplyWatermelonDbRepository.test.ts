import { Database } from '@nozbe/watermelondb'
import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs'
import { FuelSupplyTypes, TableName, UserAction } from '../../../types'
import { schemas } from '../../../database/schemas'
import FuelSupplyModel from '../../../database/model/FuelSupplyModel'
import { FuelSupplyEntity } from '@gestor/domain/entity/fuel-supply/FuelSupplyEntity'
import {
    entityEquipment,
    entityMaintenanceTruck,
    entityMaintenanceTruckTank,
    entityTransportVehicle,
} from './feke-data/FuelSupplyData'

import { useInjection } from '@/src/contexts/InjectionContext'

const adapter = new LokiJSAdapter({
    dbName: 'TEST-DB',
    schema: schemas,
    useWebWorker: false,
    useIncrementalIndexedDB: true,
})

const database = new Database({
    adapter,
    modelClasses: [FuelSupplyModel],
})

describe('FuelSupplyWatermelonDbRepository', () => {
    let repository

    beforeEach(async () => {
        repository = useInjection('FuelSupplyRepositoryGateway')
        await database.write(async () => {
            await database.get(TableName.FUEL_SUPPLYS).query().destroyAllPermanently()
        })
    })

    describe('Tests for the FuelSupplies repository', () => {
        it('Must successfully create a fuel supply and return to the entity.', async () => {
            const result = await repository.createFuelSupplyInLocalDatabase(entityTransportVehicle)
            const list =
                await repository.loadAllFuelSupplyByEnterpriseIdAndWorkIdAndVehicleIdAndTypeFromLocalDatabase(
                    entityTransportVehicle.enterpriseId,
                    entityTransportVehicle.workId,
                    entityTransportVehicle.transportVehicleOrWorkEquipmentId,
                    entityTransportVehicle.supplyType
                )
            expect(result).toBeDefined()
            expect(result).toBeInstanceOf(FuelSupplyEntity)
            expect(list.length).toBe(1)
        })

        it('hould throw a custom error if writing to the database fails.', async () => {
            await expect(repository.createFuelSupplyInLocalDatabase(undefined)).rejects.toThrow(
                'Error create Fuel Supply in local database'
            )
        })

        it('You should search for a model by ID, update it, and return an entity.', async () => {
            const list =
                await repository.loadAllFuelSupplyByEnterpriseIdAndWorkIdAndVehicleIdAndTypeFromLocalDatabase(
                    entityTransportVehicle.enterpriseId,
                    entityTransportVehicle.workId,
                    entityTransportVehicle.transportVehicleOrWorkEquipmentId,
                    entityTransportVehicle.supplyType
                )

            const result = await repository.updateFuelSupplyInLocalDatabase(list[0])
            expect(result.userAction).toBe(UserAction.UPDATE)
        })

        it('Should create and then delete a record.', async () => {
            const result = await repository.createFuelSupplyInLocalDatabase(entityEquipment)
            const EntityVoid = await repository.deleteFuelSupplyInLocalDatabase(
                result.id,
                entityEquipment.userId
            )
            expect(EntityVoid).toBeUndefined()
        })

        it('Must successfully create a fuel supply (Maintenance Truck) and return to the entity.', async () => {
            const result1 = await repository.createFuelSupplyInLocalDatabase(entityMaintenanceTruckTank)
            const result2 = await repository.createFuelSupplyInLocalDatabase(entityMaintenanceTruck)
            const fuel =
                await repository.loadCurrentBalanceTankByEnterpriseIdAndWorkIdAndMaintenanceTruckIdFromLocalDatabase(
                    entityMaintenanceTruckTank.enterpriseId,
                    entityMaintenanceTruckTank.workId,
                    entityMaintenanceTruckTank.maintenanceTrucksWorkEquipmentId
                )
            expect(result1.id).toBeDefined()
            expect(result2.id).toBeDefined()
            expect(result1.quantity).toBe(entityMaintenanceTruckTank.quantity)
            expect(result2.quantity).toBe(entityMaintenanceTruck.quantity)
            expect(fuel).toBe(entityMaintenanceTruckTank.quantity - entityMaintenanceTruck.quantity)
        })

        it('Should look for a list.', async () => {
            const result =
                await repository.loadLastSupplyByEnterpriseIdAndWorkIdAndMaintenanceTruckIdFromLocalDatabase(
                    entityMaintenanceTruck.enterpriseId,
                    entityMaintenanceTruck.workId,
                    entityMaintenanceTruck.maintenanceTrucksWorkEquipmentId
                )
            expect(result).toBeDefined()
            expect(result.maintenanceTrucksWorkEquipmentId).toEqual(
                entityMaintenanceTruck.maintenanceTrucksWorkEquipmentId
            )
        })

        it('Should look for a list.', async () => {
            const result =
                await repository.loadAllFuelSupplyByEnterpriseIdAndWorkIdAndMaintenanceTruckIdFromLocalDatabase(
                    entityMaintenanceTruck.enterpriseId,
                    entityMaintenanceTruck.workId,
                    entityMaintenanceTruck.maintenanceTrucksWorkEquipmentId
                )
            expect(result).toBeDefined()
            expect(result.length).toBe(2)
        })

        it('Should look for a list.', async () => {
            const result =
                await repository.loadAllFuelSupplyByEnterpriseIdAndWorkIdAndMaintenanceTruckIdAndTypeFromLocalDatabase(
                    entityMaintenanceTruck.enterpriseId,
                    entityMaintenanceTruck.workId,
                    entityMaintenanceTruck.maintenanceTrucksWorkEquipmentId,
                    FuelSupplyTypes.EQUIPMENT
                )
            expect(result).toBeDefined()
            expect(result.length).toBe(1)
        })

        it('Should look for a list.', async () => {
            const result =
                await repository.loadAllFuelSupplyByEnterpriseIdAndWorkIdAndVehicleIdAndTypeFromLocalDatabase(
                    entityTransportVehicle.enterpriseId,
                    entityTransportVehicle.workId,
                    entityTransportVehicle.transportVehicleOrWorkEquipmentId,
                    entityTransportVehicle.supplyType
                )
            expect(result).toBeDefined()
            expect(result.length).toBe(1)
        })
    })
})
