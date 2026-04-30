import { DiscountTypes, InvoiceStatus, UserAction } from '../../types'

export default class DiscountProps {
    description: string
    value: number
    discountType: DiscountTypes
    transportVehicleOrWorkEquipmentId: string
    workId: string

    invoiceId: number
    invoiceStatus: InvoiceStatus

    serverId: number
    id: string
    userId: string
    userAction: UserAction
    enterpriseId: string
    isValid: boolean
    createdAt: number
    updatedAt: number
    status: string
}
