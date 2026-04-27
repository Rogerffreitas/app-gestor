import { DiscountTypes, InvoiceStatus, UserAction } from '../../../types'
import DiscountEntity from './DiscountEntity'

export default class DiscountDto {
    description: string
    value: number
    discountType: DiscountTypes
    transportVehicleOrWorkEquipmentId: string
    workId: string
    enterpriseId: string
    userId: string
    serverId?: number
    userAction?: UserAction
    isValid?: boolean
    invoiceId?: number
    invoiceStatus?: InvoiceStatus
    id?: string
    createdAt?: number
    updatedAt?: number
    status?: string

    public entityToDto?(data: DiscountEntity): DiscountDto {
        this.value = data.value
        this.description = data.description
        this.discountType = data.discountType
        this.transportVehicleOrWorkEquipmentId = data.transportVehicleOrWorkEquipmentId
        this.invoiceId = data.invoiceId
        this.invoiceStatus = data.invoiceStatus
        this.workId = data.workId
        this.serverId = data.serverId
        this.userId = data.userId
        this.userAction = data.userAction
        this.enterpriseId = data.enterpriseId
        this.isValid = data.isValid
        this.id = data.id
        this.createdAt = data.createdAt
        this.updatedAt = data.updatedAt
        this.status = data.status
        return this
    }
}
