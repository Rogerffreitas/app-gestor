import { DiscountTypes, InvoiceStatus } from '../../../../types'
import DiscountEntity from '../DiscountEntity'

describe('DiscountEntity', () => {
    const mockDto = {
        description: 'Desconto de Teste',
        value: 100,
        discountType: DiscountTypes.TRANSPORT_VEHICLE,
        transportVehicleOrWorkEquipmentId: 'id-veiculo-123',
        workId: 'id-obra-456',
        invoiceId: 1,
        invoiceStatus: InvoiceStatus.PENDING,
        userId: 'user-001',
        enterpriseId: 'ent-001',
    }

    describe('dtoToEntity', () => {
        it('deve criar uma entidade corretamente a partir de um DTO válido', () => {
            const entity = DiscountEntity.dtoToEntity(mockDto)

            expect(entity.description).toBe(mockDto.description)
            expect(entity.value).toBe(mockDto.value)
            expect(entity.discountType).toBe(mockDto.discountType)
            expect(entity.invoiceStatus).toBe(mockDto.invoiceStatus)
        })

        it('deve lançar erro se o discountType for inválido', () => {
            const invalidDto = { ...mockDto, discountType: 'INVALIDO' as any }
            expect(() => DiscountEntity.dtoToEntity(invalidDto)).toThrow('O tipo de deconto é inválido')
        })
    })

    describe('validate', () => {
        let mockChangeErrorFields: jest.Mock

        beforeEach(() => {
            // Mock da função que a entidade chama para reportar erros
            mockChangeErrorFields = jest.fn().mockReturnValue(jest.fn())
        })

        it('deve retornar lista de erros vazia quando os dados estão válidos', () => {
            const entity = DiscountEntity.dtoToEntity(mockDto)
            const errors = entity.validate!(mockChangeErrorFields)

            expect(errors).toHaveLength(0)
            expect(mockChangeErrorFields).not.toHaveBeenCalled()
        })

        it('deve invalidar descrição vazia ou nula', () => {
            const entity = DiscountEntity.dtoToEntity({ ...mockDto, description: '' })
            const errors = entity.validate!(mockChangeErrorFields)

            expect(errors).toContainEqual(expect.objectContaining({ field: 'description' }))
            expect(mockChangeErrorFields).toHaveBeenCalledWith('description')
        })

        it('deve invalidar valor menor ou igual a zero', () => {
            const entity = DiscountEntity.dtoToEntity({ ...mockDto, value: 0 })
            const errors = entity.validate!(mockChangeErrorFields)

            expect(errors).toContainEqual(expect.objectContaining({ field: 'value' }))
        })

        it('deve invalidar valor undefined', () => {
            const entity = DiscountEntity.dtoToEntity({ ...mockDto, value: undefined })
            const errors = entity.validate!(mockChangeErrorFields)

            expect(errors).toContainEqual(expect.objectContaining({ field: 'value' }))
        })

        it('deve invalidar valor null', () => {
            const entity = DiscountEntity.dtoToEntity({ ...mockDto, value: null })
            const errors = entity.validate!(mockChangeErrorFields)

            expect(errors).toContainEqual(expect.objectContaining({ field: 'value' }))
        })

        it('deve invalidar IDs obrigatórios ausentes', () => {
            const entity = DiscountEntity.dtoToEntity({
                ...mockDto,
                transportVehicleOrWorkEquipmentId: '',
                workId: '',
            })
            const errors = entity.validate!(mockChangeErrorFields)

            expect(errors.some((e) => e.field === 'transportVehicleOrWorkEquipmentId')).toBe(true)
            expect(errors.some((e) => e.field === 'workId')).toBe(true)
        })
    })

    describe('modelToEntity', () => {
        it('deve mapear corretamente os dados do modelo para a entidade', async () => {
            const mockModel = {
                ...mockDto,
                id: 'uuid-123',
                serverId: 'srv-123',
                userAction: 'CREATE',
                isValid: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                _raw: { _status: 'synced' },
            } as any

            const entity = await DiscountEntity.modelToEntity(mockModel)

            expect(entity.description).toBe(mockModel.description)
            expect(entity.value).toBe(mockModel.value)
            // Verifica se campos herdados de AbstractEntity (se existirem) foram preenchidos
            expect((entity as any).id).toBe(mockModel.id)
        })
    })
})
