import WorkEntity from '../../../domain/entity/work/WorkEntity'
import { WorkWatermelonDbRepository } from '../WorkWatermelonDbRepository'
import { TableName, UserAction } from '../../../domain/types'
import { database } from './database-test'
import { WorkDtoFactory } from '@/src/domain/utils/factories/WorkDtoFactory'
import WorkModel from '@/src/database/model/WorkModel'
import { Q } from '@nozbe/watermelondb'

describe('WorkWatermelonDbRepository', () => {
    const repository = new WorkWatermelonDbRepository(database)
    const targetEnterpriseId = 'ent-work-99'
    const targetUserId = 'user-admin-123'

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

    it('Should throw a custom error if trying to update a non-existent ID', async () => {
        const fakeWork = new WorkEntity().dtoToEntity(WorkDtoFactory.create({ id: 'non-existent-id' }))

        await expect(repository.updateWorkInLocalDatabase(fakeWork)).rejects.toThrow(
            /Error updating work in local database/
        )
    })

    it('Should throw a custom error if trying to find a non-existent ID', async () => {
        await expect(repository.findWorkByIdInLocalDatabase('non-existent-id')).rejects.toThrow(
            /Error loading works from local database/
        )
    })

    describe('deleteWorkInLocalDatabase', () => {
        const targetWorkId = 'work-id-123'

        it('Should successfully soft delete a work if no dependencies exist', async () => {
            // 1. Arrange: Cria a obra no banco de dados sem nenhuma dependência associada
            const createdModel = await database.write(async () => {
                return await database.get<any>(TableName.WORKS).create((item) => {
                    item._raw.id = targetWorkId
                    item.isValid = true
                })
            })

            // 2. Act: Executa o método de exclusão lógica
            await repository.deleteWorkInLocalDatabase(createdModel.id, 'user-deleter')

            // 3. Assert: Valida se a obra foi atualizada corretamente para deletada
            const persisted = await database.get<any>(TableName.WORKS).find(createdModel.id)
            expect(persisted.isValid).toBe(false)
            expect(persisted.userAction).toBe(UserAction.DELETE)
            expect(persisted.userId).toBe('user-deleter')
        })

        it('Should block deletion and throw an error if work is linked to fuel supplies', async () => {
            // 1. Arrange: Cria a obra e associa um abastecimento a ela
            await database.write(async () => {
                // Cria a obra
                await database.get<any>(TableName.WORKS).create((item) => {
                    item._raw.id = targetWorkId
                    item.isValid = true
                })

                // Cria o abastecimento apontando para a obra (Dispara a validação do fetchCount)
                await database.get<any>(TableName.FUEL_SUPPLIES).create((item) => {
                    item._raw.work_id = targetWorkId
                })
            })

            // 2. Act & Assert: Tenta deletar e espera que a regra de negócio bloqueie
            await expect(repository.deleteWorkInLocalDatabase(targetWorkId, 'user-deleter')).rejects.toThrow(
                'A obra não pode ser excluída, pois existem registros associados (transporte, combustível ou descontos).'
            )
        })

        it('Should throw an operational error if the database update process fails', async () => {
            // Silencia o console.error temporariamente para não sujar o terminal do Jest
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

            // Act: Passa um ID que não existe. A validação de dependências vai retornar 0 (sucesso),
            // mas o bloco "try-catch" falhará nativamente ao tentar fazer o ".find(nonExistentId)" dentro do ".write()"
            const nonExistentId = 'ghost-work-404'

            // Assert: Valida a mensagem de erro formatada no seu catch
            await expect(repository.deleteWorkInLocalDatabase(nonExistentId, 'user-id')).rejects.toThrow(
                /Error deleting work in local database/
            )

            consoleSpy.mockRestore()
        })
    })

    describe('loadAllWorksByEnterpriseIdFromLocalDatabase', () => {
        it('Should return only valid works for the enterprise sorted by created_at DESC', async () => {
            const agora = Date.now()

            await database.write(async () => {
                // 1. Obra antiga e válida
                await database.get<any>(TableName.WORKS).create((item) => {
                    const raw = item._raw as any
                    raw.enterprise_id = targetEnterpriseId
                    raw.is_valid = true
                    raw.created_at = agora - 50000
                })

                // 2. Obra recente e válida (Deve vir primeiro)
                await database.get<any>(TableName.WORKS).create((item) => {
                    const raw = item._raw as any
                    raw.enterprise_id = targetEnterpriseId
                    raw.is_valid = true
                    raw.created_at = agora
                })

                // 3. Obra inválida (is_valid = false) -> Deve ser ignorada
                await database.get<any>(TableName.WORKS).create((item) => {
                    const raw = item._raw as any
                    raw.enterprise_id = targetEnterpriseId
                    raw.is_valid = false
                    raw.created_at = agora
                })
            })

            const result = await repository.loadAllWorksByEnterpriseIdFromLocalDatabase(targetEnterpriseId)

            expect(result.length).toBe(2)
        })

        it('Should throw a custom error if query processing fails', async () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

            // Passar undefined forçará uma quebra interna no WatermelonDB, ativando o catch
            await expect(
                repository.loadAllWorksByEnterpriseIdFromLocalDatabase(undefined as any)
            ).rejects.toThrow(/Error loading works from local database/)

            consoleSpy.mockRestore()
        })
    })

    describe('loadAllWorksByEnterpriseIdAndUserIdFromLocalDatabase', () => {
        it('Should return valid works filtered by enterprise and user existence in users_list', async () => {
            await database.write(async () => {
                // 1. Obra válida com o usuário na lista (Deve retornar)
                await database.get<any>(TableName.WORKS).create((item) => {
                    const raw = item._raw as any
                    raw.enterprise_id = targetEnterpriseId
                    raw.is_valid = true
                    raw.users_list = `user-001,${targetUserId},user-002` // Q.like vai achar aqui
                    raw.created_at = Date.now()
                })

                // 2. Obra válida, mas SEM o usuário na lista (Deve ser ignorada)
                await database.get<any>(TableName.WORKS).create((item) => {
                    const raw = item._raw as any
                    raw.enterprise_id = targetEnterpriseId
                    raw.is_valid = true
                    raw.users_list = 'user-001,user-002' // targetUserId não está aqui
                    raw.created_at = Date.now()
                })
            })

            const result = await repository.loadAllWorksByEnterpriseIdAndUserIdFromLocalDatabase(
                targetEnterpriseId,
                targetUserId
            )

            expect(result.length).toBe(1) // Apenas a obra 1 deve retornar
        })

        it('Should throw a custom error if execution fails due to invalid parameters', async () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

            await expect(
                repository.loadAllWorksByEnterpriseIdAndUserIdFromLocalDatabase(undefined as any, null as any)
            ).rejects.toThrow(/Error loading works from local database/)

            consoleSpy.mockRestore()
        })
    })

    describe('loadAllWorkByEnterpriseIdAndUserIdAndValidServerIdFromDatabase', () => {
        it('Should return works that match enterprise, user, and have a server_id greater than zero', async () => {
            await database.write(async () => {
                // 1. Obra perfeita: Validada, Sincronizada (server_id > 0) e com o usuário na lista
                await database.get<any>(TableName.WORKS).create((item) => {
                    const raw = item._raw as any
                    raw.enterprise_id = targetEnterpriseId
                    raw.is_valid = true
                    raw.users_list = targetUserId
                    raw.server_id = 42 // Sincronizado
                    raw.created_at = Date.now()
                })

                // 2. Obra local: Perfeita, mas ainda NÃO sincronizada (server_id = 0) -> Deve ser ignorada
                await database.get<any>(TableName.WORKS).create((item) => {
                    const raw = item._raw as any
                    raw.enterprise_id = targetEnterpriseId
                    raw.is_valid = true
                    raw.users_list = targetUserId
                    raw.server_id = 0 // Q.gt(0) vai barrar aqui
                    raw.created_at = Date.now()
                })
            })

            const result = await repository.loadAllWorkByEnterpriseIdAndUserIdAndValidServerIdFromDatabase(
                targetEnterpriseId,
                targetUserId
            )

            expect(result.length).toBe(1)
            // Se você exportar o model/entity, poderia fazer: expect(result[0].serverId).toBe(42)
        })

        it('Should throw a custom error on operational failure', async () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

            await expect(
                repository.loadAllWorkByEnterpriseIdAndUserIdAndValidServerIdFromDatabase(
                    undefined as any,
                    null as any
                )
            ).rejects.toThrow(/Error loading works from local database/)

            consoleSpy.mockRestore()
        })
    })
})
