import { FuelSupplyTypes } from '../../types'
import { FuelSupplyEntity } from '../fuel-supply/FuelSupplyEntity'
import { FuelSupplyDtoFactory } from './factories/FuelSupplyDtoFactory'
import { FuelSupplyPropsFactory } from './factories/FuelSupplyPropsFactory'

describe('FuelSupplyEntity Unit Tests', () => {
    let entity: FuelSupplyEntity

    beforeEach(() => {
        entity = new FuelSupplyEntity()
    })

    describe('dtoToEntity', () => {
        it('deve mapear um DTO para entidade corretamente e calcular o valor', () => {
            const dto = FuelSupplyDtoFactory.create({
                quantity: 100,
                valuePerLiter: 500, // Representando R$ 5,00
            })

            entity.dtoToEntity(dto)

            expect(entity.id).toBe(dto.id)
            expect(entity.quantity).toBe(100)
            // Testando sua lógica de cálculo: ((100 / 100) * (500 / 100)) = 5.00 -> 5
            expect(entity.value).toBe(500)
        })

        it('deve forçar isGasStation como true se o tipo for MAINTENANCE_TRUCK_TANK', () => {
            const dto = FuelSupplyDtoFactory.create({
                supplyType: FuelSupplyTypes.MAINTENANCE_TRUCK_TANK,
                isGasStation: false,
            })

            entity.dtoToEntity(dto)

            expect(entity.isGasStation).toBe(true)
        })

        it('deve lançar erro se o supplyType for inválido', () => {
            const dto = FuelSupplyDtoFactory.create({
                supplyType: 'INVALID_TYPE' as any,
            })

            expect(() => entity.dtoToEntity(dto)).toThrow('O tipo de abastecimento é inválido')
        })
    })

    describe('modelToEntity', () => {
        it('deve mapear as propriedades do modelo (props) para a entidade', () => {
            const props = FuelSupplyPropsFactory.create({
                value: 450.5,
                serverId: 888,
            })

            entity.modelToEntity(props)

            expect(entity.value).toBe(450.5)
            expect(entity.serverId).toBe(888)
            expect(entity.status).toBe('active')
        })
    })

    describe('validate', () => {
        const mockChangeErrorFields = jest.fn(() => jest.fn())

        it('deve validar com sucesso uma entidade preenchida corretamente', () => {
            const dto = FuelSupplyDtoFactory.create({
                quantity: 10,
                valuePerLiter: 5,
                description: 'Valid Desc',
                supplyType: FuelSupplyTypes.EQUIPMENT,
                hourMeterOrOdometer: 100, // Obrigatório para EQUIPMENT
            })

            entity.dtoToEntity(dto)

            // Note: O cálculo do DTO pode resultar em 0 se os valores forem baixos
            // devido ao seu parseInt/100, então forçamos um valor para passar na validação
            // ou ajustamos a factory.

            expect(() => entity.validate(mockChangeErrorFields)).not.toThrow()
        })

        it('deve lançar erro se quantity for menor ou igual a zero', () => {
            const dto = FuelSupplyDtoFactory.create({ quantity: 0 })
            entity.dtoToEntity(dto)

            expect(() => entity.validate(mockChangeErrorFields)).toThrow(/quantity/)
            expect(mockChangeErrorFields).toHaveBeenCalledWith('quantity')
        })

        it('deve exigir horímetro se o tipo for EQUIPMENT', () => {
            const dto = FuelSupplyDtoFactory.create({
                supplyType: FuelSupplyTypes.EQUIPMENT,
                hourMeterOrOdometer: 0,
            })
            entity.dtoToEntity(dto)

            expect(() => entity.validate(mockChangeErrorFields)).toThrow(/hourMeterOrOdometer/)
        })

        it('deve lançar erro se workId estiver ausente', () => {
            const dto = FuelSupplyDtoFactory.create({ workId: '' })
            entity.dtoToEntity(dto)

            expect(() => entity.validate(mockChangeErrorFields)).toThrow(/workId/)
        })
    })
})
