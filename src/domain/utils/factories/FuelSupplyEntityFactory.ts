import { FuelSupplyTypes, InvoiceStatus, UserAction } from '../../types'
import { FuelSupplyEntity } from '../../entity/fuel-supply/FuelSupplyEntity'

export class FuelSupplyEntityFactory {
    static create(overrides: Partial<FuelSupplyEntity> = {}): FuelSupplyEntity {
        const entity = new FuelSupplyEntity()

        const defaultData: any = {
            _quantity: 6000,
            _valuePerLiter: 550,
            _value: 33000, // 60 * 5.50 (ou conforme cálculo da sua regra de negócio)
            _description: 'Abastecimento de Escavadeira',
            _supplyType: FuelSupplyTypes.EQUIPMENT,
            _transportVehicleOrWorkEquipmentId: 'equip-123',
            _observation: 'Abastecimento em campo',
            _isGasStation: false,
            _maintenanceTrucksWorkEquipmentId: 'truck-999',
            _hourMeterOrOdometer: 2450,
            _isDiscount: false,
            _invoiceId: 4545,
            _invoiceStatus: InvoiceStatus.PENDING,
            _workId: 'work-abc',

            // Propriedades herdadas da AbstractEntity
            id: 'fuel-entity-123',
            serverId: 101,
            userId: 'user-999',
            enterpriseId: 'ent-888',
            userAction: UserAction.CREATE,
            isValid: true,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            status: 'active',
        }

        return Object.assign(entity, defaultData, overrides)
    }

    static createMany(count: number, overrides: Partial<FuelSupplyEntity> = {}): FuelSupplyEntity[] {
        return Array.from({ length: count }, (_, i) =>
            this.create({
                id: `fuel-entity-uuid-${i}`,
                ...overrides,
            } as any)
        )
    }
}
