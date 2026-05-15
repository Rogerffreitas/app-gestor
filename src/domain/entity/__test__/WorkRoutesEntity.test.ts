import WorkRoutesEntity from '../work-routes/WorkRoutesEntity'
import { DepositDtoFactory } from './factories/DepositDtoFactory'
import { WorkDtoFactory } from './factories/WorkDtoFactory'
import { WorkPropsFactory } from './factories/WorkPropsFactory'
import { WorkRoutesDtoFactory } from './factories/WorkRoutesDtoFactory'
import { WorkRoutesPropsFactory } from './factories/WorkRoutesPropsFactory'

describe('WorkRoutesEntity', () => {
    let entity: WorkRoutesEntity
    let mockChangeErrorFields: jest.Mock

    beforeEach(() => {
        entity = new WorkRoutesEntity()
        mockChangeErrorFields = jest.fn().mockReturnValue(jest.fn())

        jest.spyOn(console, 'log').mockImplementation(() => {})
        jest.spyOn(console, 'info').mockImplementation(() => {})
    })

    describe('Lógica de Negócio (isFixedValue)', () => {
        it('deve zerar o KM se a rota for de valor fixo no dtoToEntity', () => {
            const dto = WorkRoutesDtoFactory.create({
                isFixedValue: true,
                km: 50.0,
                arrivalLocation: 'A',
                departureLocation: 'B',
                work: WorkDtoFactory.create(),
                deposit: DepositDtoFactory.create(),
            })
            entity.dtoToEntity(dto)
            expect(entity.km).toBe(0)
        })

        it('deve invalidar se KM for zero e não for valor fixo', () => {
            const dto = WorkRoutesDtoFactory.create({
                isFixedValue: false,
                km: 0,
            })
            entity.dtoToEntity(dto)

            expect(() => entity.validate(mockChangeErrorFields)).toThrow(/Preencha o campo obrigatório/)
        })
    })

    describe('Validação de Estacas (Pickets)', () => {
        it('deve invalidar se a estaca inicial for maior que o total da obra', () => {
            const dto = WorkRoutesDtoFactory.create({
                initialPicket: 150,
                work: WorkDtoFactory.create({ pickets: 100 }),
            })
            entity.dtoToEntity(dto)

            expect(() => entity.validate(mockChangeErrorFields)).toThrow(/Estaca de destino maior que 100/)
        })
    })

    describe('Validações de Campo', () => {
        it('deve validar com sucesso uma rota correta', () => {
            const dto = WorkRoutesDtoFactory.create()
            entity.dtoToEntity(dto)

            expect(() => entity.validate(mockChangeErrorFields)).not.toThrow()
        })

        it('deve invalidar se o local de chegada exceder 100 caracteres', () => {
            const dto = WorkRoutesDtoFactory.create({
                arrivalLocation: 'a'.repeat(101),
            })
            entity.dtoToEntity(dto)

            expect(() => entity.validate(mockChangeErrorFields)).toThrow(/Max. 100 caracteres/)
        })

        it('deve invalidar se o valor for zero ou nulo', () => {
            const dto = WorkRoutesDtoFactory.create({ value: 0 })
            entity.dtoToEntity(dto)
            expect(() => entity.validate(mockChangeErrorFields)).toThrow(/value/)
        })
    })

    describe('Mapeamento', () => {
        it('deve converter corretamente strings para números via modelToEntity', () => {
            const props = WorkRoutesPropsFactory.create({
                km: '25.5' as any,
                value: '100.20' as any,
            })
            entity.modelToEntity(props)

            expect(entity.km).toBe(25.5)
            expect(entity.value).toBe(100.2)
        })
    })
})
