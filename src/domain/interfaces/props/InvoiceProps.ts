import { BankInformation } from '../../entity/bank-information/BankInformation'
import DiscountEntity from '../../entity/discount/DiscountEntity'
import { FuelSupplyEntity } from '../../entity/fuel-supply/FuelSupplyEntity'
import { HourMeterMonitoringEntity } from '../../entity/hour-meter-monitoring/HourMeterMonitoringEntity'
import { MaterialTransportEntity } from '../../entity/material-transport/MaterialTransportEntity'
import { TransportVehicleEntity } from '../../entity/transport-vehicle/TransportVehicleEntity'
import { WorkEquipmentEntity } from '../../entity/work-equipment/WorkEquipmentEntity'
import { InvoiceStatus } from '../../types'

export interface InvoiceProps {
    id: string | undefined
    serverId: number | undefined
    startDate: number
    endDate: number
    invoiceType: string
    invoiceStatus: InvoiceStatus
    workId: string
    bankInformation: BankInformation
    transportVehicleOrWorkEquipment: TransportVehicleEntity | WorkEquipmentEntity
    description: string
    modelOrPlate: string
    dataList: MaterialTransportEntity[] | HourMeterMonitoringEntity[]
    discountsList: DiscountEntity[]
    fuelSupliesList: FuelSupplyEntity[]
    createdAt: number
    updatedAt: number
}
