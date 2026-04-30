import EquipmentProps from '../../interfaces/props/EquipmentProps'
import { UserAction } from '../../types'
import { EquipmentEntity } from '../equipment/EquipmentEntity'
import { EquipmentDtoFactory } from './factories/EquipmentDtoFactory'

describe('EquipmentEntity', () => {
    let entity: EquipmentEntity
    let mockChangeErrorFields: jest.Mock

    beforeEach(() => {
        entity = new EquipmentEntity()
        // Mock da função de callback de erros
        mockChangeErrorFields = jest.fn().mockReturnValue(jest.fn())

        // Silencia logs durante os testes para manter o terminal limpo
        jest.spyOn(console, 'log').mockImplementation(() => {})
        jest.spyOn(console, 'info').mockImplementation(() => {})
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    describe('dtoToEntity', () => {
        it('deve mapear corretamente os dados do DTO para a entidade', () => {
            const dto = EquipmentDtoFactory.create({
                operatorMotorist: 'Ricardo Santos',
                modelOrPlate: 'ABC-1234',
                bank: 'NuBank',
            })

            entity.dtoToEntity(dto)

            expect(entity.operatorMotorist).toBe('Ricardo Santos')
            expect(entity.modelOrPlate).toBe('ABC-1234')
            expect(entity.bank).toBe('NuBank')
            expect(entity.id).toBe(dto.id)
        })

        it('deve garantir que valores numéricos sejam convertidos corretamente com sinal de +', () => {
            const dto = EquipmentDtoFactory.create({
                hourMeterOrOdometer: 150.5,
            })
            // Simulando entrada que pode vir como string do DTO em alguns contextos
            ;(dto as any).hourMeterOrOdometer = '150.5'

            entity.dtoToEntity(dto)

            expect(entity.hourMeterOrOdometer).toBe(150.5)
            expect(typeof entity.hourMeterOrOdometer).toBe('number')
        })
    })

    describe('validate', () => {
        it('deve validar com sucesso uma entidade preenchida corretamente', () => {
            const dto = EquipmentDtoFactory.create()
            entity.dtoToEntity(dto)

            expect(() => entity.validate(mockChangeErrorFields)).not.toThrow()
        })

        it('deve lançar erro se o operador estiver vazio', () => {
            const dto = EquipmentDtoFactory.create({ operatorMotorist: '' })
            entity.dtoToEntity(dto)

            expect(() => {
                entity.validate(mockChangeErrorFields)
            }).toThrow(/operatorMotorist/)

            expect(mockChangeErrorFields).toHaveBeenCalledWith('operatorMotorist')
        })

        it('deve lançar erro se o modelo ou placa estiver vazio', () => {
            const dto = EquipmentDtoFactory.create({ modelOrPlate: '   ' })
            entity.dtoToEntity(dto)

            expect(() => {
                entity.validate(mockChangeErrorFields)
            }).toThrow(/modelOrPlate/)
        })

        it('deve propagar erros de validação da classe Proprietary', () => {
            // Simulando erro no proprietário (nome vazio)
            const dto = EquipmentDtoFactory.create({ nameProprietary: '' })
            entity.dtoToEntity(dto)

            // O erro deve ser lançado porque Proprietary.validate() retornará erros
            expect(() => {
                entity.validate(mockChangeErrorFields)
            }).toThrow(/Entity validation failed/)
        })
    })

    describe('modelToEntity', () => {
        it('deve carregar corretamente dados brutos (mock de banco de dados)', () => {
            const defaultProps: EquipmentProps = {
                id: 'eq-uuid-123',
                serverId: 1001,
                userId: 'user-001',
                enterpriseId: 'ent-99',
                userAction: UserAction.CREATE, // Assumindo que UserAction é um enum ou tipo
                isValid: true,
                status: 'active',
                createdAt: Date.now(),
                updatedAt: Date.now(),

                // Identificação
                operatorMotorist: 'João Silva',
                isEquipment: true,
                modelOrPlate: 'Escavadeira Volvo EC210',

                // RentInformation
                hourMeterOrOdometer: 1250,
                startRental: '2026-01-10',
                monthlyPayment: 8500,
                valuePerHourKm: 75,
                valuePerDay: 450,

                // Proprietary
                nameProprietary: 'Locações Industriais LTDA',
                cpfCnpjProprietary: '12.345.678/0001-99',
                telProprietary: '85988887777',

                // BankInformation
                bank: 'Banco do Brasil',
                beneficiary: 'Locações Industriais LTDA',
                agency: '1234',
                account: '54321-0',
                pix: 'contato@locacoes.com.br',
            }

            entity.modelToEntity(defaultProps)

            expect(entity.operatorMotorist).toBe('João Silva')
            expect(entity.hourMeterOrOdometer).toBe(1250)
            expect(entity.isEquipment).toBe(true)
        })
    })
})
