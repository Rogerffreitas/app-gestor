import { MaintenanceTruckEntity } from '../../entity/maintenance-truck/MaintenanceTruckEntity'

export interface MaintenanceTruckRepositoryGateway {
    createMaintenanceTruckInLocalDatabase(entity: MaintenanceTruckEntity): Promise<MaintenanceTruckEntity>
    updateMaintenanceTruckInLocalDatabase(entity: MaintenanceTruckEntity): Promise<MaintenanceTruckEntity>
    deleteMaintenanceTruckInLocalDatabase(id: string, workEquipmentId: string, userId: string): Promise<void>
    findMaintenanceTruckByIdInLocalDatabase(id: string): Promise<MaintenanceTruckEntity | null>
    saveMaintenanceTruckServerId(entities: MaintenanceTruckEntity[]): void
    loadAllMaintenanceTruckByEnterpriseIdAndWorkIdFromLocalDatabase(
        enterpriseId: string,
        workId: string
    ): Promise<MaintenanceTruckEntity[]>
    loadAllMaintenanceTruckByEnterpriseIdAndServerIdValidFromLocalDatabase(
        enterpriseId: string,
        workId: string
    ): Promise<MaintenanceTruckEntity[]>
}
