import { ChangeErrorFields } from '../../../types'
import { FuelSupplyDto } from '../../entity/fuel-supply/FuelSupplyDto'

export interface FuelSupplyServices {
    createFuelSupplyInLocalDatabase(
        dto: FuelSupplyDto,
        changeErrorFields: ChangeErrorFields
    ): Promise<FuelSupplyDto>
    updateFuelSupplyInLocalDatabase(
        entity: FuelSupplyDto,
        changeErrorFields: ChangeErrorFields
    ): Promise<FuelSupplyDto>
    deleteFuelSupplyInLocalDatabase(id: string, userId: string): Promise<void>
    saveFuelSupplyServerId(dtos: FuelSupplyDto[]): void
    loadAllFuelSupplyByEnterpriseIdAndWorkIdAndVehicleIdAndTypeFromLocalDatabase(
        enterpriseId: string,
        workId: string,
        vehicleId: string,
        type: string
    ): Promise<FuelSupplyDto[]>
    loadById(id: string): Promise<FuelSupplyDto>
    loadAllFuelSupplyByEnterpriseIdAndWorkIdAndMaintenanceTruckIdAndTypeFromLocalDatabase(
        enterpriseId: string,
        workId: string,
        maintenanceTrucksWorkEquipmentId: string,
        type: string
    ): Promise<FuelSupplyDto[]>
    loadAllFuelSupplyByEnterpriseIdAndWorkIdAndMaintenanceTruckIdAndTypeFromLocalDatabase(
        enterpriseId: string,
        workId: string,
        maintenanceTrucksWorkEquipmentId: string,
        type: string
    ): Promise<FuelSupplyDto[]>
    loadLastSupplyByEnterpriseIdAndWorkIdAndMaintenanceTruckIdFromLocalDatabase(
        enterpriseId: string,
        workId: string,
        maintenanceTrucksWorkEquipmentId: string
    ): Promise<FuelSupplyDto>

    loadCurrentBalanceTankByEnterpriseIdAndWorkIdAndMaintenanceTruckIdFromLocalDatabase(
        enterpriseId: string,
        workId: string,
        maintenanceTrucksWorkEquipmentId: string
    ): Promise<number>
}
