import WorkRoutesEntity from '../work-routes/WorkRoutesEntity'
import { DepositDtoFactory } from '../../utils/factories/DepositDtoFactory'
import { WorkDtoFactory } from '../../utils/factories/WorkDtoFactory'
import { WorkPropsFactory } from '../../utils/factories/WorkPropsFactory'
import { WorkRoutesDtoFactory } from '../../utils/factories/WorkRoutesDtoFactory'
import { WorkRoutesPropsFactory } from '../../utils/factories/WorkRoutesPropsFactory'

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
        it('should fail if the value is fixed and the initial pick is null.', () => {
            const dto = WorkRoutesDtoFactory.create({
                isFixedValue: false,
                initialPicket: undefined,
            })
            entity.dtoToEntity(dto)
            expect(() => entity.validate(mockChangeErrorFields)).toThrow(/Preencha o campo obrigatório/)
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

        it('should fail if it contains decimal numbers.', () => {
            const dto = WorkRoutesDtoFactory.create({
                km: 10.1,
                initialPicket: 200.1,
                value: 203.3,
            })
            entity.dtoToEntity(dto)
            expect(() => entity.validate(mockChangeErrorFields)).toThrow(/Não são permitidas casas decimais/)
        })
    })

    describe('Mapeamento', () => {
        it('deve converter corretamente strings para números via modelToEntity', () => {
            const props = WorkRoutesPropsFactory.create({
                km: '2550' as any,
                value: '10020' as any,
                initialPicket: '200' as any,
            })
            entity.modelToEntity(props)

            expect(entity.km).toBe(2550)
            expect(entity.value).toBe(10020)
        })
    })
})
