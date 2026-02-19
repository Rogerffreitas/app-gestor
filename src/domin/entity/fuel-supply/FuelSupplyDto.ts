import { UserAction } from '../../../types'
import { FuelSupplyEntity } from './FuelSupplyEntity'

export class FuelSupplyDto {
    quantity: number
    valuePerLiter: number

    description: string
    type: string
    transportVehicleOrWorkEquipmentId: string
    observation: string
    isGasStation: boolean
    isDiscount: boolean
    hourMeterOrKmMeter: number

    workId: string
    userId: string
    enterpriseId: string
    serverId?: number
    userAction?: UserAction
    isValid?: boolean
    invoiceId?: number
    invoiceStatus?: string
    maintenanceTrucksWorkEquipmentId?: string
    value?: number
    id?: string
    createdAt?: number
    updatedAt?: number
    status?: string

    public static entityToDto?(data: FuelSupplyEntity): FuelSupplyDto {
        const dto = new FuelSupplyDto()
        dto.quantity = data.quantity
        dto.valuePerLiter = data.valuePerLiter
        dto.value = data.value
        dto.description = data.description
        dto.type = data.type
        dto.transportVehicleOrWorkEquipmentId = data.transportVehicleOrEquipmentId
        dto.observation = data.observation
        dto.isGasStation = data.isGasStation
        dto.maintenanceTrucksWorkEquipmentId = data.maintenanceTrucksWorkEquipmentId
        dto.hourMeterOrKmMeter = data.hourMeterOrKmMeter
        dto.isDiscount = data.isDiscount
        dto.invoiceId = data.invoiceId
        dto.invoiceStatus = data.invoiceStatus
        dto.workId = data.workId
        dto.serverId = data.serverId
        dto.userId = data.userId
        dto.userAction = data.userAction
        dto.enterpriseId = data.enterpriseId
        dto.isValid = data.isValid
        dto.id = data.id
        dto.createdAt = data.createdAt
        dto.updatedAt = data.updatedAt
        dto.status = data.status
        return dto
    }
}
