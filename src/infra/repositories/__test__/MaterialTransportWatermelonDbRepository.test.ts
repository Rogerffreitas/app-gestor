import { TransportVehicleEntity } from '@/src/domain/entity/transport-vehicle/TransportVehicleEntity'
import { MaterialTransportWatermelonDbRepository } from '../MaterialTransportWatermelonDbRepository'
import { database } from './database-test'
import { TransportVehicleDtoFactory } from '@/src/domain/utils/factories/TransportVehicleDtoFactory'
import WorkRoutesEntity from '@/src/domain/entity/work-routes/WorkRoutesEntity'
import MaterialEntity from '@/src/domain/entity/material/MaterialEntity'
import { WorkRoutesDtoFactory } from '@/src/domain/utils/factories/WorkRoutesDtoFactory'
import { MaterialDtoFactory } from '@/src/domain/utils/factories/MaterialDtoFactory'
import MaterialTransportModel from '@/src/database/model/MaterialTransportModel'
import { Reference, TableName, UserAction } from '@/src/types'
import { MaterialTransportEntity } from '@/src/domain/entity/material-transport/MaterialTransportEntity'
import { MaterialTransportDtoFactory } from '@/src/domain/utils/factories/MaterialTransportDtoFactory'
import { TransportVehicleWatermelonDbRepository } from '../TransportVehicleWatermelonDbRepository'
import { WorkRoutesWatermelonDbRepository } from '../WorkRoutesWatermelonDbRepository'
import { MaterialWatermelonDbRepository } from '../MaterialWatermelonDbRepository'
import TransportVehicleDto from '@/src/domain/entity/transport-vehicle/TransportVehicleDto'
import { MaterialDto } from '@/src/domain/entity/material/MaterialDto'
import WorkRoutesDto from '@/src/domain/entity/work-routes/WorkRoutesDto'
import { Q } from '@nozbe/watermelondb'
import { WorkWatermelonDbRepository } from '../WorkWatermelonDbRepository'
import { DepositWatermelonDbRepository } from '../DepositWatermelonDbRepository'
import WorkEntity from '@/src/domain/entity/work/WorkEntity'
import { WorkDtoFactory } from '@/src/domain/utils/factories/WorkDtoFactory'
import { DepositDtoFactory } from '@/src/domain/utils/factories/DepositDtoFactory'
import DepositEntity from '@/src/domain/entity/deposit/DepositEntity'
import DepositDto from '@/src/domain/entity/deposit/DepositDto'
import WorkDto from '@/src/domain/entity/work/WorkDto'

