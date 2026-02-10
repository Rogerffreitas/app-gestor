export default interface DepositDto {
    name: string
    description: string

    serverId: number
    userId: string
    userAction: number
    enterpriseId: string
    isValid: boolean
    id?: string
    createdAt?: number
    updatedAt?: number
    status?: string
}
