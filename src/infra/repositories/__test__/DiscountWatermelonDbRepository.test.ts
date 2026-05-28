import { DiscountTypes, InvoiceStatus, TableName, UserAction } from '../../../types'
import DiscountModel from '../../../database/model/DiscountModel'
import { DiscountWatermelonDbRepository } from '../DiscountWatermelonDbRepository'
import DiscountEntity from '@gestor/domain/entity/discount/DiscountEntity'
import { DiscountDtoFactory } from '@/src/domain/utils/factories/DiscountDtoFactory'
import { database } from './database-test'

describe('DiscountWatermelonDbRepository', () => {
    const repository = new DiscountWatermelonDbRepository(database)

    beforeEach(async () => {
        await database.write(async () => {
            await database.unsafeResetDatabase()
        })
    })

    describe('Tests for the Deposit repository', () => {
        it('Must successfully create a model and return to the entity.', async () => {
            const countBeforeCreate = (await database.get<DiscountModel>(TableName.DISCOUNTS).query().fetch())
                .length

            const result = await repository.createDiscountInLocalDatabase(
                new DiscountEntity().dtoToEntity(DiscountDtoFactory.create())
            )

            const countAfterCreate = (await database.get<DiscountModel>(TableName.DISCOUNTS).query().fetch())
                .length

            expect(result).toBeDefined()
            expect(result).toBeInstanceOf(DiscountEntity)
            expect(countBeforeCreate).toEqual(0)
            expect(countAfterCreate).toEqual(1)
        })

        it('hould throw a custom error if writing to the database fails.', async () => {
            await expect(repository.createDiscountInLocalDatabase(undefined)).rejects.toThrow(
                /Error create Discount in local database/
            )
        })

        it('You should search for a model by ID, update it, and return an entity.', async () => {
            const countBeforeCreate = (await database.get<DiscountModel>(TableName.DISCOUNTS).query().fetch())
                .length
            const createdEntity = await repository.createDiscountInLocalDatabase(
                new DiscountEntity().dtoToEntity(DiscountDtoFactory.create())
            )
            const countAfterCreate = (await database.get<DiscountModel>(TableName.DISCOUNTS).query().fetch())
                .length

            const result = await repository.updateDiscountInLocalDatabase(createdEntity)
            expect(countBeforeCreate).toEqual(0)
            expect(countAfterCreate).toEqual(1)
            expect(result.userAction).toBe(UserAction.UPDATE)
        })

        it('Should throw a custom error if trying to update a non-existent ID', async () => {
            const fakeWork = new DiscountEntity().dtoToEntity(
                DiscountDtoFactory.create({ id: 'non-existent-id' })
            )

            await expect(repository.updateDiscountInLocalDatabase(fakeWork)).rejects.toThrow(
                /Error updating Discount in local database/
            )
        })

        it('Should look for a list.', async () => {
            const result = await repository.loadAllDiscountByEnterpriseIdAndWorkIdFromLocalDatabase(
                'e1',
                'w1',
                DiscountTypes.TRANSPORT_VEHICLE,
                't1'
            )
            expect(result).toBeDefined()
        })
    })

    describe('deleteDiscountInLocalDatabase', () => {
        const targetDiscountId = 'discount-123'
        const targetUserId = 'user-deleter-77'

        it('Should successfully soft delete the discount if its invoice status is PENDING', async () => {
            // 1. Arrange: Cria um desconto com o status PENDING (permitido para exclusão)
            const createdModel = await database.write(async () => {
                return await database.get<any>(TableName.DISCOUNTS).create((item) => {
                    item._raw.id = targetDiscountId
                    item.isValid = true

                    // Mapeia tanto a propriedade do modelo quanto a coluna física por segurança
                    item.invoiceStatus = InvoiceStatus.PENDING
                    const raw = item._raw as any
                    raw.invoice_status = InvoiceStatus.PENDING
                })
            })

            // 2. Act: Executa a deleção
            await repository.deleteDiscountInLocalDatabase(createdModel.id, targetUserId)

            // 3. Assert: Busca o registro atualizado no banco e valida o soft delete
            const persisted = await database.get<any>(TableName.DISCOUNTS).find(createdModel.id)

            expect(persisted.isValid).toBe(false)
            expect(persisted.userId).toBe(targetUserId)
            expect(persisted.userAction).toBe(UserAction.DELETE)
        })

        it('Should block deletion and throw an error if the invoice status is NOT PENDING', async () => {
            // 1. Arrange: Cria um desconto com um status diferente de PENDING (ex: PAID ou qualquer string diferente)
            const nonPendingStatus = 'PAID' // Ajuste para outro valor do seu enum InvoiceStatus se necessário

            await database.write(async () => {
                await database.get<any>(TableName.DISCOUNTS).create((item) => {
                    item._raw.id = targetDiscountId
                    item.isValid = true

                    item.invoiceStatus = nonPendingStatus
                    const raw = item._raw as any
                    raw.invoice_status = nonPendingStatus
                })
            })

            // 2. Act & Assert: Tenta apagar o desconto e espera que o erro de regra de negócio seja lançado
            await expect(
                repository.deleteDiscountInLocalDatabase(targetDiscountId, targetUserId)
            ).rejects.toThrow('Não é possível apagar o Desconto')
        })

        it('Should throw a native database error if the discount ID does not exist at all', async () => {
            // 1. Arrange: Usar um ID inexistente.
            // A primeira query (.fetchCount()) vai retornar 0 (pois o ID não existe, logo nenhum registro ativo/pago será achado).
            // Em seguida, o código tentará rodar o .find(id) dentro do .write() e falhará nativamente.
            const nonExistentId = 'ghost-discount-404'

            // 2. Act & Assert: Como o seu método não captura o erro com try/catch, ele deve propagar o erro nativo do WatermelonDB
            await expect(
                repository.deleteDiscountInLocalDatabase(nonExistentId, targetUserId)
            ).rejects.toThrow()
        })
    })

    describe('findDiscountByIdInLocalDatabase', () => {
        it('Should successfully find a discount by ID and return its mapped entity', async () => {
            // 1. Arrange: Cria o desconto diretamente no banco de dados em memória
            const createdModel = await database.write(async () => {
                return await database.get<any>(TableName.DISCOUNTS).create((item) => {
                    const raw = item._raw as any
                    raw.is_valid = true
                    // Adicione outros campos obrigatórios do seu modelo de desconto aqui, se houver
                })
            })

            // 2. Act: Executa o método de busca do repositório
            const result = await repository.findDiscountByIdInLocalDatabase(createdModel.id)

            // 3. Assert: Garante que a entidade foi retornada e preenchida com o ID correto
            expect(result).toBeDefined()
            expect(result).not.toBeNull()
            expect(result.id).toBe(createdModel.id)
        })

        it('Should log the error and throw a custom exception if the discount ID does not exist', async () => {
            // 1. Arrange: Silencia o console.log para não sujar o terminal do Jest
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

            const nonExistentId = 'missing-discount-999'

            // 2. Act & Assert: Tenta buscar o ID inexistente e valida se o catch relançou o erro customizado
            await expect(repository.findDiscountByIdInLocalDatabase(nonExistentId)).rejects.toThrow(
                /Error loading Discount from local database\./
            )

            // Valida se o console.log interno do seu catch foi de fato acionado
            expect(consoleSpy).toHaveBeenCalled()

            // Restaura o console original
            consoleSpy.mockRestore()
        })
    })
})
