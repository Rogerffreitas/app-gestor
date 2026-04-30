import DiscountDto from '../discount/DiscountDto'
import { FuelSupplyDto } from '../fuel-supply/FuelSupplyDto'
import HourMeterMonitoringDto from '../hour-meter-monitoring/HourMeterMonitoringDto'
import MaterialTransportDto from '../material-transport/MaterialTransportDto'
import { InvoiceEntity } from './InvoiceEntity'
import TransportVehicleDto from '../transport-vehicle/TransportVehicleDto'
import WorkEquipmentDto from '../work-equipment/WorkEquipmentDto'
import { InvoiceStatus } from '../../types'

export class InvoiceDto {
    startDate: number
    endDate: number
    invoiceType: string
    invoiceStatus: InvoiceStatus
    workId: string
    transportVehicleOrWorkEquipment: TransportVehicleDto | WorkEquipmentDto
    description: string
    modelOrPlate: string
    dataList: MaterialTransportDto[] | HourMeterMonitoringDto[]
    discountsList: DiscountDto[]
    fuelSupliesList: FuelSupplyDto[]

    id?: string
    serverId?: number
    userId: string
    userAction?: number
    enterpriseId: string
    isValid?: boolean

    bank: string | null
    beneficiary: string | null
    agency: string | null
    account: string | null
    pix: string | null

    createdAt?: number
    updatedAt?: number

    public entityToDto(entity: InvoiceEntity): InvoiceDto {
        this.startDate = entity.startDate
        this.endDate = entity.endDate
        this.invoiceType = entity.invoiceType
        this.invoiceStatus = entity.invoiceStatus
        this.workId = entity.workId

        this.description = entity.description
        this.modelOrPlate = entity.modelOrPlate

        this.id = entity.id
        this.serverId = entity.serverId
        this.userId = entity.userId
        this.userAction = entity.userAction
        this.enterpriseId = entity.enterpriseId
        this.isValid = entity.isValid
        this.createdAt = entity.createdAt
        this.updatedAt = entity.updatedAt

        if (entity.bankInformation) {
            this.bank = entity.bankInformation.bank
            this.beneficiary = entity.bankInformation.beneficiary
            this.agency = entity.bankInformation.agency
            this.account = entity.bankInformation.account
            this.pix = entity.bankInformation.pix
        }

        this.transportVehicleOrWorkEquipment = entity.transportVehicleOrWorkEquipment
        this.discountsList = entity.discountsList
        this.fuelSupliesList = entity.fuelSupliesList
        this.dataList = entity.dataList

        return this
    }
}
