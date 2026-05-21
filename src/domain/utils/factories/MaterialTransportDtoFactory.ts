import { InvoiceStatus } from '../../types'
import MaterialTransportDto from '../../entity/material-transport/MaterialTransportDto'
import { MaterialDtoFactory } from './MaterialDtoFactory'
import { TransportVehicleDtoFactory } from './TransportVehicleDtoFactory'
import { WorkRoutesDtoFactory } from './WorkRoutesDtoFactory'

export class MaterialTransportDtoFactory {
    static create(overrides: Partial<MaterialTransportDto> = {}): MaterialTransportDto {
        const dto = new MaterialTransportDto()

        const defaultData: Partial<MaterialTransportDto> = {
            // Objetos Aninhados (Relacionamentos)
            workRoutes: WorkRoutesDtoFactory.create(),
            transportVehicle: TransportVehicleDtoFactory.create(),
            material: MaterialDtoFactory.create(),

            // Dados de Transporte
            quantity: 20.5,
            deliveryPicket: 'Estaca 150',
            totalPickets: 300,
            observation: 'Transporte realizado via acesso secundário',
            value: 850.0,
            isReferenceCapacity: true,
            distanceTraveledWithinTheWork: 12.5,

            // IDs e Localização
            workId: 'work-999',
            userId: 'user-1',
            enterpriseId: 'ent-1',
            serverId: 404,

            // Metadados e Controle
            userAction: 1, // UserAction.CREATE ou similar
            isValid: true,
            invoiceId: 555666,
            invoiceStatus: InvoiceStatus.PENDING,
            id: 'transport-dto-uuid',
            createdAt: Date.now(),
            updatedAt: Date.now(),
            status: 'active',
        }

        return Object.assign(dto, defaultData, overrides)
    }

    static createMany(count: number, overrides: Partial<MaterialTransportDto> = {}): MaterialTransportDto[] {
        return Array.from({ length: count }, (_, i) =>
            this.create({
                id: `transport-dto-uuid-${i}`,
                ...overrides,
            })
        )
    }
}
