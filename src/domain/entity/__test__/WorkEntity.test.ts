import WorkEntity from '../work/WorkEntity'
import { WorkPropsFactory } from '../../utils/factories/WorkPropsFactory'

describe('WorkEntity', () => {
    let entity: WorkEntity
    let mockChangeErrorFields: jest.Mock

    beforeEach(() => {
        entity = new WorkEntity()
        mockChangeErrorFields = jest.fn().mockReturnValue(jest.fn())

        jest.spyOn(console, 'log').mockImplementation(() => {})
        jest.spyOn(console, 'info').mockImplementation(() => {})
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    describe('Mapeamento', () => {
        it('deve retornar a própria instância se os dados forem nulos no toEntity', () => {
            const result = entity.toEntity(null as any)
            expect(result).toBe(entity)
        })

        it('deve mapear corretamente os dados via toEntity', () => {
            const props = WorkPropsFactory.create({ name: 'Obra Teste' })
            entity.toEntity(props)

            expect(entity.name).toBe('Obra Teste')
            expect(entity.pickets).toBe(150)
            expect(entity.id).toBe(props.id)
        })
    })

    describe('Validações', () => {
        it('deve validar com sucesso uma obra com dados corretos', () => {
            const props = WorkPropsFactory.create()
            entity.toEntity(props)

            expect(() => entity.validate(mockChangeErrorFields)).not.toThrow()
        })

        it('deve invalidar se usersList estiver vazio ou nulo', () => {
            const props = WorkPropsFactory.create({ usersList: '' })
            entity.toEntity(props)

            expect(() => entity.validate(mockChangeErrorFields)).toThrow(/Selecione um usuário/)
            expect(mockChangeErrorFields).toHaveBeenCalledWith('userList')
        })

        it('deve invalidar se o nome exceder 30 caracteres', () => {
            const props = WorkPropsFactory.create({ name: 'Nome de Obra Muito Longo Para Este Campo' })
            entity.toEntity(props)

            expect(() => entity.validate(mockChangeErrorFields)).toThrow(/Max. 30 caracteres/)
        })

        it('deve invalidar se a descrição exceder 50 caracteres', () => {
            // No seu código: if (this._description.length > 50) throw "Max. 100"
            const props = WorkPropsFactory.create({ description: 'a'.repeat(51) })
            entity.toEntity(props)

            expect(() => entity.validate(mockChangeErrorFields)).toThrow(/Max. 100 caracteres/)
        })

        it('deve invalidar se pickets for menor ou igual a zero', () => {
            const props = WorkPropsFactory.create({ pickets: 0 })
            entity.toEntity(props)

            expect(() => entity.validate(mockChangeErrorFields)).toThrow(/pickets/)
        })

        it('deve invalidar se pickets exceder 99999', () => {
            const props = WorkPropsFactory.create({ pickets: 100000 })
            entity.toEntity(props)

            expect(() => entity.validate(mockChangeErrorFields)).toThrow(/Max. 99999 estacas/)
        })
    })

    describe('DTO', () => {
        it('deve converter corretamente via dtoToEntity', () => {
            const dto = {
                name: 'Obra DTO',
                description: 'Desc',
                pickets: '50',
                usersList: 'user-99',
                id: '123',
            } as any

            entity.dtoToEntity(dto)

            expect(entity.pickets).toBe(50)
            expect(entity.usersList).toBe('user-99')
        })
    })
})
