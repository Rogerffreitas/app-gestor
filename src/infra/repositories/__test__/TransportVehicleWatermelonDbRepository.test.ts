import TransportVehicleModel from '@/src/database/model/TransportVehicleModel'
import { TableName, UserAction } from '../../../types'
import { TransportVehicleWatermelonDbRepository } from '../TransportVehicleWatermelonDbRepository'
import { database } from './database-test'
import { Q } from '@nozbe/watermelondb'
import { TransportVehicleEntity } from '@/src/domain/entity/transport-vehicle/TransportVehicleEntity'
import { TransportVehicleDtoFactory } from '@/src/domain/utils/factories/TransportVehicleDtoFactory'
import Mappers from '../mappers'
import { BankInformation } from '@/src/domain/entity/bank-information/BankInformation'
import TransportVehicleDto from '@/src/domain/entity/transport-vehicle/TransportVehicleDto'

describe('TransportVehicleWatermelonDbRepository', () => {
    const repository = new TransportVehicleWatermelonDbRepository(database)

    beforeEach(async () => {
        await database.write(async () => {
            await database.unsafeResetDatabase()
        })
    })

    describe('Tests for the Transport Vehicle repository', () => {
        it('Must successfully create a model and return to the entity.', async () => {
            const countBeforeCreate = (
                await database.get<TransportVehicleModel>(TableName.TRANSPORT_VEHICLES).query().fetch()
            ).length

            const result = await repository.createTransportVehicleInLocalDatabase(
                new TransportVehicleEntity().dtoToEntity(
                    TransportVehicleDtoFactory.create({
                        capacity: 1500,
                    })
                )
            )

            const countAfterCreate = (
                await database.get<TransportVehicleModel>(TableName.TRANSPORT_VEHICLES).query().fetch()
            ).length

            expect(result).toBeDefined()
            expect(result).toBeInstanceOf(TransportVehicleEntity)
            expect(result.capacity).toBe(1500)
            expect(countBeforeCreate).toEqual(0)
            expect(countAfterCreate).toEqual(1)
        })

        it('Should throw a custom error if writing to the database fails.', async () => {
            await expect(repository.createTransportVehicleInLocalDatabase(undefined)).rejects.toThrow(
                /Error create TransportVehicle in local database/
            )
        })

        it('Should search for a model by ID, update it, and return an entity.', async () => {
            const countBeforeCreate = (
                await database.get<TransportVehicleModel>(TableName.TRANSPORT_VEHICLES).query().fetch()
            ).length
            const createdEntity = await repository.createTransportVehicleInLocalDatabase(
                new TransportVehicleEntity().dtoToEntity(TransportVehicleDtoFactory.create())
            )
            const countAfterCreate = (
                await database.get<TransportVehicleModel>(TableName.TRANSPORT_VEHICLES).query().fetch()
            ).length

            const result = await repository.updateTransportVehicleInLocalDatabase(createdEntity)
            expect(countBeforeCreate).toEqual(0)
            expect(countAfterCreate).toEqual(1)
            expect(result.userAction).toBe(UserAction.UPDATE)
        })

        it('Should create and then delete a record.', async () => {
            const createdEntity = await repository.createTransportVehicleInLocalDatabase(
                new TransportVehicleEntity().dtoToEntity(TransportVehicleDtoFactory.create())
            )
            const countAfterCreate = (
                await database.get<TransportVehicleModel>(TableName.TRANSPORT_VEHICLES).query().fetch()
            ).length

            await repository.deleteTransportVehicleInLocalDatabase(createdEntity.id, createdEntity.userId)

            const countAfterDelete = (
                await database
                    .get<TransportVehicleModel>(TableName.TRANSPORT_VEHICLES)
                    .query(Q.where('is_valid', true))
                    .fetch()
            ).length

            const deletedEntity = await repository.findTransportVehicleByIdInLocalDatabase(createdEntity.id)

            expect(countAfterCreate).toEqual(1)
            expect(countAfterDelete).toEqual(0)
            expect(deletedEntity.userAction).toBe(UserAction.DELETE)
            expect(deletedEntity.isValid).toBe(false)
        })

        it('Should throw an error and prevent deletion if there are linked dependencies (counts > 0)', async () => {
            const createdVehicle = await repository.createTransportVehicleInLocalDatabase(
                new TransportVehicleEntity().dtoToEntity(
                    TransportVehicleDtoFactory.create({ capacity: 1500 })
                )
            )

            await database.write(async () => {
                await database.get(TableName.MATERIAL_TRANSPORTS).create((record) => {
                    const raw = record._raw as any
                    raw.transport_vehicle_id = createdVehicle.id
                    // Adicione outras propriedades obrigatórias do modelo de transporte de material se houver
                })
            })

            await expect(
                repository.deleteTransportVehicleInLocalDatabase(createdVehicle.id, 'user-blocking-123')
            ).rejects.toThrow('Existem registros associados (Transportes, combustível ou descontos).')

            const persistedModel = await database
                .get<TransportVehicleModel>(TableName.TRANSPORT_VEHICLES)
                .find(createdVehicle.id)

            expect(persistedModel.isValid).toBe(true)
            expect(persistedModel.userAction).not.toBe(UserAction.DELETE)
        })

        it('Should return an empty array if no vehicles match the filters', async () => {
            const result = await repository.loadAllTransportVehicleByEnterpriseIdAndWorkIdFromLocalDatabase(
                'non-existent-enterprise',
                'non-existent-work'
            )

            expect(result).toEqual([])
        })

        it('Should throw a custom error if loading from database fails', async () => {
            // Força o método a falhar passando parâmetros inválidos/nulos que quebrem a query do Watermelon
            // Caso o banco trate nulos de boa, você pode mockar o database.get para disparar um throw

            await expect(
                repository.loadAllTransportVehicleByEnterpriseIdAndWorkIdFromLocalDatabase(
                    undefined as any,
                    undefined as any
                )
            ).rejects.toThrow(/Error loading vehicles from local database/)
        })

        it('Should successfully load valid vehicles filtered by enterpriseId and workId ordered by created_at DESC', async () => {
            const targetEnterpriseId = 'enterprise-123'
            const targetWorkId = 'work-999'

            const vehicle1 = await database.write(async () => {
                const model = await database
                    .get<TransportVehicleModel>(TableName.TRANSPORT_VEHICLES)
                    .create((record) => {
                        const raw = record._raw as any

                        raw.enterprise_id = targetEnterpriseId
                        raw.work_id = targetWorkId
                        raw.is_valid = true
                        raw.capacity = 1500
                        // Forçando o campo readonly via _raw
                        raw.created_at = new Date('2026-01-01T10:00:00.000Z').getTime()
                    })
                return new TransportVehicleEntity().modelToEntity(Mappers.transportVehicleMapper(model))
            })

            // Registro 2: Mais recente
            const vehicle2 = await database.write(async () => {
                const model = await database
                    .get<TransportVehicleModel>(TableName.TRANSPORT_VEHICLES)
                    .create((record) => {
                        const raw = record._raw as any

                        raw.enterprise_id = targetEnterpriseId
                        raw.work_id = targetWorkId
                        raw.is_valid = true
                        raw.capacity = 2000
                        raw.created_at = new Date('2026-01-02T10:00:00.000Z').getTime() // Mais novo
                    })
                return new TransportVehicleEntity().modelToEntity(Mappers.transportVehicleMapper(model))
            })

            // 2. Executar o método de busca do repositório
            const result = await repository.loadAllTransportVehicleByEnterpriseIdAndWorkIdFromLocalDatabase(
                targetEnterpriseId,
                targetWorkId
            )

            // 3. Asserções
            expect(result).toBeDefined()
            expect(result.length).toBe(2)

            // Valida se mapeou para a Entidade do seu Domínio
            expect(result[0]).toBeInstanceOf(TransportVehicleEntity)

            // Valida a ordenação do Q.sortBy('created_at', Q.desc)
            expect(result[0].id).toBe(vehicle2.id) // O de data 02/01 vem primeiro
            expect(result[1].id).toBe(vehicle1.id) // O de data 01/01 vem depois
        })
    })

    it('Should successfully load vehicles filtered by enterpriseId, workId, isValid=true, and serverId > 0 ordered by created_at DESC', async () => {
        const targetEnterpriseId = 'enterprise-123'
        const targetWorkId = 'work-999'

        // 1. Registro VÁLIDO com serverId > 0 (Mais antigo)
        const vehicle1 = await database.write(async () => {
            const model = await database
                .get<TransportVehicleModel>(TableName.TRANSPORT_VEHICLES)
                .create((record) => {
                    const raw = record._raw as any
                    raw.enterprise_id = targetEnterpriseId
                    raw.work_id = targetWorkId
                    raw.is_valid = true
                    raw.server_id = 10 // Maior que 0 (Válido)
                    raw.created_at = new Date('2026-01-01T10:00:00.000Z').getTime()
                })
            return new TransportVehicleEntity().modelToEntity(Mappers.transportVehicleMapper(model))
        })

        // 2. Registro VÁLIDO com serverId > 0 (Mais recente - deve vir primeiro)
        const vehicle2 = await database.write(async () => {
            const model = await database
                .get<TransportVehicleModel>(TableName.TRANSPORT_VEHICLES)
                .create((record) => {
                    const raw = record._raw as any
                    raw.enterprise_id = targetEnterpriseId
                    raw.work_id = targetWorkId
                    raw.is_valid = true
                    raw.server_id = 25 // Maior que 0 (Válido)
                    raw.created_at = new Date('2026-01-02T10:00:00.000Z').getTime()
                })
            return new TransportVehicleEntity().modelToEntity(Mappers.transportVehicleMapper(model))
        })

        // 3. Registro INVÁLIDO: server_id igual a 0 (NÃO deve retornar)
        await database.write(async () => {
            await database.get<TransportVehicleModel>(TableName.TRANSPORT_VEHICLES).create((record) => {
                const raw = record._raw as any
                raw.enterprise_id = targetEnterpriseId
                raw.work_id = targetWorkId
                raw.is_valid = true
                raw.server_id = 0 // Igual a 0 (Invalida a query Q.gt(0))
                raw.created_at = new Date('2026-01-03T10:00:00.000Z').getTime()
            })
        })

        // 4. Registro INVÁLIDO: server_id nulo/negativo (NÃO deve retornar)
        await database.write(async () => {
            await database.get<TransportVehicleModel>(TableName.TRANSPORT_VEHICLES).create((record) => {
                const raw = record._raw as any
                raw.enterprise_id = targetEnterpriseId
                raw.work_id = targetWorkId
                raw.is_valid = true
                raw.server_id = -5 // Menor que 0
                raw.created_at = new Date('2026-01-04T10:00:00.000Z').getTime()
            })
        })

        // Executar o método do repositório
        const result =
            await repository.loadAllTransportVehicleByEnterpriseIdAndServerIdValidFromLocalDatabase(
                targetEnterpriseId,
                targetWorkId
            )

        // Asserções
        expect(result).toBeDefined()
        expect(result.length).toBe(2) // Apenas os dois primeiros devem passar nos filtros

        // Garante o mapeamento da Entidade
        expect(result[0]).toBeInstanceOf(TransportVehicleEntity)

        // Garante a ordenação decrescente (Q.desc) por data de criação
        expect(result[0].id).toBe(vehicle2.id) // O do dia 02/01 vem primeiro
        expect(result[1].id).toBe(vehicle1.id) // O do dia 01/01 vem depois
    })

    it('Should return an empty array if no vehicles match the server_id > 0 criteria', async () => {
        const targetEnterpriseId = 'enterprise-abc'
        const targetWorkId = 'work-xyz'

        // Criando apenas registros com server_id = 0
        await database.write(async () => {
            await database.get<TransportVehicleModel>(TableName.TRANSPORT_VEHICLES).create((record) => {
                const raw = record._raw as any
                raw.enterprise_id = targetEnterpriseId
                raw.work_id = targetWorkId
                raw.is_valid = true
                raw.server_id = 0
            })
        })

        const result =
            await repository.loadAllTransportVehicleByEnterpriseIdAndServerIdValidFromLocalDatabase(
                targetEnterpriseId,
                targetWorkId
            )

        expect(result).toEqual([])
    })

    it('Should successfully update only the bank information of an existing transport vehicle', async () => {
        const createdEntity = await repository.createTransportVehicleInLocalDatabase(
            new TransportVehicleEntity().dtoToEntity(TransportVehicleDtoFactory.create({ plate: 'ABC-1234' }))
        )

        const dto = new TransportVehicleDto().entityToDto(createdEntity)

        ;((dto.bank = 'Nubank'),
            (dto.beneficiary = 'John Doe'),
            (dto.agency = '0001'),
            (dto.account = '12345-6'),
            (dto.pix = 'john.doe@pix.com'))

        const entity = new TransportVehicleEntity().dtoToEntity(dto)
        const newBankInfo: BankInformation = {
            bank: 'Nubank',
            beneficiary: 'John Doe',
            agency: '0001',
            account: '12345-6',
            pix: 'john.doe@pix.com',
        } as BankInformation

        const updatedEntity = await repository.updateEquipmentBankInformation(entity.id, newBankInfo)

        const persistedModel = await database
            .get<TransportVehicleModel>(TableName.TRANSPORT_VEHICLES)
            .find(entity.id)

        // 5. Asserções na Entidade retornada pelo método
        expect(updatedEntity).toBeDefined()
        expect(updatedEntity).toBeInstanceOf(TransportVehicleEntity)
        expect(updatedEntity.id).toBe(entity.id) // O ID precisa ser o mesmo
        expect(updatedEntity.bank).toBe(newBankInfo.bank)
        expect(updatedEntity.beneficiary).toBe(newBankInfo.beneficiary)
        expect(updatedEntity.agency).toBe(newBankInfo.agency)
        expect(updatedEntity.account).toBe(newBankInfo.account)
        expect(updatedEntity.pix).toBe(newBankInfo.pix)

        // Garantir que dados que NÃO deviam mudar continuam intactos
        expect(persistedModel.plate).toBe('ABC-1234')

        // 6. Asserções direto no Banco de Dados (Garantia de persistência)
        expect(persistedModel.bank).toBe(newBankInfo.bank)
        expect(persistedModel.beneficiary).toBe(newBankInfo.beneficiary)
        expect(persistedModel.agency).toBe(newBankInfo.agency)
        expect(persistedModel.account).toBe(newBankInfo.account)
        expect(persistedModel.pix).toBe(newBankInfo.pix)
    })

    it('Should throw a custom error if the vehicle ID does not exist', async () => {
        const fakeBankInfo: BankInformation = {
            bank: 'Any Bank',
            beneficiary: 'Any Person',
            agency: '1111',
            account: '2222-2',
            pix: 'any@pix.com',
        } as BankInformation

        // Tenta atualizar um ID inexistente, esperando que estoure o erro customizado do seu catch
        await expect(
            repository.updateEquipmentBankInformation('non-existent-id', fakeBankInfo)
        ).rejects.toThrow(/An error occurred while updating bank information/)
    })

    it('Should throw a custom error if query processing fails', async () => {
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

        // Passar undefined forçará uma quebra interna no WatermelonDB, ativando o catch
        await expect(
            repository.loadAllTransportVehicleByEnterpriseIdAndServerIdValidFromLocalDatabase(
                undefined as any,
                undefined as any
            )
        ).rejects.toThrow(/Error loading vehicles from local database./)

        consoleSpy.mockRestore()
    })

    describe('updateTransportVehicleBankInformation', () => {
        const mockBankInformation = {
            bank: 'Banco do Brasil',
            beneficiary: 'João Silva',
            agency: '1234',
            account: '56789-0',
            pix: '123.456.789-00',
        } as BankInformation

        it('Should successfully update the bank information of an existing transport vehicle', async () => {
            // 1. Arrange: Cria um veículo no banco sem informações bancárias
            const createdModel = await database.write(async () => {
                return await database.get<any>(TableName.TRANSPORT_VEHICLES).create((item) => {
                    const raw = item._raw as any
                    raw.plate = 'ABC-1234'
                    // Campos bancários nascem vazios
                    item.bank = ''
                    item.beneficiary = ''
                })
            })

            // 2. Act: Executa o método de atualização
            const result = await repository.updateTransportVehicleBankInformation(
                createdModel.id,
                mockBankInformation
            )

            // 3. Assert: Valida se a entidade retornou com os dados mapeados
            expect(result).toBeDefined()
            expect(result.id).toBe(createdModel.id)

            // 4. Extra Assert: Busca diretamente no banco de dados para garantir que a escrita (write) funcionou
            const persistedModel = await database.get<any>(TableName.TRANSPORT_VEHICLES).find(createdModel.id)

            expect(persistedModel.bank).toBe(mockBankInformation.bank)
            expect(persistedModel.beneficiary).toBe(mockBankInformation.beneficiary)
            expect(persistedModel.agency).toBe(mockBankInformation.agency)
            expect(persistedModel.account).toBe(mockBankInformation.account)
            expect(persistedModel.pix).toBe(mockBankInformation.pix)
        })

        it('Should throw a custom error if the transport vehicle ID does not exist', async () => {
            // Silencia o console.log para não sujar o log de testes do Jest
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

            const nonExistentId = 'ghost-vehicle-id-404'

            // Act & Assert: O WatermelonDB falhará no .find() dentro da transação .write(), ativando o catch
            await expect(
                repository.updateTransportVehicleBankInformation(nonExistentId, mockBankInformation)
            ).rejects.toThrow(/An error occurred while updating bank information/)

            consoleSpy.mockRestore()
        })
    })

    it('Should throw a custom error if trying to update a non-existent ID', async () => {
        const entity = new TransportVehicleEntity().dtoToEntity(
            TransportVehicleDtoFactory.create({ id: 'non-existent-id' })
        )

        await expect(repository.updateTransportVehicleInLocalDatabase(entity)).rejects.toThrow(
            /An error occurred while updating transport vehicle/
        )
    })

    it('Should throw a custom error if trying to find a non-existent ID', async () => {
        await expect(repository.findTransportVehicleByIdInLocalDatabase('non-existent-id')).rejects.toThrow(
            /an error occurred while trying to load model/
        )
    })
})
