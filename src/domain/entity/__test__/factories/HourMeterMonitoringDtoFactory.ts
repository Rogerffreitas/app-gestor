import { InvoiceStatus } from '../../../types'
import HourMeterMonitoringDto from '../../hour-meter-monitoring/HourMeterMonitoringDto'
import { WorkEquipmentDtoFactory } from './WorkEquipmentDtoFactory'

export class HourMeterMonitoringDtoFactory {
    static create(overrides: Partial<HourMeterMonitoringDto> = {}): HourMeterMonitoringDto {
        const dto = new HourMeterMonitoringDto()
        const defaultData: Partial<HourMeterMonitoringDto> = {
            id: 'monitor-123',
            date: new Date().toISOString(),
            initialHourMeterValue: 100,
            currentHourMeterValue: 110,
            totalCalculatedInThePeriodInformed: 10,
            workEquipment: WorkEquipmentDtoFactory.create(),
            workId: 'work-789',
            userId: 'user-1',
            enterpriseId: 'ent-1',
            invoiceStatus: InvoiceStatus.PENDING,
            status: 'active',
            isValid: true,
            createdAt: Date.now(),
        }

        return Object.assign(dto, defaultData, overrides)
    }
}
