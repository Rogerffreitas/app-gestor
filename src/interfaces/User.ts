export default interface User {
    id?: string
    name?: string
    username?: string
    password?: string
    email?: string
    profilePic?: string
    role?: string
    isConnected?: boolean
    isValid?: boolean
    createdAt?: number
    updatedAt?: number
    enterpriseId?: string
}
