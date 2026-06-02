import EquipmentModel from '@/src/database/model/EquipmentModel'
import { EquipmentWatermelonDbResitory } from '../EquipmentWatermelonDbResitory'
import { database } from './database-test'
import { EquipmentEntity } from '@/src/domain/entity/equipment/EquipmentEntity'
import { TableName, UserAction } from '@/src/types'
import { EquipmentDtoFactory } from '@/src/domain/utils/factories/EquipmentDtoFactory'
import { BankInformation } from '@/src/domain/entity/bank-information/BankInformation'
import Mappers from '../mappers'

describe('EquipmentWatermelonDbResitory', () => {
    const repository = new EquipmentWatermelonDbResitory(database)

    beforeEach(async () => {
        await database.write(async () => {
            await database.unsafeResetDatabase()
        })
    })

    describe('createEquipmentInLocalDatabase', () => {
        it('Should successfully create an equipment record, applying all defaults and casting numbers', async () => {
            // 1. Verificar a contagem de registros antes da criação
            const countBeforeCreate = (
                await database.get<EquipmentModel>(TableName.EQUIPMENTS).query().fetch()
            ).length

            // 2. Mockar uma entidade com dados completos para testar as conversões (+entity)
            const sampleEntity = new EquipmentEntity().dtoToEntity(
                EquipmentDtoFactory.create({
                    nameProprietary: 'Locações Silva',
                    cpfCnpjProprietary: '12.345.678/0001-99',
                    telProprietary: '11999999999',
                    startRental: '2026-05-25',
                    monthlyPayment: '5000' as any,
                    valuePerHourKm: '150' as any,
                    valuePerDay: '800' as any,
                    hourMeterOrOdometer: '1200' as any,
                    operatorMotorist: 'Carlos Santos',
                    isEquipment: true,
                    modelOrPlate: 'Caterpillar 320',
                    enterpriseId: 'enterprise-789',
                    userId: 'user-001',
                })
            )

            // 3. Executar o método de criação do repositório
            const result = await repository.createEquipmentInLocalDatabase(sampleEntity)

            // 4. Verificar a contagem após a criação
            const allModels = await database.get<EquipmentModel>(TableName.EQUIPMENTS).query().fetch()
            const countAfterCreate = allModels.length
            const persistedModel = allModels[0]

            // 5. Asserções no objeto de Retorno (Entidade mapeada)
            expect(result).toBeDefined()
            expect(result).toBeInstanceOf(EquipmentEntity)
            expect(result.nameProprietary).toBe('Locações Silva')
            expect(result.monthlyPayment).toBe(5000) // Valida que o '+' converteu para number

            // 6. Asserções de Estado do Banco de Dados
            expect(countBeforeCreate).toEqual(0)
            expect(countAfterCreate).toEqual(1)

            // Valida as propriedades fixas injetadas diretamente pelo método
            expect(persistedModel.isValid).toBe(true)
            expect(persistedModel.userAction).toBe(UserAction.CREATE)
            expect(persistedModel.serverId).toBe(0)
            expect(persistedModel.enterpriseId).toBe('enterprise-789')
        })

        it('Should throw a custom error if creating equipment in the local database fails', async () => {
            // Passar undefined força o bloco catch a capturar um TypeError na leitura das propriedades de 'entity'
            await expect(repository.createEquipmentInLocalDatabase(undefined as any)).rejects.toThrow(
                /Error create equipament in local database/
            )
        })
    })

    describe('updateEquipmentInLocalDatabase', () => {
        it('Should successfully find an equipment by ID, update its fields, and return the updated entity', async () => {
            const createdEntity = await repository.createEquipmentInLocalDatabase(
                new EquipmentEntity().dtoToEntity(
                    EquipmentDtoFactory.create({ enterpriseId: 'enterprise-abc' })
                )
            )

            const updateEntity = new EquipmentEntity().dtoToEntity(
                EquipmentDtoFactory.create({
                    id: createdEntity.id,
                    nameProprietary: 'Novo Proprietário S/A',
                    cpfCnpjProprietary: '00.000.000/0001-00',
                    telProprietary: '11988888888',
                    startRental: '2026-06-01',
                    monthlyPayment: '3500' as any,
                    valuePerHourKm: '200' as any,
                    valuePerDay: '1000' as any,
                    hourMeterOrOdometer: '5000' as any,
                    operatorMotorist: 'Novo Operador',
                    modelOrPlate: 'Nova Placa XYZ',
                    userId: 'user-updated-999',
                })
            )

            const result = await repository.updateEquipmentInLocalDatabase(updateEntity)

            const persistedModel = await database
                .get<EquipmentModel>(TableName.EQUIPMENTS)
                .find(createdEntity.id)

            expect(result).toBeDefined()
            expect(result).toBeInstanceOf(EquipmentEntity)
            expect(result.id).toBe(createdEntity.id)
            expect(result.nameProprietary).toBe('Novo Proprietário S/A')
            expect(result.monthlyPayment).toBe(3500)
            expect(persistedModel.nameProprietary).toBe('Novo Proprietário S/A')
            expect(persistedModel.modelOrPlate).toBe('Nova Placa XYZ')
            expect(persistedModel.monthlyPayment).toBe(3500)
            expect(persistedModel.userAction).toBe(UserAction.UPDATE)
            expect(persistedModel.userId).toBe('user-updated-999')
            expect(persistedModel.enterpriseId).toBe('enterprise-abc')
        })

        it('Should throw a custom error if trying to update a non-existent equipment ID', async () => {
            const fakeEntity = new EquipmentEntity().dtoToEntity(
                EquipmentDtoFactory.create({ id: 'non-existent-id' })
            )
            await expect(repository.updateEquipmentInLocalDatabase(fakeEntity)).rejects.toThrow(
                /Error update equipament in local database:/
            )
        })
    })

    describe('deleteEquipmentInLocalDatabase', () => {
        it('Should successfully perform a soft delete when there are no dependencies', async () => {
            // 1. Criar um equipamento real usando o repositório
            const createdEquipment = await repository.createEquipmentInLocalDatabase(
                new EquipmentEntity().dtoToEntity(EquipmentDtoFactory.create())
            )

            // 2. Executar o método de deleção
            const targetUserId = 'user-deleter-123'
            await repository.deleteEquipmentInLocalDatabase(createdEquipment.id, targetUserId)

            // 3. Buscar o registro diretamente do banco para validar as alterações do soft delete
            const persistedModel = await database
                .get<EquipmentModel>(TableName.EQUIPMENTS)
                .find(createdEquipment.id)

            // 4. Asserções do soft delete
            expect(persistedModel.isValid).toBe(false)
            expect(persistedModel.userAction).toBe(UserAction.DELETE)
            expect(persistedModel.userId).toBe(targetUserId)
        })

        it('Should throw an error and prevent deletion if there are linked dependencies', async () => {
            // 1. Criar o equipamento que tentaremos deletar
            const createdEquipment = await repository.createEquipmentInLocalDatabase(
                new EquipmentEntity().dtoToEntity(EquipmentDtoFactory.create())
            )

            // 2. Simular uma dependência inserindo um registro na tabela de combustíveis (FUEL_SUPPLYS)
            await database.write(async () => {
                await database.get(TableName.FUEL_SUPPLYS).create((record) => {
                    const raw = record._raw as any
                    // Vincula o ID do equipamento recém-criado na coluna correta mapeada na sua query
                    raw.transport_vehicle_or_equipment_id = createdEquipment.id
                })
            })

            // 3. Tentar deletar deve estourar a exceção esperada
            await expect(
                repository.deleteEquipmentInLocalDatabase(createdEquipment.id, 'user-any-id')
            ).rejects.toThrow('Existem registros associados (Horimetro, combustível ou descontos).')

            // 4. Garantir que o equipamento NÃO foi alterado no banco (continua válido)
            const persistedModel = await database
                .get<EquipmentModel>(TableName.EQUIPMENTS)
                .find(createdEquipment.id)

            expect(persistedModel.isValid).toBe(true)
            expect(persistedModel.userAction).not.toBe(UserAction.DELETE)
        })
    })

    describe('updateEquipmentBankInformation', () => {
        it('Should successfully update only the bank information of an existing equipment', async () => {
            // 1. Criar um equipamento real usando o repositório (com dados bancários iniciais/vazios)
            const createdEquipment = await repository.createEquipmentInLocalDatabase(
                new EquipmentEntity().dtoToEntity(
                    EquipmentDtoFactory.create({
                        nameProprietary: 'Proprietário Original',
                        modelOrPlate: 'Trator D6',
                    })
                )
            )

            // 2. Definir o payload com as novas informações bancárias
            const newBankInfo: BankInformation = {
                bank: 'Banco do Brasil',
                beneficiary: 'Locações de Equipamentos S/A',
                agency: '1234',
                account: '56789-0',
                pix: 'financeiro@locacoes.com',
            } as BankInformation

            // 3. Executar o método de atualização bancária
            const updatedEntity = await repository.updateEquipmentBankInformation(
                createdEquipment.id,
                newBankInfo
            )

            // 4. Buscar o registro diretamente do banco para garantir a persistência física no LokiJS
            const persistedModel = await database
                .get<EquipmentModel>(TableName.EQUIPMENTS)
                .find(createdEquipment.id)

            // 5. Asserções na Entidade retornada (Mapeamento de saída)
            expect(updatedEntity).toBeDefined()
            expect(updatedEntity).toBeInstanceOf(EquipmentEntity)
            expect(updatedEntity.id).toBe(createdEquipment.id)
            expect(updatedEntity.bank).toBe(newBankInfo.bank)
            expect(updatedEntity.beneficiary).toBe(newBankInfo.beneficiary)
            expect(updatedEntity.agency).toBe(newBankInfo.agency)
            expect(updatedEntity.account).toBe(newBankInfo.account)
            expect(updatedEntity.pix).toBe(newBankInfo.pix)

            // 6. Asserções direto no banco de dados para garantir que nada mais foi alterado
            expect(persistedModel.bank).toBe(newBankInfo.bank)
            expect(persistedModel.pix).toBe(newBankInfo.pix)

            // Garante que dados cruciais do equipamento continuam intactos
            expect(persistedModel.nameProprietary).toBe('Proprietário Original')
            expect(persistedModel.modelOrPlate).toBe('Trator D6')
        })

        it('Should throw a custom error if trying to update bank information of a non-existent equipment ID', async () => {
            const fakeBankInfo: BankInformation = {
                bank: 'Qualquer Banco',
                beneficiary: 'Qualquer Beneficiário',
                agency: '0000',
                account: '00000-0',
                pix: 'any@pix.com',
            } as BankInformation

            // Deve falhar no .find(id) interno e disparar a mensagem customizada do seu catch
            await expect(
                repository.updateEquipmentBankInformation('non-existent-equipment-id', fakeBankInfo)
            ).rejects.toThrow('An error occurred while updating bank information')
        })
    })

    describe('updateHourMeterOrOdometerInLocalDatabase', () => {
        it('Should successfully update only the hourMeterOrOdometer field, applying number cast and tracking audit data', async () => {
            // 1. Criar o equipamento original usando o repositório (com valor inicial de horímetro)
            const createdEquipment = await repository.createEquipmentInLocalDatabase(
                new EquipmentEntity().dtoToEntity(
                    EquipmentDtoFactory.create({
                        nameProprietary: 'Locadora Alfa',
                        hourMeterOrOdometer: '100' as any,
                        userId: 'user-operator-777',
                    })
                )
            )

            // 2. Criar a entidade com o novo valor de horímetro que queremos atualizar
            const updateEntity = new EquipmentEntity().dtoToEntity(
                EquipmentDtoFactory.create({
                    id: createdEquipment.id,
                    hourMeterOrOdometer: '250.5' as any,
                    userId: 'user-operator-777',
                })
            )

            // 3. Executar o método de atualização do horímetro
            const result = await repository.updateHourMeterOrOdometerInLocalDatabase(updateEntity)

            // 4. Buscar o registro atualizado direto do banco para garantir a persistência física no LokiJS
            const persistedModel = await database
                .get<EquipmentModel>(TableName.EQUIPMENTS)
                .find(createdEquipment.id)

            // 5. Asserções na Entidade retornada (Mapeamento de saída)
            expect(result).toBeDefined()
            expect(result).toBeInstanceOf(EquipmentEntity)
            expect(result.id).toBe(createdEquipment.id)
            expect(result.hourMeterOrOdometer).toBe(250.5) // Garante que o '+' converteu string float para number

            // 6. Asserções direto no banco de dados
            expect(persistedModel.hourMeterOrOdometer).toBe(250.5)
            expect(persistedModel.userAction).toBe(UserAction.UPDATE) // Injetado pelo método
            expect(persistedModel.userId).toBe('user-operator-777') // Injetado pelo método

            // Garante que dados cruciais que NÃO deveriam mudar continuam intocados
            expect(persistedModel.nameProprietary).toBe('Locadora Alfa')
        })

        it('Should throw a custom error if trying to update a non-existent equipment ID', async () => {
            const fakeEntity = new EquipmentEntity().dtoToEntity(
                EquipmentDtoFactory.create({
                    id: 'non-existent-id',
                })
            )

            // Deve estourar o erro mapeado no catch por não achar o ID no .find()
            await expect(repository.updateHourMeterOrOdometerInLocalDatabase(fakeEntity)).rejects.toThrow(
                /Error update equipament in local database:/
            )
        })
    })

    describe('findEquipmentByIdInLocalDatabase', () => {
        it('Should successfully find an equipment by ID and return its mapped entity', async () => {
            // 1. Arrange: Criar um equipamento real usando o repositório para gerar um ID válido
            const createdEquipment = await repository.createEquipmentInLocalDatabase(
                new EquipmentEntity().dtoToEntity(
                    EquipmentDtoFactory.create({
                        nameProprietary: 'Equipamento Alvo',
                        modelOrPlate: 'Retroescavadeira JCB',
                    })
                )
            )

            // 2. Act: Buscar o equipamento usando o ID gerado
            const result = await repository.findEquipmentByIdInLocalDatabase(createdEquipment.id)

            // 3. Assert: Validar se a entidade retornada está correta e com os dados originais
            expect(result).toBeDefined()
            expect(result).toBeInstanceOf(EquipmentEntity)
            expect(result.id).toBe(createdEquipment.id)
            expect(result.nameProprietary).toBe('Equipamento Alvo')
            expect(result.modelOrPlate).toBe('Retroescavadeira JCB')
        })

        it('Should throw a custom error if the equipment ID does not exist in the database', async () => {
            const nonExistentId = 'xyz-999-missing'

            // Como o .find() do WatermelonDB estoura erro se não achar o ID,
            // o código cai direto no seu catch, disparando a mensagem abaixo:
            await expect(repository.findEquipmentByIdInLocalDatabase(nonExistentId)).rejects.toThrow(
                /Error find equipament in local database:/
            )
        })
    })

    describe('loadAllEquipmentByEnterpriseIdFromLocalDatabase', () => {
        it('Should load only valid equipments that match the given enterpriseId', async () => {
            const targetEnterpriseId = 'enterprise-success-777'

            // 1. Registro Válido (Deve ser retornado)
            const eqValid = await database.write(async () => {
                const model = await database.get<EquipmentModel>(TableName.EQUIPMENTS).create((record) => {
                    const raw = record._raw as any
                    raw.enterprise_id = targetEnterpriseId
                    raw.is_valid = true
                    raw.name_proprietary = 'Equipamento Ativo da Empresa'
                })
                return new EquipmentEntity().modelToEntity(Mappers.equipmentMapper(model))
            })

            // 2. Registro de Outra Empresa (NÃO deve ser retornado)
            await database.write(async () => {
                await database.get<EquipmentModel>(TableName.EQUIPMENTS).create((record) => {
                    const raw = record._raw as any
                    raw.enterprise_id = 'other-enterprise-xyz'
                    raw.is_valid = true
                    raw.name_proprietary = 'Equipamento de Outra Empresa'
                })
            })

            // 3. Registro Inválido/Deletado da mesma empresa (NÃO deve ser retornado)
            await database.write(async () => {
                await database.get<EquipmentModel>(TableName.EQUIPMENTS).create((record) => {
                    const raw = record._raw as any
                    raw.enterprise_id = targetEnterpriseId
                    raw.is_valid = false // Soft deleted
                    raw.name_proprietary = 'Equipamento Excluído da Empresa'
                })
            })

            // 4. Act: Executar o método de listagem filtrada
            const result =
                await repository.loadAllEquipmentByEnterpriseIdFromLocalDatabase(targetEnterpriseId)

            // 5. Assert: Verificar os filtros aplicados pelo WatermelonDB
            expect(result).toBeDefined()
            expect(Array.isArray(result)).toBe(true)
            expect(result.length).toBe(1) // Apenas o primeiro registro atende a todos os critérios simultaneamente

            expect(result[0]).toBeInstanceOf(EquipmentEntity)
            expect(result[0].id).toBe(eqValid.id)
        })

        it('Should return an empty array if no equipments match the enterpriseId', async () => {
            // Act: Buscar por uma empresa aleatória em um banco limpo
            const result =
                await repository.loadAllEquipmentByEnterpriseIdFromLocalDatabase('empty-enterprise')

            // Assert
            expect(result).toEqual([])
        })

        it('Should throw a custom error if fetching from database fails', async () => {
            // Forçar um erro passando um parâmetro inválido que quebre a construção da query
            await expect(
                repository.loadAllEquipmentByEnterpriseIdFromLocalDatabase(undefined as any)
            ).rejects.toThrow('an error occurred while trying to load list')
        })
    })

    describe('loadAllEquipmentByEnterpriseIdAndServerIdValidFromLocalDatabase', () => {
        it('Should load only valid and synchronized (serverId > 0) equipments for the specific enterpriseId', async () => {
            const targetEnterpriseId = 'enterprise-sync-123'

            // 1. Registro VÁLIDO e SINCRONIZADO (Deve ser retornado)
            const eqValid = await database.write(async () => {
                const model = await database.get<EquipmentModel>(TableName.EQUIPMENTS).create((record) => {
                    const raw = record._raw as any
                    raw.enterprise_id = targetEnterpriseId
                    raw.is_valid = true
                    raw.server_id = 45 // Maior que 0
                    raw.name_proprietary = 'Equipamento Sincronizado'
                })
                return new EquipmentEntity().modelToEntity(Mappers.equipmentMapper(model))
            })

            // 2. Registro LOCAL PENDENTE (NÃO deve ser retornado pois server_id é 0)
            await database.write(async () => {
                await database.get<EquipmentModel>(TableName.EQUIPMENTS).create((record) => {
                    const raw = record._raw as any
                    raw.enterprise_id = targetEnterpriseId
                    raw.is_valid = true
                    raw.server_id = 0 // Pendente de envio para o servidor
                    raw.name_proprietary = 'Equipamento Local'
                })
            })

            // 3. Registro EXCLUÍDO NO APP (NÃO deve ser retornado pois is_valid é false)
            await database.write(async () => {
                await database.get<EquipmentModel>(TableName.EQUIPMENTS).create((record) => {
                    const raw = record._raw as any
                    raw.enterprise_id = targetEnterpriseId
                    raw.is_valid = false // Desativado/Soft deleted
                    raw.server_id = 12
                    raw.name_proprietary = 'Equipamento Deletado'
                })
            })

            // 4. Registro de OUTRA EMPRESA (NÃO deve ser retornado devido ao enterprise_id)
            await database.write(async () => {
                await database.get<EquipmentModel>(TableName.EQUIPMENTS).create((record) => {
                    const raw = record._raw as any
                    raw.enterprise_id = 'other-enterprise-id'
                    raw.is_valid = true
                    raw.server_id = 99
                    raw.name_proprietary = 'Equipamento de Terceiros'
                })
            })

            // Act: Chamar o método do repositório
            const result =
                await repository.loadAllEquipmentByEnterpriseIdAndServerIdValidFromLocalDatabase(
                    targetEnterpriseId
                )

            // Assert: Garantir que a query barrou os 3 cenários incorretos
            expect(result).toBeDefined()
            expect(Array.isArray(result)).toBe(true)
            expect(result.length).toBe(1) // Apenas o primeiro cumpre todas as condições

            expect(result[0]).toBeInstanceOf(EquipmentEntity)
            expect(result[0].id).toBe(eqValid.id)
        })

        it('Should return an empty array if no equipments are synchronized yet', async () => {
            const targetEnterpriseId = 'enterprise-empty-sync'

            // Insere apenas um registro local com server_id = 0
            await database.write(async () => {
                await database.get<EquipmentModel>(TableName.EQUIPMENTS).create((record) => {
                    const raw = record._raw as any
                    raw.enterprise_id = targetEnterpriseId
                    raw.is_valid = true
                    raw.server_id = 0
                })
            })

            const result =
                await repository.loadAllEquipmentByEnterpriseIdAndServerIdValidFromLocalDatabase(
                    targetEnterpriseId
                )

            expect(result).toEqual([])
        })

        it('Should throw a custom error if the query execution fails', async () => {
            // Passar undefined força a quebra interna no construtor da query do Watermelon
            await expect(
                repository.loadAllEquipmentByEnterpriseIdAndServerIdValidFromLocalDatabase(undefined as any)
            ).rejects.toThrow('an error occurred while trying to load list')
        })
    })
})
