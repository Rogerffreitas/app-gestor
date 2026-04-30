import { EnterpriseEntity } from '../../entity/enterprise/EnterpriseEntity'
import { FuelSupplyEntity } from '../../entity/fuel-supply/FuelSupplyEntity'
import { InvoiceEntity } from '../../entity/invoice/InvoiceEntity'
import { MaintenanceTruckEntity } from '../../entity/maintenance-truck/MaintenanceTruckEntity'
import { TransportVehicleEntity } from '../../entity/transport-vehicle/TransportVehicleEntity'
import UserEntity from '../../entity/user/UserEntity'
import { WorkEquipmentEntity } from '../../entity/work-equipment/WorkEquipmentEntity'
import WorkEntity from '../../entity/work/WorkEntity'
import { DocDefinitionsTypes, SummaryInvoice } from '../../types'

export default interface DocumentDefinitions {
    docDefinitionSyntheticTransportVehicleInvoice(
        invoices: SummaryInvoice[],
        enterprise: EnterpriseEntity,
        work: WorkEntity
    ): DocDefinitionsTypes
    docDefinitionAnalyticalWorkEquipmentInvoice(
        invoice: InvoiceEntity,
        enterprise: EnterpriseEntity,
        work: WorkEntity,
        users: UserEntity[]
    ): DocDefinitionsTypes

    docDefinitionAnalyticalTransportVehicleInvoice(
        invoice: InvoiceEntity,
        enterprise: EnterpriseEntity,
        work: WorkEntity,
        users: UserEntity[]
    ): DocDefinitionsTypes

    docDefinitionMaintenanceTruckFuelSuppliesAnalytic(
        startDate: number,
        endDate: number,
        maintenanceTruck: MaintenanceTruckEntity,
        fuelSupplies: FuelSupplyEntity[],
        workEquipments: WorkEquipmentEntity[],
        transportVehicles: TransportVehicleEntity[],
        enterprise: EnterpriseEntity,
        work: WorkEntity,
        users: UserEntity[],
        previousBalance: number
    ): DocDefinitionsTypes
}
