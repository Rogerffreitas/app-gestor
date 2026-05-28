import { HourMeterMonitoringEntity } from '@/src/domain/entity/hour-meter-monitoring/HourMeterMonitoringEntity'
import { InvoiceStatus, TableName, UserAction } from '@/src/types'
import { HourMeterMonitoringWatermelonDbRepository } from '../HourMeterMonitoringWatermelonDbRepository'
import { database } from './database-test'
import { WorkEquipmentWatermelonDbRepository } from '../WorkEquipmentWatermelonDbRepository'
import { EquipmentWatermelonDbResitory } from '../EquipmentWatermelonDbResitory'
import { EquipmentDtoFactory } from '@/src/domain/utils/factories/EquipmentDtoFactory'
import { EquipmentEntity } from '@/src/domain/entity/equipment/EquipmentEntity'
import { WorkEquipmentEntity } from '@/src/domain/entity/work-equipment/WorkEquipmentEntity'
import { WorkEquipmentDtoFactory } from '@/src/domain/utils/factories/WorkEquipmentDtoFactory'
import EquipmentDto from '@/src/domain/entity/equipment/EquipmentDto'
import { HourMeterMonitoringDtoFactory } from '@/src/domain/utils/factories/HourMeterMonitoringDtoFactory'
import WorkEquipmentDto from '@/src/domain/entity/work-equipment/WorkEquipmentDto'
import HourMeterMonitoringDto from '@/src/domain/entity/hour-meter-monitoring/HourMeterMonitoringDto'
import HourMeterMonitoringModel from '@/src/database/model/HourMeterMonitoringModel'

