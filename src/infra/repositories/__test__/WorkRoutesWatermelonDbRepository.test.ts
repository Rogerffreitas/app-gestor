import { WorkRoutesDtoFactory } from '@/src/domain/utils/factories/WorkRoutesDtoFactory'
import { WorkRoutesWatermelonDbRepository } from '../WorkRoutesWatermelonDbRepository'
import { database } from './database-test'
import WorkRoutesEntity from '@/src/domain/entity/work-routes/WorkRoutesEntity'
import { WorkWatermelonDbRepository } from '../WorkWatermelonDbRepository'
import { DepositWatermelonDbRepository } from '../DepositWatermelonDbRepository'
import { WorkDtoFactory } from '@/src/domain/utils/factories/WorkDtoFactory'
import WorkEntity from '@/src/domain/entity/work/WorkEntity'
import DepositEntity from '@/src/domain/entity/deposit/DepositEntity'
import { DepositDtoFactory } from '@/src/domain/utils/factories/DepositDtoFactory'
import DepositDto from '@/src/domain/entity/deposit/DepositDto'
import WorkDto from '@/src/domain/entity/work/WorkDto'
import WorkRouteModel from '@/src/database/model/WorkRouteModel'
import { TableName, UserAction } from '@/src/domain/types'
import { Q } from '@nozbe/watermelondb'

describe('WorkWatermelonDbRepository', () => {
    const repository = new WorkRoutesWatermelonDbRepository(database)
    const workRepository = new WorkWatermelonDbRepository(database)
    const depositRepository = new DepositWatermelonDbRepository(database)
    let work: WorkEntity
    let deposit: DepositEntity

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
    })

    it('Must successfully create a model and return to the entity', async () => {
        const entity = new WorkRoutesEntity().dtoToEntity(
            WorkRoutesDtoFactory.create({
                deposit: new DepositDto().toDto(deposit),
                work: new WorkDto().entityToDto(work),
            })
        )

        const result = await repository.createWorkRoutesInLocalDatabase(entity)

        expect(result).toBeDefined()

        const persisted = await repository.findWorkRoutesByIdInLocalDatabase(result.id)

        expect(persisted).toBeDefined()
        expect(persisted.value).toBe(entity.value)
        expect(persisted.km).toBe(entity.km)
        expect(persisted.isValid).toBe(true)
    })

    it('hould throw a custom error if writing to the database fails.', async () => {
        await expect(repository.createWorkRoutesInLocalDatabase(undefined)).rejects.toThrow(
            /Error create route in local database/
        )
    })

    it('You should search for a model by ID, update it, and return an entity.', async () => {
        const countBeforeCreate = (await database.get<WorkRouteModel>(TableName.WORK_ROUTES).query().fetch())
            .length

        const entity = new WorkRoutesEntity().dtoToEntity(
            WorkRoutesDtoFactory.create({
                deposit: new DepositDto().toDto(deposit),
                work: new WorkDto().entityToDto(work),
            })
        )
        const createdEntity = await repository.createWorkRoutesInLocalDatabase(entity)
        const countAfterCreate = (await database.get<WorkRouteModel>(TableName.WORK_ROUTES).query().fetch())
            .length

        const result = await repository.updateWorkRoutesInLocalDatabase(createdEntity)

        const entityUpdated = await repository.findWorkRoutesByIdInLocalDatabase(result.id)
        expect(countBeforeCreate).toEqual(0)
        expect(countAfterCreate).toEqual(1)
        expect(entityUpdated.userAction).toBe(UserAction.UPDATE)
    })

    it('Should create and then delete a record.', async () => {
        const entity = new WorkRoutesEntity().dtoToEntity(
            WorkRoutesDtoFactory.create({
                deposit: new DepositDto().toDto(deposit),
                work: new WorkDto().entityToDto(work),
            })
        )
        const entityCreated = await repository.createWorkRoutesInLocalDatabase(entity)

        const countAfterCreate = (await database.get<WorkRouteModel>(TableName.WORK_ROUTES).query().fetch())
            .length

        await database.write(async () => {
            const result = await database.get<WorkRouteModel>(TableName.WORK_ROUTES).find(entityCreated.id)
            await result.update(() => {
                result.isValid = false
                result.userId = entityCreated.userId
                result.userAction = UserAction.DELETE
            })
        })
        const countAfterDelete = (
            await database.get<WorkRouteModel>(TableName.WORK_ROUTES).query(Q.where('is_valid', true)).fetch()
        ).length

        const deletedEntity = await repository.findWorkRoutesByIdInLocalDatabase(entityCreated.id)

        expect(deletedEntity.userAction).toBe(UserAction.DELETE)
        expect(deletedEntity.isValid).toBe(false)
        expect(countAfterCreate).toEqual(1)
        expect(countAfterDelete).toEqual(0)
    })
})
