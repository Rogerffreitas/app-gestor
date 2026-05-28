import MaterialEntity from '../material/MaterialEntity'
import { MaterialPropsFactory } from '../../utils/factories/MaterialPropsFactory'
import { MaterialDtoFactory } from '../../utils/factories/MaterialDtoFactory'

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
            const props = MaterialPropsFactory.create({
                name: 'Brita 1',
                density: '160' as any,
                value: '100' as any,
            })
            entity.modelToEntity(props)

            expect(entity.name).toBe('Brita 1')
            expect(entity.density).toBe(160)
            expect(entity.value).toBe(100)
            expect(entity.id).toBe(props.id)
        })

        it('deve converter strings numéricas para number no dtoToEntity', () => {
            const dto = MaterialDtoFactory.create({
                density: '250' as any,
                value: '15000' as any,
            })

            entity.dtoToEntity(dto)

            expect(entity.density).toBe(250)
            expect(entity.value).toBe(15000)
            expect(typeof entity.density).toBe('number')
        })
    })

    describe('Validações', () => {
        it('deve validar com sucesso um material correto', () => {
            const props = MaterialDtoFactory.create()
            entity.dtoToEntity(props)

            expect(() => entity.validate(mockChangeErrorFields)).not.toThrow()
        })

        it('deve lançar erro se o nome estiver vazio', () => {
            const props = MaterialDtoFactory.create({ name: '' })
            entity.dtoToEntity(props)

            expect(() => entity.validate(mockChangeErrorFields)).toThrow(/Preencha o campo obrigatório/)
            expect(mockChangeErrorFields).toHaveBeenCalledWith('name')
        })

        it('deve invalidar nome com mais de 50 caracteres', () => {
            const props = MaterialDtoFactory.create({ name: 'a'.repeat(51) })
            entity.dtoToEntity(props)

            expect(() => entity.validate(mockChangeErrorFields)).toThrow(/Max. 50 caracteres/)
        })

        it('deve invalidar densidade igual a zero ou nula', () => {
            const props = MaterialDtoFactory.create({ density: 0 })
            entity.dtoToEntity(props)

            expect(() => entity.validate(mockChangeErrorFields)).toThrow(/density/)
        })

        it('deve invalidar se a densidade ultrapassar o limite de 9999', () => {
            const props = MaterialDtoFactory.create({ density: 10000 })
            entity.dtoToEntity(props)

            expect(() => entity.validate(mockChangeErrorFields)).toThrow(/Max. 99/)
        })

        it('deve invalidar se o valor ultrapassar o limite de 999.999.999', () => {
            const props = MaterialDtoFactory.create({ value: 1000000000 })
            entity.dtoToEntity(props)

            expect(() => entity.validate(mockChangeErrorFields)).toThrow(/Max. 999999/)
        })

        it('should fail if it contains decimal numbers.', () => {
            const dto = MaterialDtoFactory.create({
                density: 1.5,
                value: 203.3,
            })
            entity.dtoToEntity(dto)
            expect(() => entity.validate(mockChangeErrorFields)).toThrow(/Não são permitidas casas decimais/)
        })
    })
})
