import HourMeterMonitoringDto from '../../../../domain/entity/hour-meter-monitoring/HourMeterMonitoringDto'
import { HourMeterMonitoringEntity } from '../../../../domain/entity/hour-meter-monitoring/HourMeterMonitoringEntity'
import { InvoiceStatus } from '../../../../domain/types'

export const hourMeterMonitoringEntity = {
    value: 100,
    date: '28/02/2025',
    initialHourMeterValue: 100,
    currentHourMeterValue: 110,
    totalCalculatedInThePeriodInformed: 10,
    workEquipmentId: 'eq-1',
    workId: 'work-1',
    observation: 'teste',
    enterpriseId: 'enterprise-1',
    userId: 'user-1',
} as HourMeterMonitoringEntity
export const hourMeterMonitoringIDEntity = {
    id: 'id-112',
    value: 100,
    date: '28/02/2025',
    initialHourMeterValue: 100,
    currentHourMeterValue: 110,
    totalCalculatedInThePeriodInformed: 10,
    workEquipmentId: 'eq-1',
    workId: 'work-1',
    observation: 'teste',
    enterpriseId: 'enterprise-1',
    userId: 'user-1',
} as HourMeterMonitoringEntity

export const makeHourMeterMonitoringDtoMock = (
    overrides?: Partial<HourMeterMonitoringDto>
): HourMeterMonitoringDto => {
    const mock = new HourMeterMonitoringDto()

    const data: Partial<HourMeterMonitoringDto> = {
        id: 'uuid-1234-5678',
        date: '2023-10-27',
        initialHourMeterValue: 100,
        currentHourMeterValue: 120,
        totalCalculatedInThePeriodInformed: 20,
        workId: 'work-001',
        enterpriseId: 'enterprise-99',
        userId: 'user-777',
        value: 1500.5,
        serverId: 1,
        observation: 'Monitoramento de rotina sem intercorrências.',
        invoiceId: 5544,
        invoiceStatus: 'PAID' as InvoiceStatus, // Ajuste conforme os valores do seu Enum
        userAction: 1,
        isValid: true,
        status: 'ACTIVE',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        // Mock simplificado do WorkEquipmentDto
        workEquipment: {
            id: 'equip-abc',
            description: 'Escavadeira Hidráulica',
            // Adicione outros campos obrigatórios do seu WorkEquipmentDto aqui
        } as any,
        ...overrides,
    }

    return Object.assign(mock, data)
}
