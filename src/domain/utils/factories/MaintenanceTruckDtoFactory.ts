import { UserAction } from '../../types'
import { MaintenanceTruckDto } from '../../entity/maintenance-truck/MaintenanceTruckDto'

export class MaintenanceTruckDtoFactory {
    static create(overrides: Partial<MaintenanceTruckDto> = {}): MaintenanceTruckDto {
        const dto = new MaintenanceTruckDto()

        const defaultData: Partial<MaintenanceTruckDto> = {
            // Dados específicos
            capacity: 10000,
            operatorMotorist: 'Carlos Alberto',
            nameProprietary: 'Logística Avançada S.A.',
            modelOrPlate: 'BRA-2E19',
            usersList: 'user-id-01, user-id-02',

            // Relacionamentos
            workEquipmentId: 'equip-comboio-001',
            workId: 'work-789',

            // Metadados e Controle
            userId: 'user-999',
            enterpriseId: 'ent-888',
            serverId: 202,
            userAction: UserAction.CREATE,
            isValid: true,
            id: 'truck-dto-123',
            createdAt: Date.now(),
            updatedAt: Date.now(),
            status: 'active',
        }

        return Object.assign(dto, defaultData, overrides)
    }

    static createMany(count: number, overrides: Partial<MaintenanceTruckDto> = {}): MaintenanceTruckDto[] {
        return Array.from({ length: count }, (_, i) =>
            this.create({
                id: `truck-uuid-${i}`,
                modelOrPlate: `PLT-${1000 + i}`,
                ...overrides,
            })
        )
    }
}
