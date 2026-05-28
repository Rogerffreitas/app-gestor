import { WorkEquipmentEntity } from '@/src/domain/entity/work-equipment/WorkEquipmentEntity'
import { WorkEquipmentWatermelonDbRepository } from '../WorkEquipmentWatermelonDbRepository'
import { database } from './database-test'
import { WorkEquipmentDtoFactory } from '@/src/domain/utils/factories/WorkEquipmentDtoFactory'
import { TableName, UserAction } from '@/src/types'
import { EquipmentDtoFactory } from '@/src/domain/utils/factories/EquipmentDtoFactory'
import { EquipmentWatermelonDbResitory } from '../EquipmentWatermelonDbResitory'
import { EquipmentEntity } from '@/src/domain/entity/equipment/EquipmentEntity'
import EquipmentDto from '@/src/domain/entity/equipment/EquipmentDto'

describe('WorkEquipmentWatermelonDbRepository', () => {
    let repository: WorkEquipmentWatermelonDbRepository
    let eqRepository: EquipmentWatermelonDbResitory

    beforeEach(async () => {
        repository = new WorkEquipmentWatermelonDbRepository(database)
        eqRepository = new EquipmentWatermelonDbResitory(database)
        await database.write(async () => {
            await database.unsafeResetDatabase()
        })
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    // =========================================================================
    // 1. CREATE WORK EQUIPMENT
    // =========================================================================
    describe('createWorkEquipmentInLocalDatabase', () => {
        it('Should successfully persist a work equipment and return its entity', async () => {
            const eq = await eqRepository.createEquipmentInLocalDatabase(
                new EquipmentEntity().dtoToEntity(
                    EquipmentDtoFactory.create({ nameProprietary: 'Locadora Alfa' })
                )
            )
            const equipmentEntity = new WorkEquipmentEntity().dtoToEntity(
                WorkEquipmentDtoFactory.create({
                    equipment: new EquipmentDto().entityToDto(eq),
                })
            )

            const result = await repository.createWorkEquipmentInLocalDatabase(equipmentEntity)

            expect(result).toBeDefined()
            expect(result.id).toBeDefined()
            expect(result.nameProprietary).toBe('Locadora Alfa')

            const persisted = await database.get<any>(TableName.WORK_EQUIPMENTS).find(result.id)
            expect(persisted.userAction).toBe(UserAction.CREATE)
            expect(persisted.isValid).toBe(true)
        })

        it('Should throw a custom error if creating equipment in the local database fails', async () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

            // Passar undefined força um TypeError ao ler entity.equipment.id, caindo no catch
            await expect(repository.createWorkEquipmentInLocalDatabase(undefined as any)).rejects.toThrow(
                /Error create equipament in local database/
            )

            consoleSpy.mockRestore()
        })
    })

    // =========================================================================
    // 2. DELETE WORK EQUIPMENT (WITH INTEGRITY CHECKS)
    // =========================================================================
    describe('deleteWorkEquipmentInLocalDatabase', () => {
        const targetId = 'work-equip-id-999'

        it('Should successfully soft delete equipment if no tracking dependencies exist', async () => {
            const createdModel = await database.write(async () => {
                return await database.get<any>(TableName.WORK_EQUIPMENTS).create((item) => {
                    item._raw.id = targetId
                    item.isValid = true
                })
            })

            await repository.deleteWorkEquipmentInLocalDatabase(targetId, 'user-deleter')

            const persisted = await database.get<any>(TableName.WORK_EQUIPMENTS).find(createdModel.id)
            expect(persisted.isValid).toBe(false)
            expect(persisted.userAction).toBe(UserAction.DELETE)
        })

        it('Should block deletion if fuel supply dependencies exist', async () => {
            await database.write(async () => {
                // Injeta dependência na tabela de combustíveis vinculada ao equipamento
                await database.get<any>(TableName.FUEL_SUPPLYS).create((fuel) => {
                    fuel._raw.transport_vehicle_or_work_equipment_id = targetId
                })

                await database.get<any>(TableName.WORK_EQUIPMENTS).create((item) => {
                    item._raw.id = targetId
                    item.isValid = true
                })
            })

            await expect(
                repository.deleteWorkEquipmentInLocalDatabase(targetId, 'user-deleter')
            ).rejects.toThrow('Existem registros associados (Horimetro, combustível ou descontos).')
        })

        it('Should throw an error inside write try-catch block if internal database update fails', async () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

            // Passar um id inexistente faz o método find() falhar de forma nativa e cair no try-catch operacional
            await expect(
                repository.deleteWorkEquipmentInLocalDatabase('non-existent-id', 'user-id')
            ).rejects.toThrow('Error deleting Equipament in local database.')

            consoleSpy.mockRestore()
        })
    })

    // =========================================================================
    // 3. LOAD ALL BY ENTERPRISE AND WORK
    // =========================================================================
    describe('loadAllWorkEquipmentByEnterpriseIdFromLocalDatabase', () => {
        const targetEnterpriseId = 'ent-77'
        const targetWorkId = 'work-88'

        it('Should return active work equipments sorted by created_at DESC', async () => {
            // 1. Cria o equipamento pai para gerar um ID válido
            const eq = await eqRepository.createEquipmentInLocalDatabase(
                new EquipmentEntity().dtoToEntity(
                    EquipmentDtoFactory.create({ nameProprietary: 'Locadora Alfa' })
                )
            )
            const agora = Date.now()

            // 2. Cria o registro Antigo
            const oldModel = await database.write(async () => {
                return await database.get<any>(TableName.WORK_EQUIPMENTS).create((item) => {
                    // Define nas propriedades do modelo para o Mapper não se perder
                    item.equipmentId = eq.id

                    const raw = item._raw as any
                    raw.enterprise_id = targetEnterpriseId
                    raw.work_id = targetWorkId
                    raw.is_valid = true
                    raw.created_at = agora - 50000
                    raw.equipment_id = eq.id // Garante o ID na coluna física do banco
                })
            })

            // 3. Cria o registro Recente
            const recentModel = await database.write(async () => {
                return await database.get<any>(TableName.WORK_EQUIPMENTS).create((item) => {
                    // Define nas propriedades do modelo para o Mapper não se perder
                    item.equipmentId = eq.id

                    const raw = item._raw as any
                    raw.enterprise_id = targetEnterpriseId
                    raw.work_id = targetWorkId
                    raw.is_valid = true
                    raw.created_at = agora
                    raw.equipment_id = eq.id // Garante o ID na coluna física do banco
                })
            })

            // Act: Executa a listagem
            const result = await repository.loadAllWorkEquipmentByEnterpriseIdFromLocalDatabase(
                targetEnterpriseId,
                targetWorkId
            )

            // Assert
            expect(result.length).toBe(2)
            expect(result[0].id).toBe(recentModel.id) // O mais novo deve vir primeiro
            expect(result[1].id).toBe(oldModel.id)
        })

        it('Should throw custom error if query processing fails', async () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

            // Forçar erro passando argumentos nulos onde cláusulas de query falham na validação de string
            await expect(
                repository.loadAllWorkEquipmentByEnterpriseIdFromLocalDatabase(undefined as any, null as any)
            ).rejects.toThrow('Error loading work equipments from local database.')

            consoleSpy.mockRestore()
        })
    })

    // =========================================================================
    // 4. LOAD ALL VALID FROM SERVER IDENTIFIER
    // =========================================================================
    describe('loadAllWorkEquipmentByEnterpriseIdAndServerIdValidFromLocalDatabase', () => {
        const targetEnterpriseId = 'ent-99'
        const targetWorkId = 'work-99'

        it('Should return active records filtered matching filters correctly', async () => {
            const eq = await eqRepository.createEquipmentInLocalDatabase(
                new EquipmentEntity().dtoToEntity(
                    EquipmentDtoFactory.create({ nameProprietary: 'Locadora Alfa', enterpriseId: 'ent-99' })
                )
            )
            const expectedModel = await database.write(async () => {
                return await database.get<any>(TableName.WORK_EQUIPMENTS).create((item) => {
                    item.equipmentId = eq.id
                    const raw = item._raw as any
                    raw.enterprise_id = targetEnterpriseId
                    raw.work_id = targetWorkId
                    raw.is_valid = true
                    raw.created_at = Date.now()
                })
            })

            // Registro inativo (isValid = false) que deve ser desconsiderado pela listagem
            await database.write(async () => {
                await database.get<any>(TableName.WORK_EQUIPMENTS).create((item) => {
                    item.equipmentId = eq.id
                    const raw = item._raw as any
                    raw.enterprise_id = targetEnterpriseId
                    raw.work_id = targetWorkId
                    raw.is_valid = false
                    raw.created_at = Date.now()
                })
            })

            const result =
                await repository.loadAllWorkEquipmentByEnterpriseIdAndServerIdValidFromLocalDatabase(
                    targetEnterpriseId,
                    targetWorkId
                )

            expect(result.length).toBe(1)
            expect(result[0].id).toBe(expectedModel.id)
        })

        it('Should throw custom error if execution fails', async () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

            await expect(
                repository.loadAllWorkEquipmentByEnterpriseIdAndServerIdValidFromLocalDatabase(
                    undefined as any,
                    null as any
                )
            ).rejects.toThrow('Error loading work equipments from local database.')

            consoleSpy.mockRestore()
        })
    })
})
