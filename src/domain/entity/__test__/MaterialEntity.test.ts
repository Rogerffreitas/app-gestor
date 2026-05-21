import MaterialEntity from '../material/MaterialEntity'
import { MaterialPropsFactory } from '../../utils/factories/MaterialPropsFactory'

describe('MaterialEntity', () => {
    let entity: MaterialEntity
    let mockChangeErrorFields: jest.Mock

    beforeEach(() => {
        entity = new MaterialEntity()
        mockChangeErrorFields = jest.fn().mockReturnValue(jest.fn())

        jest.spyOn(console, 'log').mockImplementation(() => {})
        jest.spyOn(console, 'info').mockImplementation(() => {})
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    describe('Mapeamento de Dados', () => {
        it('deve mapear corretamente via modelToEntity', () => {
            const props = MaterialPropsFactory.create({ name: 'Brita 1', density: 1.6 })
            entity.modelToEntity(props)

            expect(entity.name).toBe('Brita 1')
            expect(entity.density).toBe(1.6)
            expect(entity.id).toBe(props.id)
        })

        it('deve converter strings numéricas para number no dtoToEntity', () => {
            const dto = {
                name: 'Pedra',
                density: '2.5', // String vinda de um input/DTO
                value: '150.00',
                depositId: 'dep-1',
            } as any

            entity.dtoToEntity(dto)

            expect(entity.density).toBe(2.5)
            expect(entity.value).toBe(150)
            expect(typeof entity.density).toBe('number')
        })
    })

    describe('Validações', () => {
        it('deve validar com sucesso um material correto', () => {
            const props = MaterialPropsFactory.create()
            entity.modelToEntity(props)

            expect(() => entity.validate(mockChangeErrorFields)).not.toThrow()
        })

        it('deve lançar erro se o nome estiver vazio', () => {
            const props = MaterialPropsFactory.create({ name: '' })
            entity.modelToEntity(props)

            expect(() => entity.validate(mockChangeErrorFields)).toThrow(/Preencha o campo obrigatório/)
            expect(mockChangeErrorFields).toHaveBeenCalledWith('name')
        })

        it('deve invalidar nome com mais de 50 caracteres', () => {
            const props = MaterialPropsFactory.create({ name: 'a'.repeat(51) })
            entity.modelToEntity(props)

            expect(() => entity.validate(mockChangeErrorFields)).toThrow(/Max. 50 caracteres/)
        })

        it('deve invalidar densidade igual a zero ou nula', () => {
            const props = MaterialPropsFactory.create({ density: 0 })
            entity.modelToEntity(props)

            expect(() => entity.validate(mockChangeErrorFields)).toThrow(/density/)
        })

        it('deve invalidar se a densidade ultrapassar o limite de 9999', () => {
            const props = MaterialPropsFactory.create({ density: 10000 })
            entity.modelToEntity(props)

            expect(() => entity.validate(mockChangeErrorFields)).toThrow(/Max. 99/)
        })

        it('deve invalidar se o valor ultrapassar o limite de 999.999.999', () => {
            const props = MaterialPropsFactory.create({ value: 1000000000 })
            entity.modelToEntity(props)

            expect(() => entity.validate(mockChangeErrorFields)).toThrow(/Max. 999999/)
        })
    })
})
