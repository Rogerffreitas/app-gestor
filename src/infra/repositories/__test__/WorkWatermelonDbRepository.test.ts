import WorkEntity from '../../../domain/entity/work/WorkEntity'
import { WorkWatermelonDbRepository } from '../WorkWatermelonDbRepository'
import { TableName, UserAction } from '../../../domain/types'
import { database } from './database-test'
import { WorkDtoFactory } from '@/src/domain/utils/factories/WorkDtoFactory'
import WorkModel from '@/src/database/model/WorkModel'
import { Q } from '@nozbe/watermelondb'

describe('WorkWatermelonDbRepository', () => {
    const repository = new WorkWatermelonDbRepository(database)

    beforeEach(async () => {
        await database.write(async () => {
            await database.unsafeResetDatabase()
        })
    })

    it('deve criar uma nova obra com sucesso no banco local', async () => {
        const fakeWork = new WorkEntity().dtoToEntity(WorkDtoFactory.create())

        const result = await repository.createWorkInLocalDatabase(
            new WorkEntity().dtoToEntity(WorkDtoFactory.create())
        )

        expect(result).toBeDefined()
        expect(result.name).toBe(fakeWork.name)

        const persisted = await repository.findWorkByIdInLocalDatabase(result.id)

        expect(persisted).toBeDefined()
        expect(persisted.isValid).toBe(true)
    })

    it('hould throw a custom error if writing to the database fails.', async () => {
        await expect(repository.createWorkInLocalDatabase(undefined)).rejects.toThrow(
            /Error create work in local database/
        )
    })

    it('Should create and then delete a record.', async () => {
        const fakeWork = new WorkEntity().dtoToEntity(WorkDtoFactory.create())
        const entityCreated = await repository.createWorkInLocalDatabase(fakeWork)
        const countAfterCreate = (await database.get<WorkModel>(TableName.WORKS).query().fetch()).length

        await database.write(async () => {
            const result = await database.get<WorkModel>(TableName.WORKS).find(entityCreated.id)
            await result.update(() => {
                result.isValid = false
                result.userId = entityCreated.userId
                result.userAction = UserAction.DELETE
            })
        })
        const countAfterDelete = (
            await database.get<WorkModel>(TableName.WORKS).query(Q.where('is_valid', true)).fetch()
        ).length

        expect(countAfterCreate).toEqual(1)
        expect(countAfterDelete).toEqual(0)
    })

    it('deve atualiza uma nova obra com sucesso no banco local', async () => {
        const fakeWork = new WorkEntity().dtoToEntity(WorkDtoFactory.create())

        const result = await repository.createWorkInLocalDatabase(fakeWork)

        expect(result).toBeDefined()
        expect(result.name).toBe(fakeWork.name)

        const persisted = await repository.findWorkByIdInLocalDatabase(result.id)

        expect(persisted).toBeDefined()
        expect(persisted.isValid).toBe(true)

        const updated = await repository.updateWorkInLocalDatabase(persisted)
        expect(updated).toBeDefined()
        expect(updated.userAction).toBe(UserAction.UPDATE)
    })
})
