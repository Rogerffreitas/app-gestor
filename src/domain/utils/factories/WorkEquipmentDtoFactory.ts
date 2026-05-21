import WorkEquipmentDto from '../../entity/work-equipment/WorkEquipmentDto'
import { EquipmentDtoFactory } from './EquipmentDtoFactory'

export class WorkEquipmentDtoFactory {
    static create(overrides: Partial<WorkEquipmentDto> = {}): WorkEquipmentDto {
        const dto = new WorkEquipmentDto()
        const defaultData: Partial<WorkEquipmentDto> = {
            id: 'work-eq-123',
            equipment: EquipmentDtoFactory.create(), // Gera o equipamento aninhado
            hourMeterOrOdometer: 100,
            startRental: '2026-04-23',
            valuePerHourKm: 50,
            workId: 'work-789',
            userId: 'user-1',
            enterpriseId: 'ent-1',
            isValid: true,
        }
        return Object.assign(dto, defaultData, overrides)
    }
}
