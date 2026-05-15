import { FuelSupplyTypes, InvoiceStatus, UserAction } from '../../../types'
import { FuelSupplyDto } from '../../fuel-supply/FuelSupplyDto'

export class FuelSupplyDtoFactory {
    static create(overrides: Partial<FuelSupplyDto> = {}): FuelSupplyDto {
        const dto = new FuelSupplyDto()

        const defaultData: Partial<FuelSupplyDto> = {
            // Dados de Abastecimento
            id: 'fuel-123',
            quantity: 50.0,
            valuePerLiter: 6.2,
            value: 310.0,
            description: 'Abastecimento Comboio',
            supplyType: FuelSupplyTypes.EQUIPMENT,
            transportVehicleOrWorkEquipmentId: 'equip-001',
            observation: 'Operação normal',
            isGasStation: false,
            isDiscount: false,
            hourMeterOrOdometer: 1500,

            // Relacionamentos e Metadados
            workId: 'work-789',
            userId: 'user-999',
            enterpriseId: 'ent-888',
            serverId: 505,
            invoiceId: 1010,
            invoiceStatus: InvoiceStatus.PENDING,
            maintenanceTrucksWorkEquipmentId: 'truck-99',
            userAction: UserAction.CREATE,
            isValid: true,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            status: 'active',
        }

        return Object.assign(dto, defaultData, overrides)
    }

    static createMany(count: number, overrides: Partial<FuelSupplyDto> = {}): FuelSupplyDto[] {
        return Array.from({ length: count }, (_, i) => this.create({ id: `fuel-uuid-${i}`, ...overrides }))
    }
}
