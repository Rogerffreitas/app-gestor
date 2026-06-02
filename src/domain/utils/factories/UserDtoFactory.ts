import UserDto from '../../entity/user/UserDto'

export class UserDtoFactory {
    static create(overrides: Partial<UserDto> = {}): UserDto {
        const dto = new UserDto()
        const defaultData: Partial<UserDto> = {
            id: 'user-uuid-123',
            name: 'João da Silva',
            username: 'joao.silva',
            email: 'joao.silva@empresa.com',
            password: 'hashed_password_default_123',
            profilePic: 'https://storage.local/profiles/joao.png',
            role: 'OPERATOR',
            enterpriseId: 'ent-888',
            serverId: 101,
            isConnected: true,
            isValid: true,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        }

        return Object.assign(dto, defaultData, overrides)
    }

    static createMany(count: number, overrides: Partial<UserDto> = {}): UserDto[] {
        return Array.from({ length: count }, (_, i) =>
            this.create({
                id: `user-uuid-${i}`,
                username: `${overrides.username || 'user'}.${i}`,
                email: overrides.email || `user.${i}@empresa.com`,
                ...overrides,
            })
        )
    }
}
