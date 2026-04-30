import UserEntity from './UserEntity'

export default class UserDto {
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

    toDto(data: UserEntity) {
        this.id = data.id
        this.name = data.name
        this.username = data.username
        this.email = data.email
        this.password = data.password
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
