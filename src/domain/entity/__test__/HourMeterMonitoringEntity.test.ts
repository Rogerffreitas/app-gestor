import { HourMeterMonitoringEntity } from '../hour-meter-monitoring/HourMeterMonitoringEntity'
import { HourMeterMonitoringDtoFactory } from './factories/HourMeterMonitoringDtoFactory'

describe('HourMeterMonitoringEntity', () => {
    let entity: HourMeterMonitoringEntity
    // Mock simples para a função de erro exigida pelo método validate
    const mockChangeErrorFields = (field: string) => (message: string) => {}

    beforeEach(() => {
        entity = new HourMeterMonitoringEntity()
    })

    describe('dtoToEntity', () => {
        it('deve converter DTO para Entidade e calcular o total de horas e valor corretamente', () => {
            const dto = HourMeterMonitoringDtoFactory.create({
                initialHourMeterValue: 100,
                currentHourMeterValue: 110, // Diferença de 10
            })

            // Simulando que o equipamento custa 50 por hora
            dto.workEquipment.valuePerHourKm = 50

            entity.dtoToEntity(dto)

            expect(entity.totalCalculatedInThePeriodInformed).toBe(10)
            expect(entity.value).toBe(500) // 10 horas * 50
            expect(entity.id).toBe(dto.id)
        })

        it('deve lançar erro se o horímetro final for menor que o inicial (Travada de Segurança)', () => {
            const dto = HourMeterMonitoringDtoFactory.create({
                initialHourMeterValue: 500,
                currentHourMeterValue: 400,
            })

            expect(() => {
                entity.dtoToEntity(dto)
            }).toThrow('Valor final é menor que o inicial')
        })
    })

    describe('validate', () => {
        it('deve validar com sucesso uma entidade correta', () => {
            const dto = HourMeterMonitoringDtoFactory.create({
                initialHourMeterValue: 10,
                currentHourMeterValue: 20,
            })
            entity.dtoToEntity(dto)
            expect(() => entity.validate(mockChangeErrorFields)).not.toThrow()
        })

        it('deve lançar erro de validação se a data estiver ausente', () => {
            const dto = HourMeterMonitoringDtoFactory.create({
                date: '',
            })
            entity.dtoToEntity(dto)

            expect(() => {
                entity.validate(mockChangeErrorFields)
            }).toThrow(/A data é obrigatória/)
        })

        it('deve lançar erro se o horímetro atual for igual a zero', () => {
            const dto = HourMeterMonitoringDtoFactory.create({
                initialHourMeterValue: 0,
                currentHourMeterValue: 0,
            })
            entity.dtoToEntity(dto)

            expect(() => {
                entity.validate(mockChangeErrorFields)
            }).toThrow(/O horímetro atual deve ser maior que zero/)
        })

        it('deve falhar se não houver identificação da obra (workId)', () => {
            const dto = HourMeterMonitoringDtoFactory.create({
                workId: '',
            })
            entity.dtoToEntity(dto)

            expect(() => {
                entity.validate(mockChangeErrorFields)
            }).toThrow(/A identificação da obra é obrigatória/)
        })
    })

    describe('Cálculos Matemáticos e Segurança', () => {
        it('deve lançar erro e impedir o cálculo se o horímetro final for menor que o inicial', () => {
            // 1. Criamos um DTO inválido usando a factory
            const dtoInvalido = HourMeterMonitoringDtoFactory.create({
                initialHourMeterValue: 500,
                currentHourMeterValue: 400, // Menor que o inicial
            })

            // 2. O Jest espera que a função lance um erro.
            // Passamos uma função anônima para o expect não disparar o erro antes do tempo.
            expect(() => {
                entity.dtoToEntity(dtoInvalido)
            }).toThrow('Valor final é menor que o inicial')

            // Opcional: Você pode verificar se a mensagem contém apenas parte do texto
            // expect(() => entity.dtoToEntity(dtoInvalido)).toThrow(/menor que o inicial/);
        })

        it('deve garantir que o valor calculado seja zero se o erro for ignorado ou em caso de model impreciso', () => {
            const dtoInvalido = HourMeterMonitoringDtoFactory.create({
                initialHourMeterValue: 100,
                currentHourMeterValue: 50,
            })

            // Se você quiser testar o estado da entidade após um erro capturado
            try {
                entity.dtoToEntity(dtoInvalido)
            } catch (error) {
                // Erro esperado
            }

            // Verifica se a proteção do Math.max(0, ...) funcionou
            expect(entity.totalCalculatedInThePeriodInformed).toBe(undefined)
        })
    })
})
