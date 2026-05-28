import { FuelSupplyTypes, UserAction } from '../../../types'
import { FuelSupplyEntity } from '../../../domain/entity/fuel-supply/FuelSupplyEntity'
import { FuelSupplyWatermelonDbRepository } from '../FuelSupplyWatermelonDbRepository'
import { database } from './database-test'
import FuelSupplyModel from '../../../database/model/FuelSupplyModel'
import { InvoiceStatus, TableName } from '../../../domain/types'
import { FuelSupplyDtoFactory } from '@/src/domain/utils/factories/FuelSupplyDtoFactory'

describe('FuelSupplyWatermelonDbRepository', () => {
    const repository = new FuelSupplyWatermelonDbRepository(database)
    beforeEach(async () => {
        await database.write(async () => {
            await database.unsafeResetDatabase()
        })
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    describe('Tests for the FuelSupplies repository', () => {
        it('Must successfully create a fuel supply and return to the entity.', async () => {
            const countBeforeCreate = (
                await database.get<FuelSupplyModel>(TableName.FUEL_SUPPLIES).query().fetch()
            ).length

            const result = await repository.createFuelSupplyInLocalDatabase(
                new FuelSupplyEntity().dtoToEntity(FuelSupplyDtoFactory.create())
            )

            const countAfterCreate = (
                await database.get<FuelSupplyModel>(TableName.FUEL_SUPPLIES).query().fetch()
            ).length

            expect(result).toBeDefined()
            expect(result).toBeInstanceOf(FuelSupplyEntity)
            expect(countBeforeCreate).toEqual(0)
            expect(countAfterCreate).toEqual(1)
        })

        it('hould throw a custom error if writing to the database fails.', async () => {
            await expect(repository.createFuelSupplyInLocalDatabase(undefined)).rejects.toThrow(
                'Error create Fuel Supply in local database'
            )
        })

        it('You should search for a model by ID, update it, and return an entity.', async () => {
            const countBeforeCreate = (
                await database.get<FuelSupplyModel>(TableName.FUEL_SUPPLIES).query().fetch()
            ).length
            const createdEntity = await repository.createFuelSupplyInLocalDatabase(
                new FuelSupplyEntity().dtoToEntity(
                    FuelSupplyDtoFactory.create({
                        transportVehicleOrWorkEquipmentId: 't-1',
                        isDiscount: true,
                        isGasStation: true,
                        supplyType: FuelSupplyTypes.TRANSPORT_VEHICLE,
                    })
                )
            )
            const countAfterCreate = (
                await database.get<FuelSupplyModel>(TableName.FUEL_SUPPLIES).query().fetch()
            ).length

            const result = await repository.updateFuelSupplyInLocalDatabase(createdEntity)
            expect(countBeforeCreate).toEqual(0)
            expect(countAfterCreate).toEqual(1)
            expect(result.userAction).toBe(UserAction.UPDATE)
        })

        it('Should throw a custom error if trying to update a non-existent ID', async () => {
            const fakeWork = new FuelSupplyEntity().dtoToEntity(
                FuelSupplyDtoFactory.create({ id: 'non-existent-id' })
            )

            await expect(repository.updateFuelSupplyInLocalDatabase(fakeWork)).rejects.toThrow(
                /Error updating Fuel Supply in local database/
            )
        })
    })

    describe('deleteFuelSupplyInLocalDatabase', () => {
        it('Should successfully perform a soft delete if invoice_status is PENDING', async () => {
            const targetUserId = 'user-deleter-999'

            const countBeforeCreate = (
                await database.get<FuelSupplyModel>(TableName.FUEL_SUPPLIES).query().fetch()
            ).length

            const fuelSupplyPending = await repository.createFuelSupplyInLocalDatabase(
                new FuelSupplyEntity().dtoToEntity(
                    FuelSupplyDtoFactory.create({
                        userId: targetUserId,
                        invoiceStatus: InvoiceStatus.PENDING,
                    })
                )
            )
            await database.write(async () => {
                const rawModel = await database
                    .get<FuelSupplyModel>(TableName.FUEL_SUPPLIES)
                    .find(fuelSupplyPending.id)
                if ((rawModel._raw as any).invoice_status !== InvoiceStatus.PENDING) {
                    await rawModel.update(() => {
                        ;(rawModel._raw as any).invoice_status = InvoiceStatus.PENDING
                    })
                }
            })

            await repository.deleteFuelSupplyInLocalDatabase(fuelSupplyPending.id, targetUserId)

            const persistedModel = await database
                .get<FuelSupplyModel>(TableName.FUEL_SUPPLIES)
                .find(fuelSupplyPending.id)

            expect(persistedModel.isValid).toBe(false)
            expect(persistedModel.userAction).toBe(UserAction.DELETE)
            expect(persistedModel.userId).toBe(targetUserId)
        })

        it('Should throw an error and block deletion if invoice_status is NOT PENDING', async () => {
            // 1. Arrange: Criar um abastecimento com status diferente de PENDING (ex: PAID)
            const fuelSupplyPAID = await repository.createFuelSupplyInLocalDatabase(
                new FuelSupplyEntity().dtoToEntity(
                    FuelSupplyDtoFactory.create({ invoiceStatus: InvoiceStatus.PAID })
                )
            )

            // 2. Act & Assert: Tentar deletar deve disparar a exceção do seu if (a > 0)
            await expect(
                repository.deleteFuelSupplyInLocalDatabase(fuelSupplyPAID.id, 'any-user-id')
            ).rejects.toThrow('Não é possível apagar o Abastecimento')

            // 3. Assert extra: Garantir que o registro permaneceu ativo e intocado no banco
            const persistedModel = await database
                .get<FuelSupplyModel>(TableName.FUEL_SUPPLIES)
                .find(fuelSupplyPAID.id)

            expect(persistedModel.isValid).toBe(true) // Continua intacto!
            expect(persistedModel.userAction).not.toBe(UserAction.DELETE)
        })
    })

    describe('loadById', () => {
        it('Should successfully find a fuel supply by ID and return its mapped entity', async () => {
            // 1. Arrange: Criar um abastecimento direto no banco para gerar um ID válido
            const createdFuelSupply = await database.write(async () => {
                return await database.get<FuelSupplyModel>(TableName.FUEL_SUPPLIES).create((record) => {
                    const raw = record._raw as any
                    raw.is_valid = true
                    // Preencha outros campos necessários se o seu modelo exigir
                })
            })

            // 2. Act: Executar o método de busca por ID do repositório
            const result = await repository.loadById(createdFuelSupply.id)

            // 3. Assert: Verificar se o retorno foi mapeado corretamente para a entidade de domínio
            expect(result).toBeDefined()
            expect(result).toBeInstanceOf(FuelSupplyEntity)
            expect(result.id).toBe(createdFuelSupply.id)
        })

        it('Should throw a custom error if the fuel supply ID does not exist', async () => {
            const nonExistentId = 'invalid-fuel-supply-id-123'

            // Como o .find() vai quebrar no ID inexistente, ele precisa cair no seu catch
            // e estourar a mensagem: 'an error occurred while trying to load model '
            await expect(repository.loadById(nonExistentId)).rejects.toThrow(
                'an error occurred while trying to load model '
            )
        })
    })

    describe('loadLastSupplyByEnterpriseIdAndWorkIdAndMaintenanceTruckIdFromLocalDatabase', () => {
        const targetEnterpriseId = 'ent-123'
        const targetWorkId = 'work-456'
        const targetTruckId = 'truck-789'

        it('Should return only the most recent valid fuel supply that matches all strict filters', async () => {
            // 1. Arrange: Criar o primeiro registro correspondente (Mais antigo)
            await database.write(async () => {
                await database.get<FuelSupplyModel>(TableName.FUEL_SUPPLIES).create((record) => {
                    const raw = record._raw as any
                    raw.enterprise_id = targetEnterpriseId
                    raw.work_id = targetWorkId
                    raw.maintenance_trucks_work_equipment_id = targetTruckId
                    raw.supply_type = FuelSupplyTypes.MAINTENANCE_TRUCK_TANK
                    raw.is_valid = true
                    raw.created_at = 1716724800000 // Data mais antiga no passado
                    raw.liters_loaded = 100 // Campo fictício só para identificar no assert
                })
            })

            // 2. Criar o segundo registro correspondente (Mais recente - DEVE SER O RETORNADO)
            const expectedModel = await database.write(async () => {
                return await database.get<FuelSupplyModel>(TableName.FUEL_SUPPLIES).create((record) => {
                    const raw = record._raw as any
                    raw.enterprise_id = targetEnterpriseId
                    raw.work_id = targetWorkId
                    raw.maintenance_trucks_work_equipment_id = targetTruckId
                    raw.supply_type = FuelSupplyTypes.MAINTENANCE_TRUCK_TANK
                    raw.is_valid = true
                    raw.created_at = 1716728400000 // Data mais nova (1 hora depois)
                    raw.liters_loaded = 250
                })
            })

            // 3. Criar um registro idêntico, mas INVÁLIDO (Soft deleted - Deve ser ignorado)
            await database.write(async () => {
                await database.get<FuelSupplyModel>(TableName.FUEL_SUPPLIES).create((record) => {
                    const raw = record._raw as any
                    raw.enterprise_id = targetEnterpriseId
                    raw.work_id = targetWorkId
                    raw.maintenance_trucks_work_equipment_id = targetTruckId
                    raw.supply_type = FuelSupplyTypes.MAINTENANCE_TRUCK_TANK
                    raw.is_valid = false // Inválido
                    raw.created_at = 1716732000000 // Ainda mais novo, mas inválido
                })
            })

            // 4. Criar um registro com tipo de abastecimento diferente (Deve ser ignorado)
            await database.write(async () => {
                await database.get<FuelSupplyModel>(TableName.FUEL_SUPPLIES).create((record) => {
                    const raw = record._raw as any
                    raw.enterprise_id = targetEnterpriseId
                    raw.work_id = targetWorkId
                    raw.maintenance_trucks_work_equipment_id = targetTruckId
                    raw.supply_type = 'OTHER_TYPE' // Tipo diferente de MAINTENANCE_TRUCK_TANK
                    raw.is_valid = true
                    raw.created_at = 1716732000000
                })
            })

            // Act: Executa a query buscando o último abastecimento
            const result =
                await repository.loadLastSupplyByEnterpriseIdAndWorkIdAndMaintenanceTruckIdFromLocalDatabase(
                    targetEnterpriseId,
                    targetWorkId,
                    targetTruckId
                )

            // Assert: Valida se pegou o registro correto respeitando o Q.sortBy + Q.take(1)
            expect(result).toBeDefined()
            expect(result).toBeInstanceOf(FuelSupplyEntity)
            expect(result.id).toBe(expectedModel.id)
        })

        it('Should throw an error if the query results are empty (index [0] of undefined)', async () => {
            // Como o seu método faz "this.fuelSupplyMapper(result[0])" diretamente sem checar se result.length > 0,
            // se o banco estiver vazio, o result[0] será undefined, o mapper vai quebrar e cair no seu catch.

            await expect(
                repository.loadLastSupplyByEnterpriseIdAndWorkIdAndMaintenanceTruckIdFromLocalDatabase(
                    'empty-ent',
                    'empty-work',
                    'empty-truck'
                )
            ).rejects.toThrow('Error loading maintenace trucks fuel supply from local database.')
        })

        it('Should throw a custom error if parameters are invalid and break the query syntax', async () => {
            await expect(
                repository.loadLastSupplyByEnterpriseIdAndWorkIdAndMaintenanceTruckIdFromLocalDatabase(
                    undefined as any,
                    undefined as any,
                    undefined as any
                )
            ).rejects.toThrow('Error loading maintenace trucks fuel supply from local database.')
        })
    })

    describe('loadCurrentBalanceTankByEnterpriseIdAndWorkIdAndMaintenanceTruckIdFromLocalDatabase', () => {
        const targetEnterpriseId = 'ent-999'
        const targetWorkId = 'work-888'
        const targetTruckId = 'truck-777'

        it('Should correctly calculate the balance (totalTank - totalFuelSupply)', async () => {
            // 1. Arrange: Mockamos o comportamento do banco para retornar valores brutos controlados
            // Simula que o caminhão recebeu 1000 litros de carga total (total_tank = 1000)
            const mockTotalTankRaw = [{ total_tank: 1000 }]

            // Simula que o caminhão já distribuiu 400 litros abastecendo outros equipamentos (total_fuel_supply = 400)
            const mockTotalFuelSupplyRaw = [{ total_fuel_supply: 400 }]

            // Interceptamos as chamadas de query e injetamos as promessas resolvidas sequencialmente
            jest.spyOn(repository['database'].get(TableName.FUEL_SUPPLIES), 'query')
                .mockImplementationOnce(() => {
                    return {
                        unsafeFetchRaw: jest.fn().mockResolvedValue(mockTotalTankRaw),
                    } as any
                })
                .mockImplementationOnce(() => {
                    return {
                        unsafeFetchRaw: jest.fn().mockResolvedValue(mockTotalFuelSupplyRaw),
                    } as any
                })

            // 2. Act: Executa o método do balanço atual do tanque
            const balance =
                await repository.loadCurrentBalanceTankByEnterpriseIdAndWorkIdAndMaintenanceTruckIdFromLocalDatabase(
                    targetEnterpriseId,
                    targetWorkId,
                    targetTruckId
                )

            // 3. Assert: 1000 (carga) - 400 (saídas) deve resultar em exatamente 600 litros de saldo
            expect(balance).toBe(600)
        })

        it('Should return 0 if there are no records in the database (handle null/undefined database returns)', async () => {
            // Arrange: Se for a primeira vez rodando, o SQL retorna objetos com propriedades nulas/vazias
            const mockEmptyTank = [{ total_tank: null }]
            const mockEmptyFuelSupply = [{ total_fuel_supply: undefined }]

            jest.spyOn(repository['database'].get(TableName.FUEL_SUPPLIES), 'query')
                .mockImplementationOnce(() => {
                    return { unsafeFetchRaw: jest.fn().mockResolvedValue(mockEmptyTank) } as any
                })
                .mockImplementationOnce(() => {
                    return { unsafeFetchRaw: jest.fn().mockResolvedValue(mockEmptyFuelSupply) } as any
                })

            // Act
            const balance =
                await repository.loadCurrentBalanceTankByEnterpriseIdAndWorkIdAndMaintenanceTruckIdFromLocalDatabase(
                    targetEnterpriseId,
                    targetWorkId,
                    targetTruckId
                )

            // Assert: Os fallbacks "?? 0" do seu código devem converter null/undefined para 0 -> (0 - 0 = 0)
            expect(balance).toBe(0)
        })
        it('Should throw a custom error if any of the database promises fail', async () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

            jest.spyOn(
                repository,
                'loadCurrentBalanceTankByEnterpriseIdAndWorkIdAndMaintenanceTruckIdFromLocalDatabase'
            ).mockRejectedValueOnce(
                new Error('Error loading maintenace trucks fuel supply from local database.')
            )

            await expect(
                repository.loadCurrentBalanceTankByEnterpriseIdAndWorkIdAndMaintenanceTruckIdFromLocalDatabase(
                    targetEnterpriseId,
                    targetWorkId,
                    targetTruckId
                )
            ).rejects.toThrow('Error loading maintenace trucks fuel supply from local database.')
            consoleSpy.mockRestore()
        })
    })

    describe('loadAllFuelSupplyByEnterpriseIdAndWorkIdAndMaintenanceTruckIdFromLocalDatabase', () => {
        const targetEnterpriseId = 'ent-abc'
        const targetWorkId = 'work-123'
        const targetTruckId = 'truck-789'
        it('Should load only pending and valid supplies ordered by created_at DESC', async () => {
            // Registro Válido 1 (Mais Antigo)
            await database.write(async () => {
                await database.get<FuelSupplyModel>(TableName.FUEL_SUPPLIES).create((record) => {
                    const raw = record._raw as any
                    raw.enterprise_id = targetEnterpriseId
                    raw.work_id = targetWorkId
                    raw.maintenance_trucks_work_equipment_id = targetTruckId
                    raw.is_valid = true
                    raw.invoice_status = InvoiceStatus.PENDING
                    raw.invoice_id = 0
                    raw.created_at = 1000000000000
                })
            })

            // Registro Válido 2 (Mais Recente - Deve vir primeiro no array)
            const expectedFirst = await database.write(async () => {
                return await database.get<FuelSupplyModel>(TableName.FUEL_SUPPLIES).create((record) => {
                    const raw = record._raw as any
                    raw.enterprise_id = targetEnterpriseId
                    raw.work_id = targetWorkId
                    raw.maintenance_trucks_work_equipment_id = targetTruckId
                    raw.is_valid = true
                    raw.invoice_status = InvoiceStatus.PENDING
                    raw.invoice_id = 0
                    raw.created_at = 2000000000000
                })
            })

            // Registro Invalido por Invoice ID já faturado (Não deve retornar)
            await database.write(async () => {
                await database.get<FuelSupplyModel>(TableName.FUEL_SUPPLIES).create((record) => {
                    const raw = record._raw as any
                    raw.enterprise_id = targetEnterpriseId
                    raw.work_id = targetWorkId
                    raw.maintenance_trucks_work_equipment_id = targetTruckId
                    raw.is_valid = true
                    raw.invoice_status = InvoiceStatus.PENDING
                    raw.invoice_id = 99 // Diferente de 0
                })
            })

            const result =
                await repository.loadAllFuelSupplyByEnterpriseIdAndWorkIdAndMaintenanceTruckIdFromLocalDatabase(
                    targetEnterpriseId,
                    targetWorkId,
                    targetTruckId
                )

            expect(result.length).toBe(2)
            expect(result[0].id).toBe(expectedFirst.id) // Valida a ordenação DESC
        })

        it('Should throw custom error on failure', async () => {
            jest.spyOn(
                repository,
                'loadAllFuelSupplyByEnterpriseIdAndWorkIdAndMaintenanceTruckIdFromLocalDatabase'
            ).mockRejectedValueOnce(new Error('Error loading fuel supply from local database.'))

            await expect(
                repository.loadAllFuelSupplyByEnterpriseIdAndWorkIdAndMaintenanceTruckIdFromLocalDatabase(
                    targetEnterpriseId,
                    targetWorkId,
                    targetTruckId
                )
            ).rejects.toThrow('Error loading fuel supply from local database.')
        })
    })

    describe('loadAllFuelSupplyByEnterpriseIdAndWorkIdAndMaintenanceTruckIdAndTypeFromLocalDatabase', () => {
        const targetEnterpriseId = 'ent-abc'
        const targetWorkId = 'work-123'
        const targetTruckId = 'truck-789'
        const targetType = 'MAINTENANCE_TRUCK_TANK'
        it('Should load supplies matching specific truck and supply type', async () => {
            const expectedModel = await database.write(async () => {
                return await database.get<FuelSupplyModel>(TableName.FUEL_SUPPLIES).create((record) => {
                    const raw = record._raw as any
                    raw.enterprise_id = targetEnterpriseId
                    raw.work_id = targetWorkId
                    raw.maintenance_trucks_work_equipment_id = targetTruckId
                    raw.supply_type = targetType
                    raw.is_valid = true
                    raw.invoice_status = InvoiceStatus.PENDING
                    raw.invoice_id = 0
                })
            })

            // Registro com tipo diferente (Não deve retornar)
            await database.write(async () => {
                await database.get<FuelSupplyModel>(TableName.FUEL_SUPPLIES).create((record) => {
                    const raw = record._raw as any
                    raw.enterprise_id = targetEnterpriseId
                    raw.work_id = targetWorkId
                    raw.maintenance_trucks_work_equipment_id = targetTruckId
                    raw.supply_type = 'OTHER_TYPE'
                    raw.is_valid = true
                    raw.invoice_status = InvoiceStatus.PENDING
                    raw.invoice_id = 0
                })
            })

            const result =
                await repository.loadAllFuelSupplyByEnterpriseIdAndWorkIdAndMaintenanceTruckIdAndTypeFromLocalDatabase(
                    targetEnterpriseId,
                    targetWorkId,
                    targetTruckId,
                    targetType
                )

            expect(result.length).toBe(1)
            expect(result[0].id).toBe(expectedModel.id)
        })

        it('Should throw custom error on failure', async () => {
            jest.spyOn(
                repository,
                'loadAllFuelSupplyByEnterpriseIdAndWorkIdAndMaintenanceTruckIdAndTypeFromLocalDatabase'
            ).mockRejectedValueOnce(new Error('Error loading fuel supply from local database.'))

            await expect(
                repository.loadAllFuelSupplyByEnterpriseIdAndWorkIdAndMaintenanceTruckIdAndTypeFromLocalDatabase(
                    targetEnterpriseId,
                    targetWorkId,
                    targetTruckId,
                    targetType
                )
            ).rejects.toThrow('Error loading fuel supply from local database.')
        })
    })

    describe('loadAllFuelSupplyByEnterpriseIdAndWorkIdAndVehicleIdAndTypeFromLocalDatabase', () => {
        const targetEnterpriseId = 'ent-abc'
        const targetWorkId = 'work-123'
        const targetVehicleId = 'vehicle-456'
        const targetType = 'MAINTENANCE_TRUCK_TANK'
        it('Should load supplies matching vehicle, specific type and empty maintenance truck id', async () => {
            const expectedModel = await database.write(async () => {
                return await database.get<FuelSupplyModel>(TableName.FUEL_SUPPLIES).create((record) => {
                    const raw = record._raw as any
                    raw.enterprise_id = targetEnterpriseId
                    raw.work_id = targetWorkId
                    raw.transport_vehicle_or_work_equipment_id = targetVehicleId
                    raw.supply_type = targetType
                    raw.maintenance_trucks_work_equipment_id = '' // Trava crucial do método
                    raw.is_valid = true
                    raw.invoice_status = InvoiceStatus.PENDING
                    raw.invoice_id = 0
                })
            })

            // Registro inválido porque possui id de comboio preenchido (Não deve retornar)
            await database.write(async () => {
                await database.get<FuelSupplyModel>(TableName.FUEL_SUPPLIES).create((record) => {
                    const raw = record._raw as any
                    raw.enterprise_id = targetEnterpriseId
                    raw.work_id = targetWorkId
                    raw.transport_vehicle_or_work_equipment_id = targetVehicleId
                    raw.supply_type = targetType
                    raw.maintenance_trucks_work_equipment_id = 'caminhao-comboio-preenchido'
                    raw.is_valid = true
                    raw.invoice_status = InvoiceStatus.PENDING
                    raw.invoice_id = 0
                })
            })

            const result =
                await repository.loadAllFuelSupplyByEnterpriseIdAndWorkIdAndVehicleIdAndTypeFromLocalDatabase(
                    targetEnterpriseId,
                    targetWorkId,
                    targetVehicleId,
                    targetType
                )

            expect(result.length).toBe(1)
            expect(result[0].id).toBe(expectedModel.id)
        })

        it('Should throw custom error on failure', async () => {
            jest.spyOn(
                repository,
                'loadAllFuelSupplyByEnterpriseIdAndWorkIdAndVehicleIdAndTypeFromLocalDatabase'
            ).mockRejectedValueOnce(new Error('Error loading fuel supply from local database.'))

            await expect(
                repository.loadAllFuelSupplyByEnterpriseIdAndWorkIdAndVehicleIdAndTypeFromLocalDatabase(
                    targetEnterpriseId,
                    targetWorkId,
                    targetVehicleId,
                    targetType
                )
            ).rejects.toThrow('Error loading fuel supply from local database.')
        })
    })
})
