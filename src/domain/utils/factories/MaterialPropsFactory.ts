import MaterialProps from '../../interfaces/props/MaterialProps'
import { Reference, UserAction } from '../../types'

export class MaterialPropsFactory {
    static create(overrides: Partial<MaterialProps> = {}): MaterialProps {
        return {
            id: 'mat-123',
            name: 'Areia Grossa',
            density: 15,
            value: 8500,
            referenceMaterialCalculation: Reference.VOLUME,
            depositId: 'dep-456',
            serverId: 101,
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
