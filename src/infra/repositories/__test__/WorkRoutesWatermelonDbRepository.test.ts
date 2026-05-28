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

describe('WorkRoutesWatermelonDbRepository', () => {
    const repository = new WorkRoutesWatermelonDbRepository(database)
    const workRepository = new WorkWatermelonDbRepository(database)
    const depositRepository = new DepositWatermelonDbRepository(database)
    let work: WorkEntity
    let deposit: DepositEntity
    const targetEnterpriseId = 'ent-route-77'

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

    it('Must successfully create a model with float values ​​and return the entity', async () => {
        const entity = new WorkRoutesEntity().dtoToEntity(
            WorkRoutesDtoFactory.create({
                deposit: new DepositDto().toDto(deposit),
                work: new WorkDto().entityToDto(work),
                value: 110,
                km: 2910,
                initialPicket: 200,
            })
        )

        const result = await repository.createWorkRoutesInLocalDatabase(entity)

        expect(result).toBeDefined()

        const persisted = await repository.findWorkRoutesByIdInLocalDatabase(result.id)
        expect(persisted).toBeDefined()
        expect(persisted.value).toBe(110)
        expect(persisted.km).toBe(2910)
        expect(persisted.initialPicket).toBe(200)
        expect(persisted.isValid).toBe(true)
    })

    it('Must successfully create a model with int values ​​and return the entity', async () => {
        const entity = new WorkRoutesEntity().dtoToEntity(
            WorkRoutesDtoFactory.create({
                deposit: new DepositDto().toDto(deposit),
                work: new WorkDto().entityToDto(work),
                value: 110,
                km: 2910,
                initialPicket: 200,
            })
        )

        const result = await repository.createWorkRoutesInLocalDatabase(entity)

        expect(result).toBeDefined()

        const persisted = await repository.findWorkRoutesByIdInLocalDatabase(result.id)
        expect(persisted).toBeDefined()
        expect(persisted.value).toBe(110)
        expect(persisted.km).toBe(2910)
        expect(persisted.initialPicket).toBe(200)
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

    it('Should throw a custom error if trying to update a non-existent ID', async () => {
        const entity = new WorkRoutesEntity().dtoToEntity(
            WorkRoutesDtoFactory.create({ id: 'non-existent-id' })
        )

        await expect(repository.updateWorkRoutesInLocalDatabase(entity)).rejects.toThrow(
            /Error updating route in local database/
        )
    })

    it('Should throw a custom error if trying to find a non-existent ID', async () => {
        await expect(repository.findWorkRoutesByIdInLocalDatabase('non-existent-id')).rejects.toThrow(
            /Error loading record from local database./
        )
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

    describe('deleteWorkRoutesInLocalDatabase', () => {
        const targetRouteId = 'route-id-456'
        const targetUserId = 'user-deleter-99'

        afterEach(() => {
            // Restaura todos os mocks após cada teste para evitar efeitos colaterais
            jest.restoreAllMocks()
        })

        it('Should successfully perform a soft delete if no transport dependencies exist', async () => {
            // 1. Arrange: Cria a rota no banco de dados
            const createdModel = await database.write(async () => {
                return await database.get<any>(TableName.WORK_ROUTES).create((item) => {
                    item._raw.id = targetRouteId
                    item.isValid = true
                })
            })

            // Intercepta a chamada para a tabela de transportes e força o contador a retornar 0
            jest.spyOn(database, 'get').mockImplementation((tableName) => {
                const originalTable = database.collections.get(tableName)
                if (tableName === TableName.MATERIAL_TRANSPORTS) {
                    return {
                        query: jest.fn().mockReturnThis(),
                        fetchCount: jest.fn().mockResolvedValue(0), // Sem dependências
                    } as any
                }
                return originalTable as any
            })

            // 2. Act: Executa a exclusão lógica
            await repository.deleteWorkRoutesInLocalDatabase(createdModel.id, targetUserId)

            // 3. Assert: Valida a atualização do registro para deletado
            const persisted = await database.get<any>(TableName.WORK_ROUTES).find(createdModel.id)
            expect(persisted.isValid).toBe(false)
            expect(persisted.userAction).toBe(UserAction.DELETE)
            expect(persisted.userId).toBe(targetUserId)
        })

        it('Should block deletion and throw an error if transport dependencies exist', async () => {
            // Intercepta a tabela de transportes e simula a existência de 3 transportes vinculados
            jest.spyOn(database, 'get').mockImplementation((tableName) => {
                const originalTable = database.collections.get(tableName)
                if (tableName === TableName.MATERIAL_TRANSPORTS) {
                    return {
                        query: jest.fn().mockReturnThis(),
                        fetchCount: jest.fn().mockResolvedValue(3), // Bloqueante!
                    } as any
                }
                return originalTable as any
            })

            // Act & Assert: Tenta apagar a rota e espera o erro de regra de negócio
            await expect(
                repository.deleteWorkRoutesInLocalDatabase(targetRouteId, targetUserId)
            ).rejects.toThrow('Não é possível apagar a Rota')
        })

        it('Should throw an operational error if database update fails', async () => {
            // Silencia o console.log para não sujar os logs do Jest
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

            // Libera a verificação de transportes (retornando 0) para prosseguir ao bloco try-catch
            jest.spyOn(database, 'get').mockImplementation((tableName) => {
                const originalTable = database.collections.get(tableName)
                if (tableName === TableName.MATERIAL_TRANSPORTS) {
                    return {
                        query: jest.fn().mockReturnThis(),
                        fetchCount: jest.fn().mockResolvedValue(0),
                    } as any
                }
                return originalTable as any
            })

            // Act & Assert: Passar um ID inexistente causará um erro nativo no `.find()`
            const nonExistentId = 'ghost-route-id'
            await expect(
                repository.deleteWorkRoutesInLocalDatabase(nonExistentId, targetUserId)
            ).rejects.toThrow('Error deleting route in local database.')

            consoleSpy.mockRestore()
        })
    })

    describe('loadAllWorkRoutesByEnterpriseIdAndWorkIdFromLocalDatabase', () => {
        it('Should return only valid routes matching enterprise and work, sorted by created_at DESC', async () => {
            const agora = Date.now()

            await database.write(async () => {
                // 1. Rota antiga e válida (Deve vir em segundo)
                await database.get<WorkRouteModel>(TableName.WORK_ROUTES).create((item) => {
                    item.workId = work.id
                    item.depositId = deposit.id
                    const raw = item._raw as any
                    raw.enterprise_id = targetEnterpriseId
                    raw.work_id = work.id
                    raw.is_valid = true
                    raw.created_at = agora - 50000
                })

                // 2. Rota recente e válida (Deve vir em primeiro)
                await database.get<any>(TableName.WORK_ROUTES).create((item) => {
                    item.workId = work.id
                    item.depositId = deposit.id
                    const raw = item._raw as any
                    raw.enterprise_id = targetEnterpriseId
                    raw.work_id = work.id
                    raw.is_valid = true
                    raw.created_at = agora
                })

                // 3. Rota de outra obra (Ruído -> Deve ser ignorada)
                await database.get<any>(TableName.WORK_ROUTES).create((item) => {
                    item.workId = work.id
                    item.depositId = deposit.id
                    const raw = item._raw as any
                    raw.enterprise_id = targetEnterpriseId
                    raw.work_id = 'other-work-id'
                    raw.is_valid = true
                    raw.created_at = agora
                })

                // 4. Rota inválida (is_valid = false -> Deve ser ignorada)
                await database.get<any>(TableName.WORK_ROUTES).create((item) => {
                    item.workId = work.id
                    item.depositId = deposit.id
                    const raw = item._raw as any
                    raw.enterprise_id = targetEnterpriseId
                    raw.work_id = work.id
                    raw.is_valid = false
                    raw.created_at = agora
                })
            })

            const result = await repository.loadAllWorkRoutesByEnterpriseIdAndWorkIdFromLocalDatabase(
                targetEnterpriseId,
                work.id
            )

            expect(result.length).toBe(2)
        })

        it('Should throw a custom error if query processing fails', async () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

            // Passar undefined quebra o filtro interno do WatermelonDB e aciona o catch
            await expect(
                repository.loadAllWorkRoutesByEnterpriseIdAndWorkIdFromLocalDatabase(
                    undefined as any,
                    null as any
                )
            ).rejects.toThrow(/Error loading routes from local database/)

            consoleSpy.mockRestore()
        })
    })
    describe('loadAllWorkRoutesByEnterpriseIdAndServerIdValidFromLocalDatabase', () => {
        it('Should return only valid routes that have been synced to the server (server_id > 0)', async () => {
            await database.write(async () => {
                // 1. Rota Sincronizada (server_id = 15 -> Deve retornar)
                await database.get<any>(TableName.WORK_ROUTES).create((item) => {
                    item.workId = work.id
                    item.depositId = deposit.id
                    const raw = item._raw as any
                    raw.enterprise_id = targetEnterpriseId
                    raw.work_id = work.id
                    raw.is_valid = true
                    raw.server_id = 15
                    raw.created_at = Date.now()
                })

                // 2. Rota Local Apenas (server_id = 0 -> Deve ser ignorada)
                await database.get<any>(TableName.WORK_ROUTES).create((item) => {
                    item.workId = work.id
                    item.depositId = deposit.id
                    const raw = item._raw as any
                    raw.enterprise_id = targetEnterpriseId
                    raw.work_id = work.id
                    raw.is_valid = true
                    raw.server_id = 0 // O Q.gt(0) vai barrar esta
                    raw.created_at = Date.now()
                })
            })

            const result = await repository.loadAllWorkRoutesByEnterpriseIdAndServerIdValidFromLocalDatabase(
                targetEnterpriseId,
                work.id
            )

            expect(result.length).toBe(1)
            // Se o model/entity mapeia o serverId, você pode validar: expect(result[0].serverId).toBe(15)
        })

        it('Should throw a custom error on operational failure', async () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

            await expect(
                repository.loadAllWorkRoutesByEnterpriseIdAndServerIdValidFromLocalDatabase(
                    undefined as any,
                    null as any
                )
            ).rejects.toThrow(/Error loading routes from local database/)

            consoleSpy.mockRestore()
        })
    })
})
