export default interface DepositDto {
    name: string
    description: string

    enterpriseId: string
    userId: string
    userAction?: number
    serverId?: number
    isValid?: boolean
    id?: string
    createdAt?: number
    updatedAt?: number
    status?: string
}
