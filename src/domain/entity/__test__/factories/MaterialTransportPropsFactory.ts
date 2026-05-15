import MaterialTransportProps from '../../../interfaces/props/MaterialTransportProps'
import { InvoiceStatus, UserAction } from '../../../types'
import { MaterialPropsFactory } from './MaterialPropsFactory'
import { TransportVehiclePropsFactory } from './TransportVehiclePropsFactory'
import { WorkRoutesPropsFactory } from './WorkRoutesPropsFactory'

export class MaterialTransportPropsFactory {
    static create(overrides: Partial<MaterialTransportProps> = {}): MaterialTransportProps {
        const defaultData: MaterialTransportProps = {
            // Relacionamentos Complexos (Usando outras factories para composição)
            route: WorkRoutesPropsFactory.create(),
            transportVehicle: TransportVehiclePropsFactory.create(),
            material: MaterialPropsFactory.create(),

            // Dados do Transporte
            value: 1250.75,
            isReferenceCapacity: true,
            quantity: 15.0,
            deliveryPicket: 'Estaca 45',
            totalPickets: 120,
            distanceTraveledWithinTheWork: 4.5,
            observation: 'Transporte de brita para o setor norte',

            // Faturamento e Obra
            invoiceId: 202401,
            invoiceStatus: InvoiceStatus.PENDING,
            workId: 'work-789',

            // Propriedades da AbstractEntity
            id: 'transport-uuid-123',
            serverId: 707,
            userId: 'user-999',
            userAction: UserAction.CREATE,
            enterpriseId: 'ent-888',
            isValid: true,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            status: 'active',
        }

        return Object.assign({}, defaultData, overrides)
    }

    static createMany(
        count: number,
        overrides: Partial<MaterialTransportProps> = {}
    ): MaterialTransportProps[] {
        return Array.from({ length: count }, (_, i) =>
            this.create({
                id: `transport-uuid-${i}`,
                ...overrides,
            })
        )
    }
}
