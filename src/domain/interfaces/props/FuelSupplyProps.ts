import { UserAction, FuelSupplyTypes, InvoiceStatus } from '../../types'

export default interface FuelSupplyProps {
    // Dados de Abastecimento
    quantity: number
    valuePerLiter: number
    value: number
    description: string
    supplyType: FuelSupplyTypes
    transportVehicleOrWorkEquipmentId: string
    observation: string
    isGasStation: boolean
    maintenanceTrucksWorkEquipmentId: string
    hourMeterOrOdometer: number
    isDiscount: boolean

    // Relacionamentos e Notas
    invoiceId: number
    invoiceStatus: InvoiceStatus
    workId: string

    // Propriedades herdadas de AbstractEntity
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
