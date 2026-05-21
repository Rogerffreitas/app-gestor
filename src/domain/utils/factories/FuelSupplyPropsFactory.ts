import FuelSupplyProps from '../../interfaces/props/FuelSupplyProps'
import { FuelSupplyTypes, InvoiceStatus, UserAction } from '../../types'

export class FuelSupplyPropsFactory {
    static create(overrides: Partial<FuelSupplyProps> = {}): FuelSupplyProps {
        return {
            // Dados de Abastecimento
            quantity: 50.5,
            valuePerLiter: 5.89,
            value: 297.45,
            description: 'Abastecimento de rotina',
            supplyType: FuelSupplyTypes.EQUIPMENT, // Altere conforme seus Enums
            transportVehicleOrWorkEquipmentId: 'vehicle-123',
            observation: 'Tanque cheio',
            isGasStation: true,
            maintenanceTrucksWorkEquipmentId: 'truck-456',
            hourMeterOrOdometer: 15000,
            isDiscount: false,

            // Relacionamentos e Notas
            invoiceId: 999,
            invoiceStatus: InvoiceStatus.PAID, // Altere conforme seus Enums
            workId: 'work-789',

            // Propriedades herdadas de AbstractEntity
            id: 'fuel-supply-123',
            serverId: 101,
            userId: 'user-001',
            enterpriseId: 'ent-001',
            userAction: UserAction.CREATE,
            isValid: true,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            status: 'active',

            // Sobrescrita de valores
            ...overrides,
        }
    }
}
