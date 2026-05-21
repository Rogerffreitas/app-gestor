import WorkRoutesDto from '../../entity/work-routes/WorkRoutesDto'
import { DepositDtoFactory } from './DepositDtoFactory'
import { WorkDtoFactory } from './WorkDtoFactory'

export class WorkRoutesDtoFactory {
    static create(overrides: Partial<WorkRoutesDto> = {}): WorkRoutesDto {
        const dto = new WorkRoutesDto()

        const defaultData: Partial<WorkRoutesDto> = {
            // Localização e Trajeto
            departureLocation: 'Jazida Principal',
            arrivalLocation: 'Frente de Serviço A',
            km: 12.5,
            initialPicket: 450,

            // Valores
            value: 15.75,
            isFixedValue: false,

            // Relacionamentos Complexos
            work: WorkDtoFactory.create(),
            deposit: DepositDtoFactory.create(),

            // Metadados e Controle
            id: 'route-uuid-123',
            serverId: 505,
            userId: 'user-999',
            enterpriseId: 'ent-888',
            userAction: 1, // UserAction.CREATE
            isValid: true,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            status: 'active',
        }

        return Object.assign(dto, defaultData, overrides)
    }

    static createMany(count: number, overrides: Partial<WorkRoutesDto> = {}): WorkRoutesDto[] {
        return Array.from({ length: count }, (_, i) =>
            this.create({
                id: `route-uuid-${i}`,
                departureLocation: `Jazida 0${i + 1}`,
                ...overrides,
            })
        )
    }
}
