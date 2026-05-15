import WorkEntity from '../../../domain/entity/work/WorkEntity'
import { Database, Q } from '@nozbe/watermelondb'
import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs'
import { WorkWatermelonDbRepository } from '../WorkWatermelonDbRepository'
import { schemas } from '../../../database/schemas'
import WorkModel from '../../../database/model/WorkModel'
import { WorkDtoFactory } from '../../../domain/entity/__test__/factories/WorkDtoFactory'
import { UserAction } from '../../../domain/types'

const adapter = new LokiJSAdapter({
    dbName: 'TEST-DB',
    schema: schemas,
    useWebWorker: false,
    useIncrementalIndexedDB: true,
})

const database = new Database({
    adapter,
    modelClasses: [WorkModel],
})

describe('WorkWatermelonDbRepository', () => {
    let repository: WorkWatermelonDbRepository

    beforeEach(async () => {
        repository = new WorkWatermelonDbRepository()
    })

    it('deve criar uma nova obra com sucesso no banco local', async () => {
        const fakeWork = new WorkEntity().dtoToEntity(WorkDtoFactory.create())

        const result = await repository.createWorkInLocalDatabase(fakeWork)

        expect(result).toBeDefined()
        expect(result.name).toBe(fakeWork.name)

        const persisted = await repository.findWorkByIdInLocalDatabase(result.id)

        expect(persisted).toBeDefined()
        expect(persisted.isValid).toBe(true)
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
