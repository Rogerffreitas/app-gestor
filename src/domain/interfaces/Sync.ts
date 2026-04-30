import DepositDto from '../entity/deposit/DepositDto'
import DiscountDto from '../entity/discount/DiscountDto'
import EquipmentDto from '../entity/equipment/EquipmentDto'
import { FuelSupplyDto } from '../entity/fuel-supply/FuelSupplyDto'
import HourMeterMonitoringDto from '../entity/hour-meter-monitoring/HourMeterMonitoringDto'
import { MaintenanceTruckDto } from '../entity/maintenance-truck/MaintenanceTruckDto'
import MaterialTransportDto from '../entity/material-transport/MaterialTransportDto'
import { MaterialDto } from '../entity/material/MaterialDto'
import TransportVehicleDto from '../entity/transport-vehicle/TransportVehicleDto'
import WorkEquipmentDto from '../entity/work-equipment/WorkEquipmentDto'
import WorkRoutesDto from '../entity/work-routes/WorkRoutesDto'
import WorkDto from '../entity/work/WorkDto'

export interface SyncPullResponse {
    works: ChangeSet<WorkDto>
    deposits: ChangeSet<DepositDto>
    materials: ChangeSet<MaterialDto>
    workRoutes: ChangeSet<WorkRoutesDto>
    transportVehicles: ChangeSet<TransportVehicleDto>
    equipments: ChangeSet<EquipmentDto>
    workEquipments: ChangeSet<WorkEquipmentDto>
    maintenanceTrucks: ChangeSet<MaintenanceTruckDto>
    materialTransports: ChangeSet<MaterialTransportDto>
    discounts: ChangeSet<DiscountDto>
    fuelSupplies: ChangeSet<FuelSupplyDto>
    hourMeterMonitorings: ChangeSet<HourMeterMonitoringDto>
}

interface ChangeSet<T = any> {
    created: T[]
    updated: T[]
    deleted: T[]
}

export interface SyncPushRequest {
    works: ChangeSet<WorkDto>
    deposits: ChangeSet<DepositDto>
    materials: ChangeSet<MaterialDto>
    workRoutes: ChangeSet<WorkRoutesDto>
    transportVehicles: ChangeSet<TransportVehicleDto>
    equipments: ChangeSet<EquipmentDto>
    workEquipments: ChangeSet<WorkEquipmentDto>
    maintenanceTrucks: ChangeSet<MaintenanceTruckDto>
    materialTransports: ChangeSet<MaterialTransportDto>
    discounts: ChangeSet<DiscountDto>
    fuelSupplies: ChangeSet<FuelSupplyDto>
    hourMeterMonitorings: ChangeSet<HourMeterMonitoringDto>
}

type item = {
    id: string
    serverId: number
}

export interface SyncPushResponse {
    works: item[]
    deposits: item[]
    materials: item[]
    workRoutes: item[]
    transportVehicles: item[]
    equipments: item[]
    workEquipments: item[]
    maintenanceTrucks: item[]
    materialTransports: item[]
    discounts: item[]
    fuelSupplies: item[]
    hourMeterMonitorings: item[]
}
