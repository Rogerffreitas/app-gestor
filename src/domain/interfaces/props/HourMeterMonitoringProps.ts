import { UserAction, InvoiceStatus } from '../../types'
import WorkEquipmentProps from './WorkEquipmentProps'

export default interface HourMeterMonitoringProps {
    // Relacionamento Complexo
    workEquipment: WorkEquipmentProps

    // Dados de Monitoramento
    date: string
    initialHourMeterValue: number
    currentHourMeterValue: number
    totalCalculatedInThePeriodInformed: number
    workId: string
    value: number
    observation?: string

    // Faturamento/Invoice
    invoiceId?: number
    invoiceStatus?: InvoiceStatus

    // Propriedades da AbstractEntity
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
