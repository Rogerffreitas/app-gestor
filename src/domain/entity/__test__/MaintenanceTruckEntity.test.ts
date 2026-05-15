import { MaintenanceTruckEntity } from '../maintenance-truck/MaintenanceTruckEntity'
import { MaintenanceTruckDtoFactory } from './factories/MaintenanceTruckDtoFactory'
import { MaintenanceTruckPropsFactory } from './factories/MaintenanceTruckPropsFactory'

describe('MaintenanceTruckEntity Unit Tests', () => {
    let entity: MaintenanceTruckEntity
    const mockChangeErrorFields = jest.fn(() => jest.fn())

    beforeEach(() => {
        entity = new MaintenanceTruckEntity()
        jest.clearAllMocks()
    })

    describe('Mapeamento (DTO e Props)', () => {
        it('deve mapear corretamente de DTO para Entidade', () => {
            const dto = MaintenanceTruckDtoFactory.create({
                capacity: 5000,
                operatorMotorist: 'João Silva',
            })

            entity.dtoToEntity(dto)

            expect(entity.capacity).toBe(5000)
            expect(entity.operatorMotorist).toBe('João Silva')
            expect(entity.id).toBe(dto.id)
        })

        it('deve mapear corretamente de Model Props para Entidade', () => {
            const props = MaintenanceTruckPropsFactory.create({
                capacity: 8000,
                createdAt: 123456789,
            })

            entity.modelToEntity(props)

            expect(entity.capacity).toBe(8000)
            expect(entity.createdAt).toBe(123456789)
        })
    })

    describe('Validação (validate)', () => {
        it('deve validar com sucesso uma entidade com dados válidos', () => {
            const dto = MaintenanceTruckDtoFactory.create({
                capacity: 1000, // Inteiro válido
                workId: 'work-1',
                workEquipmentId: 'equip-1',
                nameProprietary: 'Empresa A',
                operatorMotorist: 'Motorista A',
                modelOrPlate: 'ABC-1234',
            })

            entity.dtoToEntity(dto)

            expect(() => entity.validate(mockChangeErrorFields)).not.toThrow()
        })

        it('deve lançar erro se a capacidade não for um número inteiro', () => {
            const dto = MaintenanceTruckDtoFactory.create({ capacity: 500.55 })
            entity.dtoToEntity(dto)

            expect(() => entity.validate(mockChangeErrorFields)).toThrow(/Informe um Número Inteiro/)
            expect(mockChangeErrorFields).toHaveBeenCalledWith('capacity')
        })

        it('deve lançar erro se os IDs de obra ou equipamento estiverem vazios', () => {
            const dto = MaintenanceTruckDtoFactory.create({
                workId: '',
                workEquipmentId: ' ',
            })
            entity.dtoToEntity(dto)

            expect(() => entity.validate(mockChangeErrorFields)).toThrow(/id da obra é obrigatório/)
        })

        it('deve lançar erro se o nome do proprietário for nulo ou vazio', () => {
            const dto = MaintenanceTruckDtoFactory.create({ nameProprietary: '' })
            entity.dtoToEntity(dto)

            expect(() => entity.validate(mockChangeErrorFields)).toThrow(/nome do proprietário é obrigatório/)
            // Verifica se chamou o callback de erro com o campo 'proprietary' conforme seu código
            expect(mockChangeErrorFields).toHaveBeenCalledWith('proprietary')
        })

        it('deve validar se a lista de usuários está vazia quando informada', () => {
            // Seu código valida if (this._usersList && this._usersList.trim().length <= 0)
            const dto = MaintenanceTruckDtoFactory.create({ usersList: ' ' })
            entity.dtoToEntity(dto)

            expect(() => entity.validate(mockChangeErrorFields)).toThrow(/Selecione um usuário/)
        })
    })
})
