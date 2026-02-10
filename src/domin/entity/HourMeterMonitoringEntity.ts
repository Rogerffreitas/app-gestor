export default interface HourMeterMonitoring {
    date: string
    initialHourMeterValue: number
    currentHourMeterValue: number
    observacao: string
    totalCalculatedInThePeriodInformed: number
    value: number
    invoiceId: number
    invoiceStatus: string
    workEquipmentId: string
    workId: string
    enterpriseId: string
    userId: string
    userAction: number
    isValid: boolean
    createdAt: number
    updatedAt: number
    status: string
}
