import { FuelSupplyEntity } from '../../entity/fuel-supply/FuelSupplyEntity'

export interface FuelSupplyRepositoryGateway {
    createFuelSupplyInLocalDatabase(entity: FuelSupplyEntity): Promise<FuelSupplyEntity>
    updateFuelSupplyInLocalDatabase(entity: FuelSupplyEntity): Promise<FuelSupplyEntity>
    deleteFuelSupplyInLocalDatabase(id: string, userId: string): Promise<void>
    saveFuelSupplyServerId(entiteis: FuelSupplyEntity[]): void
    loadAllFuelSupplyByEnterpriseIdAndWorkIdAndVehicleIdAndTypeFromLocalDatabase(
        enterpriseId: string,
        workId: string,
        vehicleId: string,
        type: string
    ): Promise<FuelSupplyEntity[]>
    loadById(id: string): Promise<FuelSupplyEntity>
    loadAllFuelSupplyByEnterpriseIdAndWorkIdAndMaintenanceTruckIdAndTypeFromLocalDatabase(
        enterpriseId: string,
        workId: string,
        maintenanceTrucksWorkEquipmentId: string,
        type: string
    ): Promise<FuelSupplyEntity[]>
    loadAllFuelSupplyByEnterpriseIdAndWorkIdAndMaintenanceTruckIdAndTypeFromLocalDatabase(
        enterpriseId: string,
        workId: string,
        maintenanceTrucksWorkEquipmentId: string,
        type: string
    ): Promise<FuelSupplyEntity[]>
    loadLastSupplyByEnterpriseIdAndWorkIdAndMaintenanceTruckIdFromLocalDatabase(
        enterpriseId: string,
        workId: string,
        maintenanceTrucksWorkEquipmentId: string
    ): Promise<FuelSupplyEntity>

    loadCurrentBalanceTankByEnterpriseIdAndWorkIdAndMaintenanceTruckIdFromLocalDatabase(
        enterpriseId: string,
        workId: string,
        maintenanceTrucksWorkEquipmentId: string
    ): Promise<number>
}
