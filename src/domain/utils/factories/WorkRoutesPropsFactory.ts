import WorkRoutesProps from '../../interfaces/props/WorkRoutesProps'
import { UserAction } from '../../types'
import { WorkPropsFactory } from './WorkPropsFactory'

export class WorkRoutesPropsFactory {
    static create(overrides: Partial<WorkRoutesProps> = {}): WorkRoutesProps {
        return {
            id: 'route-123',
            arrivalLocation: 'Canteiro Norte',
            departureLocation: 'Jazida 01',
            km: 15.5,
            initialPicket: 10,
            value: 450.0,
            isFixedValue: false,
            // Composição obrigatória
            work: WorkPropsFactory.create({ pickets: 100 }),
            deposit: { id: 'dep-1', name: 'Deposito Central' } as any,
            serverId: 404,
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
