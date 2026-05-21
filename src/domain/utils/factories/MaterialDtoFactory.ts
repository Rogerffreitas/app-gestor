import { Reference, UserAction } from '../../types'
import { MaterialDto } from '../../entity/material/MaterialDto'

export class MaterialDtoFactory {
    static create(overrides: Partial<MaterialDto> = {}): MaterialDto {
        const dto = new MaterialDto()

        const defaultData: Partial<MaterialDto> = {
            // Dados do Material
            name: 'Brita Graduada',
            density: 1.65, // Densidade comum para materiais de base
            referenceMaterialCalculation: Reference.VOLUME, // Assumindo que Reference seja um Enum
            value: 85.5,
            depositId: 'dep-123',

            // Metadados e Controle (AbstractEntity)
            id: 'mat-uuid-123',
            serverId: 606,
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

    static createMany(count: number, overrides: Partial<MaterialDto> = {}): MaterialDto[] {
        return Array.from({ length: count }, (_, i) =>
            this.create({
                id: `mat-uuid-${i}`,
                name: `Material Tipo ${i + 1}`,
                ...overrides,
            })
        )
    }
}
