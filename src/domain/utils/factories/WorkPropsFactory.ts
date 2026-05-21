import WorkProps from '../../interfaces/props/WorkProps'
import { UserAction } from '../../types'

export class WorkPropsFactory {
    static create(overrides: Partial<WorkProps> = {}): WorkProps {
        return {
            id: 'work-123',
            name: 'Edifício Central',
            description: 'Construção de fundação e pilares',
            pickets: 150,
            usersList: 'user-1,user-2',
            serverId: 303,
            userId: 'user-admin',
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
