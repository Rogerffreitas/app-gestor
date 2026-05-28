import { MaintenanceTruckEntity } from '@/src/domain/entity/maintenance-truck/MaintenanceTruckEntity'
import { MaintenanceTruckWatermelonDbRepository } from '../MaintenanceTruckWatermelonDbRepository'
import { database } from './database-test'
import { TableName, UserAction } from '@/src/types'
import { MaintenanceTruckDtoFactory } from '@/src/domain/utils/factories/MaintenanceTruckDtoFactory'

describe('MaintenanceTruckWatermelonDbRepository', () => {
    let repository: MaintenanceTruckWatermelonDbRepository

    beforeEach(async () => {
        repository = new MaintenanceTruckWatermelonDbRepository(database)
        await database.write(async () => {
            await database.unsafeResetDatabase()
        })
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    // =========================================================================
    // 1. CREATE MAINTENANCE TRUCK
    // =========================================================================
    describe('createMaintenanceTruckInLocalDatabase', () => {
        it('Should successfully persist a maintenance truck and return its mapped entity', async () => {
            const truckEntity = new MaintenanceTruckEntity().dtoToEntity(
                MaintenanceTruckDtoFactory.create({
                    capacity: 5000,
                    operatorMotorist: 'João Motorista',
                    nameProprietary: 'Empresa XYZ',
                    modelOrPlate: 'ABC-1234',
                    workId: 'work-100',
                    enterpriseId: 'enterprise-777',
                    userId: 'user-creator',
                })
            )

            const result = await repository.createMaintenanceTruckInLocalDatabase(truckEntity)

            expect(result).toBeDefined()
            expect(result.id).toBeDefined()
            expect(result.operatorMotorist).toBe('João Motorista')
            expect(result.capacity).toBe(5000)

            // Verifica persistência física no banco de dados
            const persistedModel = await database.get<any>(TableName.MAINTENANCE_TRUCKS).find(result.id)
            expect(persistedModel.userAction).toBe(UserAction.CREATE)
            expect(persistedModel.isValid).toBe(true)
            expect(persistedModel.serverId).toBe(0)
        })

        it('Should throw a custom error if writing to the database fails.', async () => {
            await expect(repository.createMaintenanceTruckInLocalDatabase(undefined)).rejects.toThrow(
                /Error create maintenace trucks in local database./
            )
        })
    })

    // =========================================================================
    // 2. UPDATE MAINTENANCE TRUCK
    // =========================================================================
    describe('updateMaintenanceTruckInLocalDatabase', () => {
        it('Should successfully update fields of an existing maintenance truck', async () => {
            // Insere o registro original diretamente
            const createdModel = await database.write(async () => {
                return await database.get<any>(TableName.MAINTENANCE_TRUCKS).create((item) => {
                    item.capacity = 3000
                    item.operatorMotorist = 'Antigo Motorista'
                    item.userAction = UserAction.CREATE
                })
            })

            const updateEntity = new MaintenanceTruckEntity().dtoToEntity(
                MaintenanceTruckDtoFactory.create({
                    id: createdModel.id,
                    capacity: 4500,
                    operatorMotorist: 'Novo Motorista',
                    userId: 'user-updater',
                })
            )

            const result = await repository.updateMaintenanceTruckInLocalDatabase(updateEntity)

            expect(result.operatorMotorist).toBe('Novo Motorista')
            expect(result.capacity).toBe(4500)

            const persistedModel = await database.get<any>(TableName.MAINTENANCE_TRUCKS).find(createdModel.id)
            expect(persistedModel.userAction).toBe(UserAction.UPDATE)
            expect(persistedModel.userId).toBe('user-updater')
        })

        it('Should throw custom error if target ID to update does not exist', async () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
            const missingEntity = new MaintenanceTruckEntity()
            missingEntity.id = 'non-existent-id'

            await expect(repository.updateMaintenanceTruckInLocalDatabase(missingEntity)).rejects.toThrow(
                'Error updating maintenace trucks in local database.'
            )

            consoleSpy.mockRestore()
        })
    })

    // =========================================================================
    // 3. DELETE MAINTENANCE TRUCK (SOFT DELETE + INTEGRITY CHECK)
    // =========================================================================
    describe('deleteMaintenanceTruckInLocalDatabase', () => {
        const targetEquipmentId = 'equip-999'

        it('Should perform soft delete successfully if there are no fuel supply dependencies', async () => {
            const createdModel = await database.write(async () => {
                return await database.get<any>(TableName.MAINTENANCE_TRUCKS).create((item) => {
                    item.workEquipmentId = targetEquipmentId
                    item.isValid = true
                })
            })

            await repository.deleteMaintenanceTruckInLocalDatabase(
                createdModel.id,
                targetEquipmentId,
                'user-deleter'
            )

            const persistedModel = await database.get<any>(TableName.MAINTENANCE_TRUCKS).find(createdModel.id)
            expect(persistedModel.isValid).toBe(false)
            expect(persistedModel.userAction).toBe(UserAction.DELETE)
            expect(persistedModel.userId).toBe('user-deleter')
        })

        it('Should block deletion and throw error if fuel supply dependencies exist', async () => {
            const createdModel = await database.write(async () => {
                // Simula dependência inserindo um registro na tabela de abastecimentos vinculado ao equipamento
                await database.get<any>(TableName.FUEL_SUPPLYS).create((fuel) => {
                    fuel._raw.transport_vehicle_or_work_equipment_id = targetEquipmentId
                })

                return await database.get<any>(TableName.MAINTENANCE_TRUCKS).create((item) => {
                    item.workEquipmentId = targetEquipmentId
                    item.isValid = true
                })
            })

            await expect(
                repository.deleteMaintenanceTruckInLocalDatabase(
                    createdModel.id,
                    targetEquipmentId,
                    'user-deleter'
                )
            ).rejects.toThrow('Error deleting maintenace trucks in local database.')

            // Garante que o registro permaneceu ativo
            const persistedModel = await database.get<any>(TableName.MAINTENANCE_TRUCKS).find(createdModel.id)
            expect(persistedModel.isValid).toBe(true)
        })
    })

    // =========================================================================
    // 4. LOAD ALL MAINTENANCE TRUCKS BY ENTERPRISE AND WORK
    // =========================================================================
    describe('loadAllMaintenanceTruckByEnterpriseIdAndWorkIdFromLocalDatabase', () => {
        const targetEnterpriseId = 'ent-1'
        const targetWorkId = 'work-A'

        it('Should return valid maintenance trucks matching filters sorted by created_at DESC', async () => {
            const targetEnterpriseId = 'ent-1'
            const targetWorkId = 'work-A'

            // 1. Arrange: Registro Antigo (Deve vir em segundo lugar no array final)
            const oldModel = await database.write(async () => {
                return await database.get<any>(TableName.MAINTENANCE_TRUCKS).create((item) => {
                    const raw = item._raw as any
                    raw.enterprise_id = targetEnterpriseId
                    raw.work_id = targetWorkId
                    raw.is_valid = true
                    raw.created_at = 1000000000000 // Timestamp menor (Passado)
                })
            })

            // 2. Arrange: Registro Recente (Deve vir em primeiro lugar no array devido ao Q.desc)
            const recentModel = await database.write(async () => {
                return await database.get<any>(TableName.MAINTENANCE_TRUCKS).create((item) => {
                    const raw = item._raw as any
                    raw.enterprise_id = targetEnterpriseId
                    raw.work_id = targetWorkId
                    raw.is_valid = true
                    raw.created_at = 2000000000000 // Timestamp maior (Futuro/Recente)
                })
            })

            // 3. Arrange: Registro de outra empresa (Deve ser ignorado pela query)
            await database.write(async () => {
                return await database.get<any>(TableName.MAINTENANCE_TRUCKS).create((item) => {
                    const raw = item._raw as any
                    raw.enterprise_id = 'other-enterprise'
                    raw.work_id = targetWorkId
                    raw.is_valid = true
                    raw.created_at = 1500000000000
                })
            })

            // Act: Executa o método do repositório
            const result = await repository.loadAllMaintenanceTruckByEnterpriseIdAndWorkIdFromLocalDatabase(
                targetEnterpriseId,
                targetWorkId
            )

            // Assert: Garante que encontrou os 2 caminhões corretos e respeitou a ordenação decrescente
            expect(result.length).toBe(2)
            expect(result[0].id).toBe(recentModel.id) // O mais recente primeiro
            expect(result[1].id).toBe(oldModel.id) // O mais antigo depois
        })
        it('Should throw custom error on load failure', async () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

            await expect(
                repository.loadAllMaintenanceTruckByEnterpriseIdAndWorkIdFromLocalDatabase(
                    undefined,
                    undefined
                )
            ).rejects.toThrow('Error loading maintenace trucks from local database.')

            consoleSpy.mockRestore()
        })
    })

    // =========================================================================
    // 5. LOAD ALL VALID MAINTENANCE TRUCKS FROM SERVER IDENTIFIER
    // =========================================================================
    describe('loadAllMaintenanceTruckByEnterpriseIdAndServerIdValidFromLocalDatabase', () => {
        describe('loadAllMaintenanceTruckByEnterpriseIdAndServerIdValidFromLocalDatabase', () => {
            it('Should return only valid maintenance trucks that match enterprise and work criteria', async () => {
                const targetEnterpriseId = 'ent-2'
                const targetWorkId = 'work-B'

                // Arrange: Criar o registro forçando os valores brutos idênticos aos buscados pelo Q.where
                const expectedModel = await database.write(async () => {
                    return await database.get<any>(TableName.MAINTENANCE_TRUCKS).create((item) => {
                        const raw = item._raw as any
                        raw.enterprise_id = targetEnterpriseId
                        raw.work_id = targetWorkId
                        raw.is_valid = true
                        raw.created_at = Date.now() // Necessário para o Q.sortBy('created_at') não quebrar no LokiJS
                    })
                })

                // Registro com soft delete (is_valid = false) -> Deve ser ignorado pela query
                await database.write(async () => {
                    await database.get<any>(TableName.MAINTENANCE_TRUCKS).create((item) => {
                        const raw = item._raw as any
                        raw.enterprise_id = targetEnterpriseId
                        raw.work_id = targetWorkId
                        raw.is_valid = false
                        raw.created_at = Date.now() - 1000
                    })
                })

                // Act: Executa o método do repositório
                const result =
                    await repository.loadAllMaintenanceTruckByEnterpriseIdAndServerIdValidFromLocalDatabase(
                        targetEnterpriseId,
                        targetWorkId
                    )

                // Assert: Agora o LokiJS vai encontrar exatamente 1 registro válido
                expect(result.length).toBe(1)
                expect(result[0].id).toBe(expectedModel.id)
            })

            it('Should throw a custom error', async () => {
                // Silencia temporariamente o console.log para não sujar o terminal do Jest
                const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

                await expect(
                    repository.loadAllMaintenanceTruckByEnterpriseIdAndServerIdValidFromLocalDatabase(
                        undefined,
                        undefined
                    )
                ).rejects.toThrow(/Error loading maintenace trucks from local database./)

                // Restaura o console original
                consoleSpy.mockRestore()
            })
        })
    })

    describe('findMaintenanceTruckByIdInLocalDatabase', () => {
        it('Should successfully find a maintenance truck by ID from EQUIPMENTS table and return its entity', async () => {
            // 1. Arrange: Criar o registro na tabela EQUIPMENTS (conforme definido no seu método)
            const createdModel = await database.write(async () => {
                return await database.get<any>(TableName.EQUIPMENTS).create((item) => {
                    const raw = item._raw as any
                    raw.is_valid = true
                    raw.capacity = 6000
                    raw.operator_motorist = 'Carlos Comboio'
                    // Preencha outros campos brutos se o seu mapper exigir para não estourar nulo
                })
            })

            // 2. Act: Executar o método de busca por ID
            const result = await repository.findMaintenanceTruckByIdInLocalDatabase(createdModel.id)

            // 3. Assert: Verificar se retornou a instância correta da entidade de domínio
            expect(result).toBeDefined()
            expect(result).toBeInstanceOf(MaintenanceTruckEntity)
            expect(result.id).toBe(createdModel.id)
        })

        it('Should throw a custom error if the maintenance truck ID does not exist in EQUIPMENTS table', async () => {
            // Silencia temporariamente o console.log para não sujar o terminal do Jest
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

            const nonExistentId = 'missing-truck-id-999'

            // Act & Assert: Como o .find() do Watermelon falha se o ID não existir, ele deve cair no seu catch
            await expect(repository.findMaintenanceTruckByIdInLocalDatabase(nonExistentId)).rejects.toThrow(
                'Error find MaintenanceTruck in local database:'
            )

            // Restaura o console original
            consoleSpy.mockRestore()
        })
    })
})
