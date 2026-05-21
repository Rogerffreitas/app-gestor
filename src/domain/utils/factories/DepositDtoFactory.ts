import DepositDto from '../../entity/deposit/DepositDto'

export class DepositDtoFactory {
    static create(overrides: Partial<DepositDto> = {}): DepositDto {
        const dto = new DepositDto()
        const defaultData: Partial<DepositDto> = {
            id: 'uuid-123',
            name: 'Depósito Central',
            description: 'Armazém principal de materiais',
            enterpriseId: 'ent-888',
            userId: 'user-999',
            userAction: 1,
            serverId: 101,
            isValid: true,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            status: 'active',
        }

        return Object.assign(dto, defaultData, overrides)
    }

    static createMany(count: number, overrides: Partial<DepositDto> = {}): DepositDto[] {
        return Array.from({ length: count }, (_, i) => this.create({ id: `uuid-${i}`, ...overrides }))
    }
}
