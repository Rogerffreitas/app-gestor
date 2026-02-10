import { UserAction } from '../../../types'
import { FuelSupplyEntity } from './FuelSupplyEntity'

export class FuelSupplyDto {
    quantity: number
    valuePerLiter: number

    description: string
    type: string
    transportVehicleOrEquipmentId: string
    observation: string
    isGasStation: boolean
    maintenanceTrucksWorkEquipmentId: string
    hourMeterOrKmMeter: number
    isDiscount: boolean
    invoiceId: number
    invoiceStatus: string

    workId: string
    serverId: number
    userId: string
    userAction: UserAction
    enterpriseId: string
    isValid: boolean
    value?: number
    id?: string
    createdAt?: number
    updatedAt?: number
    status?: string

    public entityToDto?(data: FuelSupplyEntity): FuelSupplyDto {
        this.quantity = data.quantity
        this.valuePerLiter = data.valuePerLiter
        this.value = data.value
        this.description = data.description
        this.type = data.type
        this.transportVehicleOrEquipmentId = data.transportVehicleOrEquipmentId
        this.observation = data.observation
        this.isGasStation = data.isGasStation
        this.maintenanceTrucksWorkEquipmentId = data.maintenanceTrucksWorkEquipmentId
        this.hourMeterOrKmMeter = data.hourMeterOrKmMeter
        this.isDiscount = data.isDiscount
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
