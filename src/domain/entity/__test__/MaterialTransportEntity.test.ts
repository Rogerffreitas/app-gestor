import { Reference } from '../../types'
import { MaterialTransportEntity } from '../material-transport/MaterialTransportEntity'
import { MaterialDtoFactory } from '../../utils/factories/MaterialDtoFactory'
import { MaterialTransportDtoFactory } from '../../utils/factories/MaterialTransportDtoFactory'
import { MaterialTransportPropsFactory } from '../../utils/factories/MaterialTransportPropsFactory'
import { TransportVehicleDtoFactory } from '../../utils/factories/TransportVehicleDtoFactory'
import { WorkRoutesDtoFactory } from '../../utils/factories/WorkRoutesDtoFactory'

describe('MaterialTransportEntity Unit Tests', () => {
    let entity: MaterialTransportEntity
    const mockChangeErrorFields = jest.fn(() => jest.fn())

    beforeEach(() => {
        entity = new MaterialTransportEntity()
        jest.clearAllMocks()
    })

    describe('dtoToEntity - Lógica de Cálculo', () => {
        it('deve calcular o valor total baseado no VOLUME e incluir DMT de estacas', () => {
            const dto = MaterialTransportDtoFactory.create({
                quantity: 1000, // 10.00 após /100
                totalPickets: 10, // 10 * 20m = 200m = 0.2km
                workRoutes: WorkRoutesDtoFactory.create({
                    km: 500, // 5.00km após /100
                    value: 200, // 2.00 após /1000
                    isFixedValue: false,
                }),
                transportVehicle: TransportVehicleDtoFactory.create({ capacity: 15 }),
                material: MaterialDtoFactory.create({ referenceMaterialCalculation: Reference.VOLUME }),
            })

            entity.dtoToEntity(dto)

            // Cálculo esperado:
            // extraDMT = (10 * 20) / 1000 = 0.2km
            // totalKm = 5.00 + 0.2 = 5.2km
            // unitCost = 2000 / 1000 = 2.0
            // costCapacity = 2.0 * 15 = 30.0
            // totalValue = (30.0 * 5.2) = 156.00 -> 15600 (devido ao replace e parseInt)

            expect(entity.value).toBe(15600)
            expect(entity.isReferenceCapacity).toBe(true)
            expect(entity.quantity).toBe(15) // Assume capacidade do veículo no Volume
        })

        it('deve utilizar o valor fixo da rota se isFixedValue for true', () => {
            const dto = MaterialTransportDtoFactory.create({
                workRoutes: WorkRoutesDtoFactory.create({
                    value: 50000,
                    isFixedValue: true,
                    km: 100,
                }),
            })

            entity.dtoToEntity(dto)
            console.info(entity)
            expect(entity.value).toBe(50000)
        })

        it('deve calcular o valor total baseado no PESO (WEIGHT)', () => {
            const dto = MaterialTransportDtoFactory.create({
                quantity: 2000, // 20.00 após /100
                totalPickets: 0,

                workRoutes: WorkRoutesDtoFactory.create({
                    km: 1000, // 10.00km
                    value: 100, // 1.00 unitário
                    isFixedValue: false,
                }),
                material: MaterialDtoFactory.create({
                    referenceMaterialCalculation: Reference.WEIGHT,
                }) as any,
            })

            entity.dtoToEntity(dto)

            // totalKm = 10.0
            // costDisplacement = 1.0 * 20.0 = 20.0
            // totalValue = 20.0 * 10.0 = 200.00 -> 20000
            expect(entity.value).toBe(20000)
        })
    })

    describe('modelToEntity', () => {
        it('deve mapear as propriedades do modelo corretamente', () => {
            const props = MaterialTransportPropsFactory.create({
                value: 1250.5,
                isReferenceCapacity: true,
                deliveryPicket: 'Estaca 100',
            })

            entity.modelToEntity(props)

            expect(entity.value).toBe(1250.5)
            expect(entity.deliveryPicket).toBe('Estaca 100')
            expect(entity.isReferenceCapacity).toBe(true)
        })
    })

    describe('validate', () => {
        it('deve lançar erro se workId estiver ausente', () => {
            const dto = MaterialTransportDtoFactory.create({ workId: '' })
            entity.dtoToEntity(dto)

            expect(() => entity.validate(mockChangeErrorFields)).toThrow('Work validation failed')
        })

        it('deve lançar erro se o valor calculado for 0', () => {
            const dto = MaterialTransportDtoFactory.create({
                workRoutes: WorkRoutesDtoFactory.create({ value: 0, isFixedValue: true }),
            })
            entity.dtoToEntity(dto)

            expect(() => entity.validate(mockChangeErrorFields)).toThrow(/value/)
            expect(mockChangeErrorFields).toHaveBeenCalledWith('value')
        })

        it('deve validar quantidade obrigatória quando NÃO é por capacidade de referência', () => {
            const dto = MaterialTransportDtoFactory.create({
                quantity: 0,
                material: MaterialDtoFactory.create({ referenceMaterialCalculation: Reference.WEIGHT }),
            })
            entity.dtoToEntity(dto)

            expect(() => entity.validate(mockChangeErrorFields)).toThrow(/quantity/)
        })

        it('deve chamar as validações das entidades filhas', () => {
            // Como as entidades são instanciadas com 'new' dentro do dtoToEntity,
            // elas precisam estar minimamente mockadas ou implementadas.
            const dto = MaterialTransportDtoFactory.create()
            entity.dtoToEntity(dto)

            // Aqui testamos se o fluxo chega ao fim sem erros para uma factory válida
            expect(() => entity.validate(mockChangeErrorFields)).not.toThrow()
        })
    })
})
