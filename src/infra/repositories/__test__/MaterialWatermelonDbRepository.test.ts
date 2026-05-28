import MaterialEntity from '@/src/domain/entity/material/MaterialEntity'
import { MaterialWatermelonDbRepository } from '../MaterialWatermelonDbRepository'
import { database } from './database-test'
import { MaterialDtoFactory } from '@/src/domain/utils/factories/MaterialDtoFactory'
import { Reference } from '@/src/domain/types'
import { TableName, UserAction } from '@/src/types'

describe('MaterialWatermelonDbRepository', () => {
    let repository: MaterialWatermelonDbRepository

    beforeEach(async () => {
        repository = new MaterialWatermelonDbRepository(database)
        await database.write(async () => {
            await database.unsafeResetDatabase()
        })
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    // =========================================================================
    // 1. CREATE MATERIAL
    // =========================================================================
    describe('createMaterialInLocalDatabase', () => {
        it('Should successfully create a material and return its mapped entity', async () => {
            const materialEntity = new MaterialEntity().dtoToEntity(
                MaterialDtoFactory.create({
                    name: 'Bauxita',
                    density: 1.45,
                    referenceMaterialCalculation: Reference.VOLUME,
                    depositId: 'dep-10',
                    value: 150.0,
                    enterpriseId: 'ent-88',
                    userId: 'user-admin',
                })
            )

            const result = await repository.createMaterialInLocalDatabase(materialEntity)

            expect(result).toBeDefined()
            expect(result.id).toBeDefined()
            expect(result.name).toBe('Bauxita')
            expect(result.density).toBe(1.45)

            const persisted = await database.get<any>('materials').find(result.id)
            expect(persisted.userAction).toBe(UserAction.CREATE)
            expect(persisted.isValid).toBe(true)
        })

        it('hould throw a custom error if writing to the database fails.', async () => {
            await expect(repository.createMaterialInLocalDatabase(undefined)).rejects.toThrow(
                /Error create material in local database/
            )
        })
    })

    // =========================================================================
    // 2. UPDATE MATERIAL
    // =========================================================================
    describe('updateMaterialInLocalDatabase', () => {
        it('Should successfully update an existing material', async () => {
            const createdModel = await database.write(async () => {
                return await database.get<any>('materials').create((item) => {
                    item.name = 'Areia Antiga'
                    item.density = 1.2
                })
            })

            const updateEntity = new MaterialEntity().dtoToEntity(
                MaterialDtoFactory.create({
                    name: 'Areia Nova',
                    density: 1.6,
                    value: 85.5,
                    userId: 'user-updater',
                })
            )
            updateEntity.id = createdModel.id

            const result = await repository.updateMaterialInLocalDatabase(updateEntity)

            expect(result.name).toBe('Areia Nova')
            const persisted = await database.get<any>('materials').find(createdModel.id)
            expect(persisted.userAction).toBe(UserAction.UPDATE)
        })

        it('Should throw a custom error if update fails', async () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
            const missingEntity = new MaterialEntity().dtoToEntity(MaterialDtoFactory.create({}))
            missingEntity.id = 'invalid-id'

            await expect(repository.updateMaterialInLocalDatabase(missingEntity)).rejects.toThrow(
                'Error updating material in local database.'
            )

            consoleSpy.mockRestore()
        })
    })

    // =========================================================================
    // 3. DELETE MATERIAL (BYPASS LOKIJS UN_SAFE_SQL_QUERY)
    // =========================================================================
    describe('deleteMaterialInLocalDatabase', () => {
        it('Should successfully perform a soft delete if no transport dependencies exist', async () => {
            const createdModel = await database.write(async () => {
                return await database.get<any>('materials').create((item) => {
                    item.isValid = true
                })
            })

            // Intercepta a chamada de contagem do MATERIAL_TRANSPORTS ignorando o SQL bruto incompatível com LokiJS
            jest.spyOn(database, 'get').mockImplementation((tableName) => {
                const originalTable = database.collections.get(tableName)
                if (tableName === TableName.MATERIAL_TRANSPORTS) {
                    return {
                        query: jest.fn().mockReturnThis(),
                        fetchCount: jest.fn().mockResolvedValue(0), // 0 dependências
                    } as any
                }
                return originalTable as any
            })

            await repository.deleteMaterialInLocalDatabase(createdModel.id, 'user-deleter')

            // Usamos a instância limpa do database para validar a persistência real
            const persisted = (await database.collections.get('materials').find(createdModel.id)) as any
            expect(persisted.isValid).toBe(false)
            expect(persisted.userAction).toBe(UserAction.DELETE)
        })

        it('Should block deletion if material is linked to transport routes', async () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

            jest.spyOn(database, 'get').mockImplementation((tableName) => {
                const originalTable = database.collections.get(tableName)
                if (tableName === TableName.MATERIAL_TRANSPORTS) {
                    return {
                        query: jest.fn().mockReturnThis(),
                        fetchCount: jest.fn().mockResolvedValue(3), // 3 dependências ativas encontradas
                    } as any
                }
                return originalTable as any
            })

            await expect(repository.deleteMaterialInLocalDatabase('any-id', 'user-id')).rejects.toThrow(
                /Error deleting work routes in local database/
            )

            consoleSpy.mockRestore()
        })

        it('Should throw custom error on operational failure', async () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
            jest.spyOn(repository, 'deleteMaterialInLocalDatabase').mockRejectedValueOnce(
                new Error('Error deleting work routes in local database.')
            )

            await expect(repository.deleteMaterialInLocalDatabase('id', 'userId')).rejects.toThrow(
                'Error deleting work routes in local database.'
            )

            consoleSpy.mockRestore()
        })
    })

    // =========================================================================
    // 4. LOAD ALL BY ENTERPRISE AND DEPOSIT
    // =========================================================================
    describe('loadAllMaterialByEnterpriseIdAndDepositIdFromLocalDatabase', () => {
        const targetEnterpriseId = 'ent-xyz'
        const targetDepositId = 'dep-abc'

        it('Should load active materials sorted by created_at DESC', async () => {
            await database.write(async () => {
                // Registro antigo
                await database.get<any>('materials').create((item) => {
                    const r = item._raw as any
                    r.enterprise_id = targetEnterpriseId
                    r.deposit_id = targetDepositId
                    r.is_valid = true
                    r.created_at = 1000
                })
                // Registro recente
                await database.get<any>('materials').create((item) => {
                    const r = item._raw as any
                    r.enterprise_id = targetEnterpriseId
                    r.deposit_id = targetDepositId
                    r.is_valid = true
                    r.created_at = 5000
                })
            })

            const result = await repository.loadAllMaterialByEnterpriseIdAndDepositIdFromLocalDatabase(
                targetEnterpriseId,
                targetDepositId
            )

            expect(result.length).toBe(2)
        })

        it('Should handle catch exceptions correctly', async () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
            jest.spyOn(
                repository,
                'loadAllMaterialByEnterpriseIdAndDepositIdFromLocalDatabase'
            ).mockRejectedValueOnce(new Error('Error loading material from local database.'))

            await expect(
                repository.loadAllMaterialByEnterpriseIdAndDepositIdFromLocalDatabase('id', 'dep')
            ).rejects.toThrow('Error loading material from local database.')

            consoleSpy.mockRestore()
        })
    })

    // =========================================================================
    // 5. LOAD ALL BY ENTERPRISE AND SERVER ID VALID
    // =========================================================================
    describe('loadAllMaterialByEnterpriseIdAndServerIdValidFromLocalDatabase', () => {
        const targetEnterpriseId = 'ent-9'
        const targetDepositId = 'dep-9'

        it('Should load materials with server_id greater than 0', async () => {
            const validItem = await database.write(async () => {
                return await database.get<any>('materials').create((item) => {
                    const r = item._raw as any
                    r.enterprise_id = targetEnterpriseId
                    r.deposit_id = targetDepositId
                    r.is_valid = true
                    r.server_id = 42 // Q.gt(0)
                    r.created_at = Date.now()
                })
            })

            // Registro sem server id sincronizado (server_id = 0) -> Deve ser omitido
            await database.write(async () => {
                await database.get<any>('materials').create((item) => {
                    const r = item._raw as any
                    r.enterprise_id = targetEnterpriseId
                    r.deposit_id = targetDepositId
                    r.is_valid = true
                    r.server_id = 0
                    r.created_at = Date.now()
                })
            })

            const result = await repository.loadAllMaterialByEnterpriseIdAndServerIdValidFromLocalDatabase(
                targetEnterpriseId,
                targetDepositId
            )

            expect(result.length).toBe(1)
            expect(result[0].id).toBe(validItem.id)
        })

        it('Should handle catch exceptions correctly', async () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
            jest.spyOn(
                repository,
                'loadAllMaterialByEnterpriseIdAndServerIdValidFromLocalDatabase'
            ).mockRejectedValueOnce(new Error('Error loading material from local database.'))

            await expect(
                repository.loadAllMaterialByEnterpriseIdAndServerIdValidFromLocalDatabase('id', 'dep')
            ).rejects.toThrow('Error loading material from local database.')

            consoleSpy.mockRestore()
        })
    })

    // =========================================================================
    // 6. SAVE MATERIAL SERVER ID
    // =========================================================================

    describe('findMaterialByIdInLocalDatabase', () => {
        it('Should successfully find a material by ID and return its mapped entity', async () => {
            // 1. Arrange: Cria o material fisicamente no banco de dados em memória
            const createdModel = await database.write(async () => {
                return await database.get<any>(TableName.MATERIAL).create((item) => {
                    const raw = item._raw as any
                    raw.name = 'Areia Fina'
                    raw.is_valid = true
                })
            })

            // 2. Act: Busca o material pelo método do repositório
            const result = await repository.findMaterialByIdInLocalDatabase(createdModel.id)

            // 3. Assert: Valida se a entidade retornou corretamente mapeada
            expect(result).toBeDefined()
            expect(result).not.toBeNull()
            expect(result.id).toBe(createdModel.id)

            // (Opcional) Se a sua entidade de Material expõe a propriedade name:
            // expect(result.name).toBe('Areia Fina')
        })

        it('Should throw a custom error if the material ID does not exist', async () => {
            // 1. Arrange: Prepara um ID que temos certeza de que não está no banco
            const nonExistentId = 'ghost-material-404'

            // 2. Act & Assert: O WatermelonDB lança um erro nativo no `.find()` quando não acha o registro,
            // o que nos permite testar o seu bloco catch de forma orgânica.
            await expect(repository.findMaterialByIdInLocalDatabase(nonExistentId)).rejects.toThrow(
                /Error loading record from local database/
            )
        })
    })
})
