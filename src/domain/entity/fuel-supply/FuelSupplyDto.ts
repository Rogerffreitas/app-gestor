import { FuelSupplyTypes, InvoiceStatus, UserAction } from '../../types'
import { FuelSupplyEntity } from './FuelSupplyEntity'

export class FuelSupplyDto {
    quantity: number
    valuePerLiter: number

    description: string
    supplyType: FuelSupplyTypes
    transportVehicleOrWorkEquipmentId: string
    observation: string
    isGasStation: boolean
    isDiscount: boolean
    hourMeterOrOdometer: number

    workId: string
    userId: string
    enterpriseId: string
    serverId?: number
    userAction?: UserAction
    isValid?: boolean
    invoiceId?: number
    invoiceStatus?: InvoiceStatus
    //Deve ser mudado para maintenanceTruckId
    maintenanceTrucksWorkEquipmentId?: string
    value?: number
    id?: string
    createdAt?: number
    updatedAt?: number
    status?: string

    public entityToDto(data: FuelSupplyEntity): FuelSupplyDto {
        this.quantity = +data.quantity
        this.valuePerLiter = +data.valuePerLiter
        this.value = +data.value
        this.description = data.description
        this.supplyType = data.supplyType
        this.transportVehicleOrWorkEquipmentId = data.transportVehicleOrWorkEquipmentId
        this.observation = data.observation
        this.isGasStation = data.isGasStation
        this.maintenanceTrucksWorkEquipmentId = data.maintenanceTrucksWorkEquipmentId
        this.hourMeterOrOdometer = +data.hourMeterOrOdometer
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
        this.createdAt = Number(data.createdAt)
        this.updatedAt = Number(data.createdAt)
        this.status = data.status
        return this
    }
}
