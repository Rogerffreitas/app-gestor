import UserDto from './UserDto'

export default class UserEntity {
    name: string
    username: string
    email: string
    password: string
    profilePic: string
    role: string
    enterpriseId: string
    id: string | undefined
    serverId: number | undefined
    isConnected: boolean | undefined
    isValid: boolean | undefined
    createdAt: number | undefined
    updatedAt: number | undefined

    toEntity(data: UserDto, passwordEncrypted: string) {
        this.id = data.id
        this.name = data.name
        this.username = data.username
        this.email = data.email
        this.password = passwordEncrypted
        this.role = data.role
        this.enterpriseId = data.enterpriseId
        this.profilePic = data.profilePic
        this.serverId = data.serverId
        this.isValid = data.isValid
        this.isConnected = data.isConnected
        this.createdAt = data.createdAt
        this.updatedAt = data.updatedAt
        return this
    }
}
