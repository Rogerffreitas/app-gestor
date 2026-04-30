import { InvoiceStatus } from '../../types'
import WorkEquipmentDto from '../work-equipment/WorkEquipmentDto'
import { HourMeterMonitoringEntity } from './HourMeterMonitoringEntity'

export default class HourMeterMonitoringDto {
    date: string
    initialHourMeterValue: number
    currentHourMeterValue: number
    workEquipment: WorkEquipmentDto
    workId: string
    enterpriseId: string
    userId: string
    value?: number
    totalCalculatedInThePeriodInformed?: number
    id?: string
    serverId?: number
    observation?: string
    invoiceId?: number
    invoiceStatus?: InvoiceStatus
    userAction?: number
    isValid?: boolean
    createdAt?: number
    updatedAt?: number
    status?: string

    public entityToDto(data: HourMeterMonitoringEntity): HourMeterMonitoringDto {
        this.date = data.date
        this.initialHourMeterValue = data.initialHourMeterValue ?? 0
        this.currentHourMeterValue = data.currentHourMeterValue ?? 0
        this.totalCalculatedInThePeriodInformed = data.totalCalculatedInThePeriodInformed
        this.workEquipment = new WorkEquipmentDto().entityToDto(data.workEquipment)
        this.value = data.value
        this.invoiceId = data.invoiceId
        this.invoiceStatus = data.invoiceStatus
        this.workId = data.workId
        this.serverId = data.serverId
        this.userId = data.userId
        this.userAction = data.userAction
        this.enterpriseId = data.enterpriseId
        this.isValid = data.isValid
        this.id = data.id
        this.createdAt = Number(data.createdAt)
        this.updatedAt = Number(data.updatedAt)
        this.status = data.status
        return this
    }
}
