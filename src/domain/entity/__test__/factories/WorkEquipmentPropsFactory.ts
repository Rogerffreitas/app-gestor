import EquipmentProps from '../../../interfaces/props/EquipmentProps'
import WorkEquipmentProps from '../../../interfaces/props/WorkEquipmentProps'
import { UserAction } from '../../../types'

export class WorkEquipmentPropsFactory {
    static create(overrides: Partial<WorkEquipmentProps> = {}): WorkEquipmentProps {
        return {
            id: 'work-eq-123',
            serverId: 500,
            workId: 'obra-789',
            operatorMotorist: 'Ricardo Motorista',

            // Dados de Aluguel
            hourMeterOrOdometer: 100,
            startRental: '2026-04-01',
            monthlyPayment: 2500,
            valuePerHourKm: 45,
            valuePerDay: 200,

            // Composição
            equipment: {} as EquipmentProps,

            // Metadados
            userId: 'user-1',
            enterpriseId: 'ent-1',
            userAction: UserAction.CREATE,
            isValid: true,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            status: 'active',
            ...overrides,
        }
    }
}