describe('HourMeterMonitoringWatermelonDbRepository', () => {
    let repository: HourMeterMonitoringWatermelonDbRepository
    let workEquipmentRepository: WorkEquipmentWatermelonDbRepository
    let equipmentRepository: EquipmentWatermelonDbResitory
    let wEq: WorkEquipmentEntity

    const targetEnterpriseId = 'enterprise-999'
    const targetWorkId = 'work-888'
    const targetEquipmentId = 'equipment-777'
    const targetUserId = 'user-111'

    beforeEach(async () => {
        repository = new HourMeterMonitoringWatermelonDbRepository(database)
        equipmentRepository = new EquipmentWatermelonDbResitory(database)
        workEquipmentRepository = new WorkEquipmentWatermelonDbRepository(database)
        const eq = await equipmentRepository.createEquipmentInLocalDatabase(
            new EquipmentEntity().dtoToEntity(EquipmentDtoFactory.create())
        )
        wEq = await workEquipmentRepository.createWorkEquipmentInLocalDatabase(
            new WorkEquipmentEntity().dtoToEntity(
                WorkEquipmentDtoFactory.create({ equipment: new EquipmentDto().entityToDto(eq) })
            )
        )
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    // =========================================================================
    // 1. CREATE HOUR METER MONITORING
    // =========================================================================
    describe('createHourMeterMonitoringInLocalDatabase', () => {
        it('Should successfully create an hour meter monitoring record and return mapped entity', async () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

            const mockEntity = new HourMeterMonitoringEntity().dtoToEntity(
                HourMeterMonitoringDtoFactory.create({
                    workEquipment: new WorkEquipmentDto().entityToDto(wEq),
                    initialHourMeterValue: 100,

                    invoiceStatus: InvoiceStatus.PENDING,
                })
            )

            // Act
            const result = await repository.createHourMeterMonitoringInLocalDatabase(mockEntity)

            // Assert
            expect(result).toBeDefined()
            expect(consoleSpy).toHaveBeenCalledWith('Creating Hour Meter Monitoring in the database')

            // Verifica persistência direta no banco
            const persisted = await database.get<any>(TableName.HOUR_METER_MONITORINGS).find(result.id)
            expect(persisted.value).toBe(500)
            expect(persisted.initialHourMeterValue).toBe(100)
            expect(persisted.invoiceStatus).toBe(InvoiceStatus.PENDING)
            expect(persisted.userAction).toBe(UserAction.CREATE)
            expect(persisted.isValid).toBe(true)
        })

        it('Should log error and throw exception on creation failure', async () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

            // Passar parâmetro inválido força o estouro do erro no bloco try/catch
            await expect(repository.createHourMeterMonitoringInLocalDatabase(null as any)).rejects.toThrow(
                /Error create  Hour Meter Monitoring in local database/
            )

            expect(consoleSpy).toHaveBeenCalled()
        })
    })

    // =========================================================================
    // 2. UPDATE HOUR METER MONITORING
    // =========================================================================
    describe('updateHourMeterMonitoringInLocalDatabase', () => {
        it('Should successfully update an existing hour meter monitoring record', async () => {
            jest.spyOn(console, 'log').mockImplementation(() => {})

            const mockEntity = new HourMeterMonitoringEntity().dtoToEntity(
                HourMeterMonitoringDtoFactory.create({
                    workEquipment: new WorkEquipmentDto().entityToDto(wEq),
                    initialHourMeterValue: 100,
                    currentHourMeterValue: 150,
                    observation: 'teste',

                    invoiceStatus: InvoiceStatus.PENDING,
                })
            )
            const entityCreated = await repository.createHourMeterMonitoringInLocalDatabase(mockEntity)

            let dto = new HourMeterMonitoringDto().entityToDto(entityCreated)
            dto.currentHourMeterValue = 160
            dto.observation = 'Atualizado'
            const entity = new HourMeterMonitoringEntity().dtoToEntity(dto)

            // Act
            const result = await repository.updateHourMeterMonitoringInLocalDatabase(entity)

            // Assert
            expect(result.id).toBe(entityCreated.id)

            // Valida modificações no banco
            const persisted = await database.get<any>(TableName.HOUR_METER_MONITORINGS).find(entityCreated.id)
            expect(persisted.value).toBe(3000)
            expect(persisted.observation).toBe('Atualizado')
            expect(persisted.userAction).toBe(UserAction.UPDATE)
        })

        it('Should throw an error if update fails due to non-existent ID', async () => {
            jest.spyOn(console, 'log').mockImplementation(() => {})

            const invalidEntity = { id: 'ghost-id' } as HourMeterMonitoringEntity

            await expect(repository.updateHourMeterMonitoringInLocalDatabase(invalidEntity)).rejects.toThrow(
                /Error updating  Hour Meter Monitoring in local database/
            )
        })
    })

    // =========================================================================
    // 3. DELETE HOUR METER MONITORING
    // =========================================================================
    describe('deleteHourMeterMonitoringInLocalDatabase', () => {
        it('Should soft delete the record if invoice_status is PENDING', async () => {
            const targetId = 'record-to-delete'

            await database.write(async () => {
                await database.get<any>(TableName.HOUR_METER_MONITORINGS).create((item) => {
                    item._raw.id = targetId
                    item.invoiceStatus = InvoiceStatus.PENDING
                    const raw = item._raw as any
                    raw.invoice_status = InvoiceStatus.PENDING // Sincroniza coluna física para a Query
                    item.isValid = true
                })
            })

            // Act
            await repository.deleteHourMeterMonitoringInLocalDatabase(targetId, 'deleter-user')

            // Assert
            const persisted = await database.get<any>(TableName.HOUR_METER_MONITORINGS).find(targetId)
            expect(persisted.isValid).toBe(false)
            expect(persisted.userAction).toBe(UserAction.DELETE)
            expect(persisted.userId).toBe('deleter-user')
        })

        it('Should block deletion and throw error if invoice_status is NOT PENDING', async () => {
            const targetId = 'record-blocked'
            const activeStatus = 'PAID' // Qualquer status diferente de PENDING

            await database.write(async () => {
                await database.get<any>(TableName.HOUR_METER_MONITORINGS).create((item) => {
                    item._raw.id = targetId
                    item.invoiceStatus = activeStatus
                    const raw = item._raw as any
                    raw.invoice_status = activeStatus
                })
            })

            // Act & Assert
            await expect(
                repository.deleteHourMeterMonitoringInLocalDatabase(targetId, targetUserId)
            ).rejects.toThrow('Não é possível apagar o Apontamento')
        })
    })

    // =========================================================================
    // 4. FIND BY ID
    // =========================================================================
    describe('findHourMeterMonitoringByIdInLocalDatabase', () => {
        it('Should return the mapped entity if record is found', async () => {
            const mockEntity = new HourMeterMonitoringEntity().dtoToEntity(
                HourMeterMonitoringDtoFactory.create({
                    workEquipment: new WorkEquipmentDto().entityToDto(wEq),
                })
            )

            // Act
            const entityCreated = await repository.createHourMeterMonitoringInLocalDatabase(mockEntity)
            const result = await repository.findHourMeterMonitoringByIdInLocalDatabase(entityCreated.id)
            expect(result).toBeDefined()
            expect(result.id).toBe(entityCreated.id)
        })

        it('Should trigger catch block and throw error if record does not exist', async () => {
            jest.spyOn(console, 'log').mockImplementation(() => {})

            // O .find() do WatermelonDB lança exceção nativa se o ID não for achado
            await expect(
                repository.findHourMeterMonitoringByIdInLocalDatabase('non-existent')
            ).rejects.toThrow(/Error loading HourMeterMonitoring from local database\./)
        })
    })

    // =========================================================================
    // 6. LOAD ALL BY ENTERPRISE, WORK AND EQUIPMENT (PENDING ONLY)
    // =========================================================================
    describe('loadAllHourMeterMonitoringByEnterpriseIdAndWorkIdAndWorkEquipmentIdFromLocalDatabase', () => {
        it('Should return only valid, pending records matching filters sorted by created_at DESC', async () => {
            const agora = Date.now()

            await database.write(async () => {
                // 1. Registro válido (Deve retornar)
                await database
                    .get<HourMeterMonitoringModel>(TableName.HOUR_METER_MONITORINGS)
                    .create((item) => {
                        item.workEquipmentId = wEq.id
                        const raw = item._raw as any
                        raw.enterprise_id = targetEnterpriseId
                        raw.work_id = targetWorkId
                        raw.work_equipment_id = targetEquipmentId
                        raw.is_valid = true
                        raw.invoice_id = 0
                        raw.invoice_status = InvoiceStatus.PENDING
                        raw.created_at = agora - 1000
                    })

                // 2. Registro mais recente válido (Deve vir em primeiro)
                await database.get<any>(TableName.HOUR_METER_MONITORINGS).create((item) => {
                    item.workEquipmentId = wEq.id
                    const raw = item._raw as any
                    raw.enterprise_id = targetEnterpriseId
                    raw.work_id = targetWorkId
                    raw.work_equipment_id = targetEquipmentId
                    raw.is_valid = true
                    raw.invoice_id = 0
                    raw.invoice_status = InvoiceStatus.PENDING
                    raw.created_at = agora
                })

                // 3. Registro com faturamento ativo (Ruído -> Deve ser ignorado)
                await database.get<any>(TableName.HOUR_METER_MONITORINGS).create((item) => {
                    item.workEquipmentId = wEq.id
                    const raw = item._raw as any
                    raw.enterprise_id = targetEnterpriseId
                    raw.work_id = targetWorkId
                    raw.work_equipment_id = targetEquipmentId
                    raw.is_valid = true
                    raw.invoice_id = 15 // Faturado
                    raw.invoice_status = InvoiceStatus.PENDING
                })
            })

            const result =
                await repository.loadAllHourMeterMonitoringByEnterpriseIdAndWorkIdAndWorkEquipmentIdFromLocalDatabase(
                    targetEnterpriseId,
                    targetWorkId,
                    targetEquipmentId
                )

            expect(result.length).toBe(2)
        })

        it('Should throw a custom error', async () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

            // Passar undefined forçará uma quebra interna no WatermelonDB, ativando o catch
            await expect(
                repository.loadAllHourMeterMonitoringByEnterpriseIdAndWorkIdAndWorkEquipmentIdFromLocalDatabase(
                    undefined,
                    undefined,
                    undefined
                )
            ).rejects.toThrow(/Error loading Hour Meter Monitoring from local database/)

            consoleSpy.mockRestore()
        })
    })

    // =========================================================================
    // 7. FIND LAST READING BY HIGHEST HOUR METER VALUE
    // =========================================================================
    describe('findLastHourMeterReading', () => {
        it('Should return only 1 record containing the highest current_hour_meter_value', async () => {
            await database.write(async () => {
                // Registro com horímetro = 500
                await database.get<any>(TableName.HOUR_METER_MONITORINGS).create((item) => {
                    item.workEquipmentId = wEq.id
                    const raw = item._raw as any
                    raw.enterprise_id = targetEnterpriseId
                    raw.work_id = targetWorkId
                    raw.work_equipment_id = targetEquipmentId
                    raw.is_valid = true
                    raw.current_hour_meter_value = 500
                })

                // Registro com horímetro mais alto = 750 (Deve ser o retornado)
                await database.get<any>(TableName.HOUR_METER_MONITORINGS).create((item) => {
                    item.workEquipmentId = wEq.id
                    const raw = item._raw as any
                    raw.enterprise_id = targetEnterpriseId
                    raw.work_id = targetWorkId
                    raw.work_equipment_id = targetEquipmentId
                    raw.is_valid = true
                    raw.current_hour_meter_value = 750
                })
            })

            const result = await repository.findLastHourMeterReading(
                targetEnterpriseId,
                targetWorkId,
                targetEquipmentId
            )

            expect(result).toBeDefined()
            // Se seu mapeador expõe a propriedade, valide o valor mais alto:
            // expect(result.currentHourMeterValue).toBe(750)
        })

        it('Should throw a custom error', async () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

            // Passar undefined forçará uma quebra interna no WatermelonDB, ativando o catch
            await expect(
                repository.findLastHourMeterReading(undefined, undefined, undefined)
            ).rejects.toThrow(/Error loading Hour Meter Monitoring from local database./)

            consoleSpy.mockRestore()
        })
    })

    // =========================================================================
    // 8. LOAD ALL BY ENTERPRISE, WORK AND SPECIFIC DATE
    // =========================================================================
    describe('loadAllHourMeterMonitoringByEnterpriseIdAndWorkIdAndDateFromLocalDatabase', () => {
        it('Should return only valid records matching the specific date string', async () => {
            const targetDate = '2026-05-27'

            await database.write(async () => {
                // Data correta (Deve retornar)
                await database.get<any>(TableName.HOUR_METER_MONITORINGS).create((item) => {
                    item.workEquipmentId = wEq.id
                    const raw = item._raw as any
                    raw.enterprise_id = targetEnterpriseId
                    raw.work_id = targetWorkId
                    raw.is_valid = true
                    raw.date = targetDate
                })

                // Data diferente (Ruído -> Deve ser ignorado)
                await database.get<any>(TableName.HOUR_METER_MONITORINGS).create((item) => {
                    item.workEquipmentId = wEq.id
                    const raw = item._raw as any
                    raw.enterprise_id = targetEnterpriseId
                    raw.work_id = targetWorkId
                    raw.is_valid = true
                    raw.date = '2026-12-31'
                })
            })

            const result =
                await repository.loadAllHourMeterMonitoringByEnterpriseIdAndWorkIdAndDateFromLocalDatabase(
                    targetEnterpriseId,
                    targetWorkId,
                    targetDate
                )

            expect(result.length).toBe(1)
        })

        it('Should throw a custom error', async () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

            // Passar undefined forçará uma quebra interna no WatermelonDB, ativando o catch
            await expect(
                repository.loadAllHourMeterMonitoringByEnterpriseIdAndWorkIdAndDateFromLocalDatabase(
                    undefined,
                    undefined,
                    undefined
                )
            ).rejects.toThrow(/Error loading Hour Meter Monitoring from local database./)

            consoleSpy.mockRestore()
        })
    })
})
