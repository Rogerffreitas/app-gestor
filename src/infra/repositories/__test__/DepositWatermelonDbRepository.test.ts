import { TableName, UserAction } from '../../../types'
import DepositModel from '../../../database/model/DepositModel'
import { DepositWatermelonDbRepository } from '../DepositWatermelonDbRepository'
import { database } from './database-test'
import DepositEntity from '@/src/domain/entity/deposit/DepositEntity'
import { DepositDtoFactory } from '@/src/domain/utils/factories/DepositDtoFactory'

describe('DepositWatermelonDbRepository', () => {
    const repository = new DepositWatermelonDbRepository(database)

    beforeEach(async () => {
        await database.write(async () => {
            await database.unsafeResetDatabase()
        })
    })

    describe('Tests for the Deposit repository', () => {
        it('Must successfully create a model and return to the entity.', async () => {
            const countBeforeCreate = (await database.get<DepositModel>(TableName.DEPOSITS).query().fetch())
                .length

            const result = await repository.createDepositInLocalDatabase(
                new DepositEntity().dtoToEntity(DepositDtoFactory.create())
            )

            console.info()

            const countAfterCreate = (await database.get<DepositModel>(TableName.DEPOSITS).query().fetch())
                .length

            expect(result).toBeDefined()
            expect(result).toBeInstanceOf(DepositEntity)
            expect(countBeforeCreate).toEqual(0)
            expect(countAfterCreate).toEqual(1)
        })

        it('hould throw a custom error if writing to the database fails.', async () => {
            await expect(repository.createDepositInLocalDatabase(undefined)).rejects.toThrow(
                /Error create Deposit in local database/
            )
        })

        it('You should search for a model by ID, update it, and return an entity.', async () => {
            const countBeforeCreate = (await database.get<DepositModel>(TableName.DEPOSITS).query().fetch())
                .length
            const createdEntity = await repository.createDepositInLocalDatabase(
                new DepositEntity().dtoToEntity(DepositDtoFactory.create())
            )
            const countAfterCreate = (await database.get<DepositModel>(TableName.DEPOSITS).query().fetch())
                .length

            const result = await repository.updateDepositInLocalDatabase(createdEntity)
            expect(countBeforeCreate).toEqual(0)
            expect(countAfterCreate).toEqual(1)
            expect(result.userAction).toBe(UserAction.UPDATE)
        })

        it('Should throw a custom error if trying to update a non-existent ID', async () => {
            const fakeEntity = new DepositEntity().dtoToEntity(
                DepositDtoFactory.create({ id: 'non-existent-id' })
            )
            await expect(repository.updateDepositInLocalDatabase(fakeEntity)).rejects.toThrow(
                /Error updating deposit in local database/
            )
        })
    })

    describe('findDepositByIdInLocalDatabase', () => {
        it('Should successfully find a deposit by ID and return its mapped entity', async () => {
            // 1. Arrange: Criar um registro diretamente na tabela de depósitos
            const entityCreated = await repository.createDepositInLocalDatabase(
                new DepositEntity().dtoToEntity(DepositDtoFactory.create({ name: 'Depósito Central' }))
            )

            // 2. Act: Buscar o registro utilizando o método do repositório
            const result = await repository.findDepositByIdInLocalDatabase(entityCreated.id)

            // 3. Assert: Verificar se retornou a instância correta
            expect(result).toBeDefined()
            expect(result).not.toBeNull()
            expect(result.id).toBe(entityCreated.id)
            expect(result.name).toBe('Depósito Central')
        })

        it('Should throw a custom error if the deposit ID does not exist', async () => {
            // Silencia temporariamente o console.error para não sujar o terminal do Jest
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

            const nonExistentId = 'missing-deposit-id-999'

            // Act & Assert: O .find() do Watermelon falha nativamente se o ID não existir, caindo no catch
            await expect(repository.findDepositByIdInLocalDatabase(nonExistentId)).rejects.toThrow(
                /Error deleting deposit routes in local database/
            )

            // Restaura o console original
            consoleSpy.mockRestore()
        })
    })

    describe('deleteDepositInLocalDatabase', () => {
        it('Should successfully perform a soft delete if no work routes dependencies exist', async () => {
            // 1. Arrange: Cria o depósito no banco
            const entityCreated = await repository.createDepositInLocalDatabase(
                new DepositEntity().dtoToEntity(DepositDtoFactory.create())
            )

            // Intercepta a chamada para a tabela de rotas e força o contador a retornar 0
            jest.spyOn(database, 'get').mockImplementation((tableName) => {
                const originalTable = database.collections.get(tableName)
                if (tableName === 'work_routes') {
                    return {
                        query: jest.fn().mockReturnThis(),
                        fetchCount: jest.fn().mockResolvedValue(0), // Nenhuma dependência encontrada
                    } as any
                }
                return originalTable as any
            })

            // 2. Act: Tenta deletar o depósito
            await repository.deleteDepositInLocalDatabase(entityCreated.id, 'user-deleter')

            // 3. Assert: Busca o registro real no banco e verifica se o soft delete foi aplicado
            const persisted = await database.get<DepositModel>('deposits').find(entityCreated.id)
            expect(persisted.isValid).toBe(false)
            expect(persisted.userAction).toBe(UserAction.DELETE)
            expect(persisted.userId).toBe('user-deleter')
        })

        it('Should block deletion and throw a custom error if deposit is linked to work routes', async () => {
            // Intercepta a chamada de contagem e simula que existem rotas associadas a este depósito
            jest.spyOn(database, 'get').mockImplementation((tableName) => {
                const originalTable = database.collections.get(tableName)
                if (tableName === 'work_routes') {
                    return {
                        query: jest.fn().mockReturnThis(),
                        fetchCount: jest.fn().mockResolvedValue(5), // 5 dependências bloqueantes
                    } as any
                }
                return originalTable as any
            })

            // Act & Assert: Deve lançar o erro de regra de negócio imediatamente e abortar
            await expect(repository.deleteDepositInLocalDatabase('any-id', 'user-id')).rejects.toThrow(
                'Não é possível apagar a Jazida'
            )
        })

        it('Should throw an operational error if database update process fails', async () => {
            // Silencia o console de erro para não poluir o log do Jest
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

            // Libera a validação de rotas para o código prosseguir para o try-catch
            jest.spyOn(database, 'get').mockImplementation((tableName) => {
                const originalTable = database.collections.get(tableName)
                if (tableName === 'work_routes') {
                    return {
                        query: jest.fn().mockReturnThis(),
                        fetchCount: jest.fn().mockResolvedValue(0),
                    } as any
                }
                return originalTable as any
            })

            // Act & Assert: Passar um ID que não existe na tabela 'deposits' forçará o .find() a falhar
            const nonExistentId = 'ghost-id-404'
            await expect(repository.deleteDepositInLocalDatabase(nonExistentId, 'user-id')).rejects.toThrow(
                /Error deleting deposit routes in local database/
            )

            consoleSpy.mockRestore()
        })
    })

    describe('loadAllDepositByEnterpriseIdFromLocalDatabase', () => {
        const targetEnterpriseId = 'ent-deposit-777'

        it('Should return only valid deposits for the given enterprise sorted by created_at DESC', async () => {
            const agora = Date.now()
            const dezMinutosAtras = agora - 10 * 60 * 1000

            await database.write(async () => {
                // 1. Registro antigo e válido (Deve vir na segunda posição devido ao Q.desc)
                await database.get<any>('deposits').create((item) => {
                    item.name = 'Depósito Antigo'
                    const raw = item._raw as any
                    raw.enterprise_id = targetEnterpriseId
                    raw.is_valid = true
                    raw.created_at = dezMinutosAtras
                    raw.name = 'Depósito Antigo'
                })

                // 2. Registro recente e válido (Deve vir na primeira posição)
                await database.get<any>('deposits').create((item) => {
                    item.name = 'Depósito Recente'
                    const raw = item._raw as any
                    raw.enterprise_id = targetEnterpriseId
                    raw.is_valid = true
                    raw.created_at = agora
                    raw.name = 'Depósito Recente'
                })

                // 3. Registro inválido (is_valid = false) -> Deve ser filtrado
                await database.get<any>('deposits').create((item) => {
                    const raw = item._raw as any
                    raw.enterprise_id = targetEnterpriseId
                    raw.is_valid = false
                    raw.created_at = agora
                })

                // 4. Registro de outra empresa -> Deve ser filtrado
                await database.get<any>('deposits').create((item) => {
                    const raw = item._raw as any
                    raw.enterprise_id = 'other-enterprise-id'
                    raw.is_valid = true
                    raw.created_at = agora
                })
            })

            // Act: Executa o método
            const result = await repository.loadAllDepositByEnterpriseIdFromLocalDatabase(targetEnterpriseId)

            // Assert: Verifica se apenas os 2 registros válidos da empresa correta retornaram
            expect(result.length).toBe(2)
            expect(result[0].name).toBe('Depósito Recente')
            expect(result[1].name).toBe('Depósito Antigo')
        })

        it('Should throw a custom error if execution fails', async () => {
            // Silencia o console.error do catch para não sujar o terminal
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

            // Act & Assert: Passar undefined quebra a validação interna do Q.where no WatermelonDB
            await expect(
                repository.loadAllDepositByEnterpriseIdFromLocalDatabase(undefined as any)
            ).rejects.toThrow(/Error loading deposit from local database/)

            consoleSpy.mockRestore()
        })
    })
})
