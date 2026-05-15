import MaintenanceTruckProps from '../../../interfaces/props/MaintenanceTruckProps'
import { UserAction } from '../../../types'

export class MaintenanceTruckPropsFactory {
    static create(overrides: Partial<MaintenanceTruckProps> = {}): MaintenanceTruckProps {
        const defaultData: MaintenanceTruckProps = {
            // Dados específicos do Caminhão de Manutenção/Comboio
            capacity: 5000.0,
            operatorMotorist: 'João Motorista',
            nameProprietary: 'Transportes Transvias Ltda',
            modelOrPlate: 'ABC-1234',
            usersList: 'user-1,user-2,user-3',
            workEquipmentId: 'equip-truck-001',
            workId: 'work-789',

            // Propriedades herdadas de AbstractEntity
            id: 'maint-truck-123',
            serverId: 303,
            userId: 'user-999',
            enterpriseId: 'ent-888',
            userAction: UserAction.CREATE,
            isValid: true,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            status: 'active',
        }

        // Para interfaces, o Object.assign é feito em um objeto vazio ou no defaultData
        return Object.assign({}, defaultData, overrides)
    }

    static createMany(
        count: number,
        overrides: Partial<MaintenanceTruckProps> = {}
    ): MaintenanceTruckProps[] {
        return Array.from({ length: count }, (_, i) =>
            this.create({
                id: `maint-uuid-${i}`,
                modelOrPlate: `PLATE-${i}`,
                ...overrides,
            })
        )
    }
}
