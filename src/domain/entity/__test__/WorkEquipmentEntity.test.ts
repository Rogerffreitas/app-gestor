import { WorkEquipmentEntity } from '../work-equipment/WorkEquipmentEntity'
import { WorkEquipmentDtoFactory } from '../../utils/factories/WorkEquipmentDtoFactory'
import { WorkEquipmentPropsFactory } from '../../utils/factories/WorkEquipmentPropsFactory'

describe('WorkEquipmentEntity', () => {
    let entity: WorkEquipmentEntity
    let mockChangeErrorFields: jest.Mock

    beforeEach(() => {
        entity = new WorkEquipmentEntity()
        mockChangeErrorFields = jest.fn().mockReturnValue(jest.fn())

        // Silenciar logs para manter o terminal limpo
        jest.spyOn(console, 'log').mockImplementation(() => {})
        jest.spyOn(console, 'info').mockImplementation(() => {})
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    describe('modelToEntity', () => {
        it('deve mapear corretamente as propriedades para a entidade', () => {
            const props = WorkEquipmentPropsFactory.create({
                operatorMotorist: 'Marcos Silva',
                workId: 'obra-norte',
            })

            entity.modelToEntity(props)

            expect(entity.operatorMotorist).toBe('Marcos Silva')
            expect(entity.workId).toBe('obra-norte')
            expect(entity.hourMeterOrOdometer).toBe(100)
            // Verifica se a composição com EquipmentEntity funcionou
            expect(entity.equipment).toBeDefined()
            expect(entity.modelOrPlate).toBe(props.equipment.modelOrPlate)
        })
    })

    describe('validate', () => {
        it('deve validar com sucesso quando todos os campos obrigatórios estão presentes', () => {
            const props = WorkEquipmentPropsFactory.create()
            entity.modelToEntity(props)

            expect(() => entity.validate(mockChangeErrorFields)).not.toThrow()
        })

        it('deve lançar erro se o operatorMotorist for uma string vazia', () => {
            const props = WorkEquipmentPropsFactory.create({ operatorMotorist: '' })
            entity.modelToEntity(props)

            expect(() => {
                entity.validate(mockChangeErrorFields)
            }).toThrow(/operatorMotorist/)
        })

        it('deve lançar erro se o workId for nulo ou vazio', () => {
            const props = WorkEquipmentPropsFactory.create({ workId: ' ' })
            entity.modelToEntity(props)

            expect(() => {
                entity.validate(mockChangeErrorFields)
            }).toThrow(/id da obra/)
        })

        it('deve propagar erros de validação vindos de RentInformation', () => {
            // Supondo que RentInformation valide se monthlyPayment é positivo
            const props = WorkEquipmentPropsFactory.create({ monthlyPayment: -100 })
            entity.modelToEntity(props)

            expect(() => {
                entity.validate(mockChangeErrorFields)
            }).toThrow(/Entity validation failed/)
        })
    })

    describe('Getters de Composição', () => {
        it('deve retornar dados do equipamento através dos getters da WorkEquipmentEntity', () => {
            const props = WorkEquipmentPropsFactory.create()
            props.equipment.nameProprietary = 'Dono da Máquina'

            entity.modelToEntity(props)

            expect(entity.nameProprietary).toBe('Dono da Máquina')
            expect(entity.isEquipment).toBe(props.equipment.isEquipment)
        })
    })
})
