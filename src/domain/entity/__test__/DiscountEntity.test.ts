import DiscountEntity from '../discount/DiscountEntity'
import { DiscountDtoFactory } from './factories/DiscountDtoFactory'

describe('DiscountEntity', () => {
    const mockDto = DiscountDtoFactory.create()

    describe('dtoToEntity', () => {
        it('deve criar uma entidade corretamente a partir de um DTO válido', () => {
            const entity = new DiscountEntity().dtoToEntity(mockDto)

            expect(entity.description).toBe(mockDto.description)
            expect(entity.value).toBe(mockDto.value)
            expect(entity.discountType).toBe(mockDto.discountType)
            expect(entity.invoiceStatus).toBe(mockDto.invoiceStatus)
        })

        it('deve lançar erro se o tipo for inválido', () => {
            // Forçamos um tipo inválido para testar a trava de segurança da Entity
            const invalidDto = DiscountDtoFactory.create({ discountType: 'teste' as any })
            expect(() => new DiscountEntity().dtoToEntity(invalidDto)).toThrow('O tipo de deconto é inválido')
        })
    })

    describe('validate', () => {
        let mockChangeErrorFields: jest.Mock

        beforeEach(() => {
            mockChangeErrorFields = jest.fn().mockReturnValue(jest.fn())
        })

        it('deve retornar lista de erros vazia quando os dados estão válidos', () => {
            const entity = new DiscountEntity().dtoToEntity(mockDto)
            const errors = entity.validate!(mockChangeErrorFields)

            expect(errors).toHaveLength(0)
        })

        it('deve invalidar descrição vazia ou nula', () => {
            const entity = new DiscountEntity().dtoToEntity(DiscountDtoFactory.create({ description: '' }))

            // O Jest captura o erro e verifica se a mensagem contém o texto esperado
            expect(() => {
                entity.validate!(mockChangeErrorFields)
            }).toThrow(/description/) // Verifica se o erro menciona o campo falho

            expect(mockChangeErrorFields).toHaveBeenCalledWith('description')
        })

        it('deve invalidar valor menor ou igual a zero', () => {
            const entity = new DiscountEntity().dtoToEntity(DiscountDtoFactory.create({ value: 0 }))

            expect(() => {
                entity.validate!(mockChangeErrorFields)
            }).toThrow(/value/)
        })

        it('deve invalidar valor undefined', () => {
            const entity = new DiscountEntity().dtoToEntity(DiscountDtoFactory.create({ value: undefined }))

            expect(() => {
                entity.validate!(mockChangeErrorFields)
            }).toThrow(/value/)
        })

        it('deve invalidar valor null', () => {
            const entity = new DiscountEntity().dtoToEntity(DiscountDtoFactory.create({ value: null as any }))

            expect(() => {
                entity.validate!(mockChangeErrorFields)
            }).toThrow(/value/)
        })
    })

    describe('modelToEntity', () => {
        it('deve mapear corretamente os dados do modelo para a entidade', async () => {
            const mockModel = {
                ...mockDto,
                id: 'uuid-123',
                serverId: 123, // Removido string para evitar erro se serverId for number
                userAction: 1, // Ajustado para number se for o seu padrão
                isValid: true,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            }

            const entity = new DiscountEntity().modelToEntity(mockModel as any)

            expect(entity.description).toBe(mockModel.description)
            expect(entity.value).toBe(mockModel.value)
            expect(entity.id).toBe(mockModel.id)
        })
    })
})
