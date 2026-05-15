import { UserAction } from '../../../types'
import WorkDto from '../../work/WorkDto'

export class WorkDtoFactory {
    static create(overrides: Partial<WorkDto> = {}): WorkDto {
        const dto = new WorkDto()

        const defaultData: Partial<WorkDto> = {
            // Dados da Obra
            name: 'Pavimentação Rodovia BR-101',
            description: 'Obra de duplicação e pavimentação asfáltica',
            pickets: 1500,
            usersList: 'user-001, user-002, user-005',

            // Metadados e Controle
            id: 'work-uuid-abc',
            serverId: 909,
            userId: 'user-999',
            enterpriseId: 'ent-888',
            userAction: UserAction.CREATE,
            isValid: true,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            status: 'active',
        }

        return Object.assign(dto, defaultData, overrides)
    }

    static createMany(count: number, overrides: Partial<WorkDto> = {}): WorkDto[] {
        return Array.from({ length: count }, (_, i) =>
            this.create({
                id: `work-uuid-${i}`,
                name: `Obra Setor ${i + 1}`,
                ...overrides,
            })
        )
    }
}
