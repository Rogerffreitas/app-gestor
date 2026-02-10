import { ChangeErrorFields } from '../../../types'
import { MaintenanceTruckDto } from '../../entity/maintenance-truck/MaintenanceTruckDto'

export interface MaintenanceTruckServices {
    createMaintenanceTruckInLocalDatabase(
        dto: MaintenanceTruckDto,
        changeErrorFields: ChangeErrorFields
    ): Promise<MaintenanceTruckDto>
    updateMaintenanceTruckInLocalDatabase(
        dto: MaintenanceTruckDto,
        changeErrorFields: ChangeErrorFields
    ): Promise<MaintenanceTruckDto>
    deleteMaintenanceTruckInLocalDatabase(id: string, workEquipmentId: string, userId: string): void
    findMaintenanceTruckByIdInLocalDatabase(id: string): Promise<MaintenanceTruckDto | null>
    saveMaintenanceTruckServerId(dtos: MaintenanceTruckDto[]): void
    loadAllMaintenanceTruckByEnterpriseIdAndWorkIdFromLocalDatabase(
        enterpriseId: string,
        workId: string
    ): Promise<MaintenanceTruckDto[]>
    loadAllMaintenanceTruckByEnterpriseIdAndServerIdValidFromLocalDatabase(
        enterpriseId: string,
        workId: string
    ): Promise<MaintenanceTruckDto[]>
}
