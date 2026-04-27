import { HourMeterMonitoringEntity } from '../HourMeterMonitoringEntity'

jest.mock('./../../work-equipment/WorkEquipmentEntity', () => ({
    WorkEquipmentEntity: {
        dtoToEntity: jest.fn().mockReturnValue({
            id: 'eq-123',
            valuePerHourKm: 100,
        }),
    },
}))

const validDto = {
    date: '2023-10-27',
    initialHourMeterValue: 10,
    currentHourMeterValue: 20,
    observation: 'Teste de observação',
    workId: 'work-abc',
    userId: 'user-01',
    enterpriseId: 'ent-01',
    workEquipment: { id: 'eq-123' } as any,
}

describe('HourMeterMonitoringEntity', () => {
    const mockChangeErrorFields = (field: string) => jest.fn()

    describe('dtoToEntity', () => {
        it('deve converter DTO para Entidade e calcular o total corretamente', () => {
            const entity = HourMeterMonitoringEntity.dtoToEntity(validDto)

            expect(entity.date).toBe(validDto.date)
            // Cálculo: 20 (current) - 10 (initial) = 10
            expect(entity.totalCalculatedInThePeriodInformed).toBe(10)
            // Valor: 10 (total) * 100 (valor mockado por hora) = 1000
            expect(entity.value).toBe(1000)
            expect(entity.workId).toBe(validDto.workId)
        })

        it('deve garantir que o totalCalculated nunca seja negativo', () => {
            const dtoComErro = { ...validDto, initialHourMeterValue: 50, currentHourMeterValue: 10 }
            expect(() => {
                HourMeterMonitoringEntity.dtoToEntity(dtoComErro)
            }).toThrow('Valor final é menor que o inicial')
        })
    })

    describe('validate', () => {
        it('deve retornar vazio quando a entidade é válida', () => {
            const entity = HourMeterMonitoringEntity.dtoToEntity(validDto)
            const errors = entity.validate!(mockChangeErrorFields)

            expect(errors.length).toBe(0)
        })

        it('deve validar campos obrigatórios ausentes', () => {
            const entity = new HourMeterMonitoringEntity()
            expect(() => {
                const errors = entity.validate(mockChangeErrorFields)
                const fieldsExpected = ['date', 'workId', 'workEquipmentId']
                fieldsExpected.forEach((field) => {
                    expect(errors.some((e) => e.field === field)).toBeTruthy()
                })
            }).toThrow('Entity validation failed')
        })

        it('deve validar se o horímetro atual igual ao inicial', () => {
            const entity = HourMeterMonitoringEntity.dtoToEntity({
                ...validDto,
                initialHourMeterValue: 100,
                currentHourMeterValue: 100,
            })

            const errors = entity.validate!(mockChangeErrorFields)

            expect(errors.length).toBe(0)
        })
    })
})