describe('MaterialTransportWatermelonDbRepository', () => {
    const repository = new MaterialTransportWatermelonDbRepository(database)
    const transportVehicleRepository = new TransportVehicleWatermelonDbRepository(database)
    const routeRepository = new WorkRoutesWatermelonDbRepository(database)
    const materialRepository = new MaterialWatermelonDbRepository(database)
    const workRepository = new WorkWatermelonDbRepository(database)
    const depositRepository = new DepositWatermelonDbRepository(database)
    let work: WorkEntity
    let deposit: DepositEntity
    let transportVehicle: TransportVehicleEntity
    let route: WorkRoutesEntity
    let material: MaterialEntity
    beforeEach(async () => {
        await database.write(async () => {
            await database.unsafeResetDatabase()
        })
        work = await workRepository.createWorkInLocalDatabase(
            new WorkEntity().dtoToEntity(WorkDtoFactory.create())
        )
        deposit = await depositRepository.createDepositInLocalDatabase(
            new DepositEntity().dtoToEntity(DepositDtoFactory.create())
        )
        transportVehicle = await transportVehicleRepository.createTransportVehicleInLocalDatabase(
            new TransportVehicleEntity().dtoToEntity(TransportVehicleDtoFactory.create())
        )
        route = await routeRepository.createWorkRoutesInLocalDatabase(
            new WorkRoutesEntity().dtoToEntity(
                WorkRoutesDtoFactory.create({
                    deposit: new DepositDto().toDto(deposit),
                    work: new WorkDto().entityToDto(work),
                })
            )
        )
        material = await materialRepository.createMaterialInLocalDatabase(
            new MaterialEntity().dtoToEntity(MaterialDtoFactory.create())
        )
    })

    describe('Tests for the Deposit repository', () => {
        it('Must successfully create a model and return to the entity.', async () => {
            const dto = MaterialTransportDtoFactory.create({
                transportVehicle: new TransportVehicleDto().entityToDto(transportVehicle),
                workRoutes: new WorkRoutesDto().entityToDto(route),
                material: new MaterialDto().entityToDto(material),
            })

            let totalValue = 0
            let displacementFloat = +dto.workRoutes.km / 100
            let unitCostOfTheRouteFloat = +dto.workRoutes.value / 100
            let quantityFloat = +dto.quantity / 100
            let dmtPicketTotal = +dto.totalPickets * 20 //dmtPicketTotal em METROS / 1000 para converter em KM
            let extraDMT = +dmtPicketTotal / 1000
            let totalKm = +displacementFloat + extraDMT
            let tQuantity = 0
            let tDistanceTraveledWithinTheWork = 0
            let tIsReferenceCapacity: boolean
            let capacityFloat = dto.transportVehicle.capacity / 100

            if (dto.workRoutes.isFixedValue) {
                totalValue = dto.workRoutes.value
            }

            if (
                !dto.workRoutes.isFixedValue &&
                dto.material.referenceMaterialCalculation === Reference.VOLUME
            ) {
                let costCapacity = unitCostOfTheRouteFloat * capacityFloat
                totalValue = parseInt(
                    (parseFloat(costCapacity.toFixed(3)) * totalKm).toFixed(2).replace('.', '')
                )
            }

            if (
                !dto.workRoutes.isFixedValue &&
                dto.material.referenceMaterialCalculation === Reference.WEIGHT
            ) {
                let costDisplacement = unitCostOfTheRouteFloat * quantityFloat
                totalValue = parseInt(
                    (parseFloat(costDisplacement.toFixed(3)) * totalKm).toFixed(2).replace('.', '')
                )
            }

            tQuantity = dto.quantity
            if (dto.material.referenceMaterialCalculation === Reference.VOLUME) {
                tQuantity = dto.transportVehicle.capacity
            }

            tDistanceTraveledWithinTheWork = parseInt(extraDMT.toFixed(2).replace('.', ''))

            tIsReferenceCapacity = dto.material.referenceMaterialCalculation === Reference.VOLUME

            const countBeforeCreate = (
                await database.get<MaterialTransportModel>(TableName.MATERIAL_TRANSPORTS).query().fetch()
            ).length

            const entity = new MaterialTransportEntity().dtoToEntity(dto)

            const result = await repository.createMaterialTransportInLocalDatabase(entity)

            const countAfterCreate = (
                await database.get<MaterialTransportModel>(TableName.MATERIAL_TRANSPORTS).query().fetch()
            ).length

            expect(result).toBeDefined()
            expect(result).toBeInstanceOf(MaterialTransportEntity)
            expect(result.value).toBe(totalValue)
            expect(result.isReferenceCapacity).toBe(tIsReferenceCapacity)
            expect(result.distanceTraveledWithinTheWork).toBe(tDistanceTraveledWithinTheWork)
            expect(result.quantity).toBe(tQuantity)
            expect(result.capacity).toBe(dto.transportVehicle.capacity)
            expect(countBeforeCreate).toEqual(0)
            expect(countAfterCreate).toEqual(1)
        })

        it('You must successfully create a fixed-value model and return to the entity.', async () => {
            const routeFixedValue = await routeRepository.createWorkRoutesInLocalDatabase(
                new WorkRoutesEntity().dtoToEntity(
                    WorkRoutesDtoFactory.create({
                        deposit: new DepositDto().toDto(deposit),
                        work: new WorkDto().entityToDto(work),
                        isFixedValue: true,
                        value: 10000,
                    })
                )
            )
            const dto = MaterialTransportDtoFactory.create({
                transportVehicle: new TransportVehicleDto().entityToDto(transportVehicle),
                workRoutes: new WorkRoutesDto().entityToDto(routeFixedValue),
                material: new MaterialDto().entityToDto(material),
            })

            let totalValue = 0
            let displacementFloat = +dto.workRoutes.km / 100
            let unitCostOfTheRouteFloat = +dto.workRoutes.value / 100
            let quantityFloat = +dto.quantity / 100
            let dmtPicketTotal = +dto.totalPickets * 20 //dmtPicketTotal em METROS / 1000 para converter em KM
            let extraDMT = +dmtPicketTotal / 1000
            let totalKm = +displacementFloat + extraDMT
            let tQuantity = 0
            let tDistanceTraveledWithinTheWork = 0
            let tIsReferenceCapacity: boolean

            if (dto.workRoutes.isFixedValue) {
                totalValue = dto.workRoutes.value
            }

            if (
                !dto.workRoutes.isFixedValue &&
                dto.material.referenceMaterialCalculation === Reference.VOLUME
            ) {
                let costCapacity = unitCostOfTheRouteFloat * dto.transportVehicle.capacity
                totalValue = parseInt(
                    (parseFloat(costCapacity.toFixed(3)) * totalKm).toFixed(2).replace('.', '')
                )
            }

            if (
                !dto.workRoutes.isFixedValue &&
                dto.material.referenceMaterialCalculation === Reference.WEIGHT
            ) {
                let costDisplacement = unitCostOfTheRouteFloat * quantityFloat
                totalValue = parseInt(
                    (parseFloat(costDisplacement.toFixed(3)) * totalKm).toFixed(2).replace('.', '')
                )
            }

            tQuantity = dto.quantity
            if (dto.material.referenceMaterialCalculation === Reference.VOLUME) {
                tQuantity = dto.transportVehicle.capacity
            }

            tDistanceTraveledWithinTheWork = parseInt(extraDMT.toFixed(2).replace('.', ''))

            tIsReferenceCapacity = dto.material.referenceMaterialCalculation === Reference.VOLUME

            const countBeforeCreate = (
                await database.get<MaterialTransportModel>(TableName.MATERIAL_TRANSPORTS).query().fetch()
            ).length

            const entity = new MaterialTransportEntity().dtoToEntity(dto)

            const result = await repository.createMaterialTransportInLocalDatabase(entity)

            const countAfterCreate = (
                await database.get<MaterialTransportModel>(TableName.MATERIAL_TRANSPORTS).query().fetch()
            ).length

            expect(result).toBeDefined()
            expect(result).toBeInstanceOf(MaterialTransportEntity)
            expect(result.value).toBe(totalValue)
            expect(result.value).toBe(10000)
            expect(result.isReferenceCapacity).toBe(tIsReferenceCapacity)
            expect(result.distanceTraveledWithinTheWork).toBe(tDistanceTraveledWithinTheWork)
            expect(result.quantity).toBe(tQuantity)
            expect(countBeforeCreate).toEqual(0)
            expect(countAfterCreate).toEqual(1)
        })

        it('You must successfully create a model material weight and return to the entity.', async () => {
            const routeFixedValue = await routeRepository.createWorkRoutesInLocalDatabase(
                new WorkRoutesEntity().dtoToEntity(
                    WorkRoutesDtoFactory.create({
                        deposit: new DepositDto().toDto(deposit),
                        work: new WorkDto().entityToDto(work),
                        isFixedValue: false,
                        value: 180,
                        km: 1201,
                    })
                )
            )

            const materialWeight = await materialRepository.createMaterialInLocalDatabase(
                new MaterialEntity().dtoToEntity(
                    MaterialDtoFactory.create({ referenceMaterialCalculation: Reference.WEIGHT })
                )
            )

            const dto = MaterialTransportDtoFactory.create({
                transportVehicle: new TransportVehicleDto().entityToDto(transportVehicle),
                workRoutes: new WorkRoutesDto().entityToDto(routeFixedValue),
                material: new MaterialDto().entityToDto(materialWeight),
                quantity: 1860,
                totalPickets: 20,
            })

            let totalValue = 0
            // 1201/100 = 12.01
            let displacementFloat = +dto.workRoutes.km / 100
            //   180 / 100 = 1.80
            let unitCostOfTheRouteFloat = +dto.workRoutes.value / 100
            //    1860  /  100   =  18.60
            let quantityFloat = +dto.quantity / 100
            // 20* 20 = 400
            let dmtPicketTotal = +dto.totalPickets * 20 //dmtPicketTotal em METROS / 1000 para converter em KM
            //  400 / 1000 = 0.400
            let extraDMT = +dmtPicketTotal / 1000
            // 12.01 + 0.400 = 12.41
            let totalKm = +displacementFloat + extraDMT
            let tQuantity = 0
            let tDistanceTraveledWithinTheWork = 0
            let tIsReferenceCapacity: boolean

            if (
                !dto.workRoutes.isFixedValue &&
                dto.material.referenceMaterialCalculation === Reference.WEIGHT
            ) {
                // 1.8 * 18.60 = 33.48
                let costDisplacement = unitCostOfTheRouteFloat * quantityFloat
                // 33.48  *  12.500 = 418.50
                totalValue = parseInt(
                    (parseFloat(costDisplacement.toFixed(3)) * totalKm).toFixed(2).replace('.', '')
                )
            }

            // 1860
            tQuantity = dto.quantity

            // 40
            tDistanceTraveledWithinTheWork = parseInt(extraDMT.toFixed(2).replace('.', ''))

            // false
            tIsReferenceCapacity = dto.material.referenceMaterialCalculation === Reference.VOLUME

            const countBeforeCreate = (
                await database.get<MaterialTransportModel>(TableName.MATERIAL_TRANSPORTS).query().fetch()
            ).length

            const entity = new MaterialTransportEntity().dtoToEntity(dto)

            const result = await repository.createMaterialTransportInLocalDatabase(entity)

            const countAfterCreate = (
                await database.get<MaterialTransportModel>(TableName.MATERIAL_TRANSPORTS).query().fetch()
            ).length

            // weight 2800
            //

            expect(parseFloat((unitCostOfTheRouteFloat * quantityFloat).toFixed(2))).toBe(33.48)
            expect(totalKm).toBe(12.41)
            expect(result).toBeDefined()
            expect(result).toBeInstanceOf(MaterialTransportEntity)
            expect(result.value).toBe(totalValue)
            expect(result.value).toBe(41549)
            expect(result.isReferenceCapacity).toBe(tIsReferenceCapacity)
            expect(result.distanceTraveledWithinTheWork).toBe(tDistanceTraveledWithinTheWork)
            expect(result.distanceTraveledWithinTheWork).toBe(40)
            expect(result.quantity).toBe(tQuantity)
            expect(result.quantity).toBe(1860)
            expect(countBeforeCreate).toEqual(0)
            expect(countAfterCreate).toEqual(1)
        })

        it('You must successfully create a model material weight fixed value and return to the entity.', async () => {
            const routeFixedValue = await routeRepository.createWorkRoutesInLocalDatabase(
                new WorkRoutesEntity().dtoToEntity(
                    WorkRoutesDtoFactory.create({
                        deposit: new DepositDto().toDto(deposit),
                        work: new WorkDto().entityToDto(work),
                        isFixedValue: true,
                        value: 45560,
                        km: 1201,
                    })
                )
            )

            const materialWeight = await materialRepository.createMaterialInLocalDatabase(
                new MaterialEntity().dtoToEntity(
                    MaterialDtoFactory.create({ referenceMaterialCalculation: Reference.WEIGHT })
                )
            )

            const dto = MaterialTransportDtoFactory.create({
                transportVehicle: new TransportVehicleDto().entityToDto(transportVehicle),
                workRoutes: new WorkRoutesDto().entityToDto(routeFixedValue),
                material: new MaterialDto().entityToDto(materialWeight),
                quantity: 1860,
                totalPickets: 20,
            })

            let totalValue = 0
            // 1201/100 = 12.01
            let displacementFloat = +dto.workRoutes.km / 100
            //   180 / 100 = 1.80
            let unitCostOfTheRouteFloat = +dto.workRoutes.value / 100
            //    1860  /  100   =  18.60
            let quantityFloat = +dto.quantity / 100
            // 20* 20 = 400
            let dmtPicketTotal = +dto.totalPickets * 20 //dmtPicketTotal em METROS / 1000 para converter em KM
            //  400 / 1000 = 0.400
            let extraDMT = +dmtPicketTotal / 1000
            // 12.01 + 0.400 = 12.41
            let totalKm = +displacementFloat + extraDMT
            let tQuantity = 0
            let tDistanceTraveledWithinTheWork = 0
            let tIsReferenceCapacity: boolean

            if (dto.workRoutes.isFixedValue) {
                //45560
                totalValue = +dto.workRoutes.value
            }

            if (
                !dto.workRoutes.isFixedValue &&
                dto.material.referenceMaterialCalculation === Reference.WEIGHT
            ) {
                // 1.8 * 18.60 = 33.48
                let costDisplacement = unitCostOfTheRouteFloat * quantityFloat
                // 33.48  *  12.500 = 418.50
                totalValue = parseInt(
                    (parseFloat(costDisplacement.toFixed(3)) * totalKm).toFixed(2).replace('.', '')
                )
            }

            // 1860
            tQuantity = dto.quantity

            // 40
            tDistanceTraveledWithinTheWork = parseInt(extraDMT.toFixed(2).replace('.', ''))

            // false
            tIsReferenceCapacity = dto.material.referenceMaterialCalculation === Reference.VOLUME

            const countBeforeCreate = (
                await database.get<MaterialTransportModel>(TableName.MATERIAL_TRANSPORTS).query().fetch()
            ).length

            const entity = new MaterialTransportEntity().dtoToEntity(dto)

            const result = await repository.createMaterialTransportInLocalDatabase(entity)

            const countAfterCreate = (
                await database.get<MaterialTransportModel>(TableName.MATERIAL_TRANSPORTS).query().fetch()
            ).length

            // weight 2800
            //

            expect(totalKm).toBe(12.41)
            expect(result).toBeDefined()
            expect(result).toBeInstanceOf(MaterialTransportEntity)
            expect(result.value).toBe(totalValue)
            expect(result.value).toBe(45560)
            expect(result.isReferenceCapacity).toBe(tIsReferenceCapacity)
            expect(result.distanceTraveledWithinTheWork).toBe(tDistanceTraveledWithinTheWork)
            expect(result.distanceTraveledWithinTheWork).toBe(40)
            expect(result.quantity).toBe(tQuantity)
            expect(result.quantity).toBe(1860)
            expect(countBeforeCreate).toEqual(0)
            expect(countAfterCreate).toEqual(1)
        })

        it('hould throw a custom error if writing to the database fails.', async () => {
            await expect(repository.createMaterialTransportInLocalDatabase(undefined)).rejects.toThrow(
                /Error create Material Transport in local database/
            )
        })

        it('Should create and then delete a record.', async () => {
            const createdEntity = await repository.createMaterialTransportInLocalDatabase(
                new MaterialTransportEntity().dtoToEntity(
                    MaterialTransportDtoFactory.create({
                        transportVehicle: new TransportVehicleDto().entityToDto(transportVehicle),
                        workRoutes: new WorkRoutesDto().entityToDto(route),
                        material: new MaterialDto().entityToDto(material),
                    })
                )
            )
            const countAfterCreate = (
                await database.get<MaterialTransportModel>(TableName.MATERIAL_TRANSPORTS).query().fetch()
            ).length

            await database.write(async () => {
                const result = await database
                    .get<MaterialTransportModel>(TableName.MATERIAL_TRANSPORTS)
                    .find(createdEntity.id)
                await result.update(() => {
                    result.isValid = false
                    result.userId = createdEntity.userId
                    result.userAction = UserAction.DELETE
                })
            })
            const countAfterDelete = (
                await database
                    .get<MaterialTransportModel>(TableName.MATERIAL_TRANSPORTS)
                    .query(Q.where('is_valid', true))
                    .fetch()
            ).length

            const deletedEntity = await repository.findMaterialTransportVehicleByIdInLocalDatabase(
                createdEntity.id
            )

            expect(countAfterCreate).toEqual(1)
            expect(countAfterDelete).toEqual(0)
            expect(deletedEntity.userAction).toBe(UserAction.DELETE)
            expect(deletedEntity.isValid).toBe(false)
        })
    })
})
