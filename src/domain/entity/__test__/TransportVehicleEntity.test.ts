import { TransportVehicleEntity } from '../transport-vehicle/TransportVehicleEntity'
import { TransportVehiclePropsFactory } from '../../utils/factories/TransportVehiclePropsFactory'
import { TransportVehicleDtoFactory } from '../../utils/factories/TransportVehicleDtoFactory'

describe('TransportVehicleEntity', () => {
    let entity: TransportVehicleEntity
    let mockChangeErrorFields: jest.Mock

    beforeEach(() => {
        entity = new TransportVehicleEntity()
        mockChangeErrorFields = jest.fn().mockReturnValue(jest.fn())
        jest.spyOn(console, 'log').mockImplementation(() => {})
        jest.spyOn(console, 'info').mockImplementation(() => {})
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    describe('Validação de Placa', () => {
        it('deve aceitar uma placa válida (formato antigo e mercosul)', () => {
            const plates = ['ABC1234', 'ABC1D23']
            plates.forEach((plate) => {
                const dto = TransportVehicleDtoFactory.create({ plate })
                entity.dtoToEntity(dto)
                expect(() => entity.validate(mockChangeErrorFields)).not.toThrow()
            })
        })

        it('deve aceitar uma placa válida (formato antigo e mercosul)', () => {
            const plates = ['ABC1234', 'ABC1D23']
            plates.forEach((plate) => {
                const props = TransportVehiclePropsFactory.create({ plate })
                entity.modelToEntity(props)
                expect(() => entity.validate(mockChangeErrorFields)).not.toThrow()
            })
        })

        it('deve lançar erro para placa em formato inválido', () => {
            const dto = TransportVehicleDtoFactory.create({ plate: 'AB123' })
            entity.dtoToEntity(dto)

            expect(() => {
                entity.validate(mockChangeErrorFields)
            }).toThrow(/Formato de placa inválido/)
        })

        it('deve lançar erro para placa vazia', () => {
            const dto = TransportVehicleDtoFactory.create({ plate: '' })
            entity.dtoToEntity(dto)
            expect(() => entity.validate(mockChangeErrorFields)).toThrow(/A placa é obrigatória/)
        })
    })

    describe('Validação de Capacidade', () => {
        it('deve invalidar se a capacidade não for um número inteiro', () => {
            const dto = TransportVehicleDtoFactory.create({ capacity: 10.5 })
            entity.dtoToEntity(dto)

            expect(() => {
                entity.validate(mockChangeErrorFields)
            }).toThrow(/Informe um Número Inteiro/)
        })

        it('deve invalidar se a capacidade ultrapassar 99999', () => {
            const dto = TransportVehicleDtoFactory.create({ capacity: 100000 })
            entity.dtoToEntity(dto)

            expect(() => {
                entity.validate(mockChangeErrorFields)
            }).toThrow(/Max. 99999/)
        })
    })

    describe('Composição e Mapeamento', () => {
        it('deve mapear corretamente os dados via dtoToEntity', () => {
            const dto = TransportVehicleDtoFactory.create({
                motorist: 'Carlos',
                plate: 'AAA0A00',
                capacity: '20' as any, // Testando conversão de string
                color: 'Preto',
                workId: 'obra-1',
            })

            entity.dtoToEntity(dto)

            expect(entity.motorist).toBe('Carlos')
            expect(entity.capacity).toBe(20)
            expect(entity.plate).toBe('AAA0A00')
            expect(entity.color).toBe('Preto')
            expect(typeof entity.capacity).toBe('number')
        })

        it('deve mapear corretamente os dados via modelToEntity', () => {
            const props = TransportVehiclePropsFactory.create({
                motorist: 'Carlos',
                plate: 'AAA0A00',
                capacity: '20' as any, // Testando conversão de string
                color: 'Preto',
                workId: 'obra-1',
            })

            entity.modelToEntity(props)

            expect(entity.motorist).toBe('Carlos')
            expect(entity.capacity).toBe(20)
            expect(entity.plate).toBe('AAA0A00')
            expect(entity.color).toBe('Preto')
            expect(typeof entity.capacity).toBe('number')
        })
    })

    describe('Obrigatoriedade de Campos', () => {
        it('deve invalidar se o workId estiver vazio', () => {
            const dto = TransportVehicleDtoFactory.create({ workId: '' })
            entity.dtoToEntity(dto)
            expect(() => entity.validate(mockChangeErrorFields)).toThrow(/id da obra é obrigatório/)
        })

        it('deve invalidar se a cor estiver vazia', () => {
            const dto = TransportVehicleDtoFactory.create({ color: '  ' })
            entity.dtoToEntity(dto)
            expect(() => entity.validate(mockChangeErrorFields)).toThrow(/A cor é obrigatória/)
        })

        it('deve propagar erro de validação do proprietário (Proprietary)', () => {
            const dto = TransportVehicleDtoFactory.create({ nameProprietary: '' })
            entity.dtoToEntity(dto)

            expect(() => {
                entity.validate(mockChangeErrorFields)
            }).toThrow(/Entity validation failed/)
        })
    })
})
