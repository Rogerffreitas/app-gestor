export interface DiscountEntity {
    id: string
    serverId: number

    description: string
    valeu: number
    type: string
    veiculoId: string
    workId: string
    invoiceId: number
    invoiceStatus: string

    enterpriseId: string
    userId: string
    userAction: number
    isValid: boolean
    createdAt: number
    updatedAt: number
    status: string
}
