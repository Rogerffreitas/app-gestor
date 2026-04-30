import { WorkEquipmentEntity } from '../../entity/work-equipment/WorkEquipmentEntity'

export interface WorkEquipmentRepositoryGateway {
    createWorkEquipmentInLocalDatabase(entity: WorkEquipmentEntity): Promise<WorkEquipmentEntity>
    deleteWorkEquipmentInLocalDatabase(id: string, userId: string): Promise<void>
    loadAllWorkEquipmentByEnterpriseIdFromLocalDatabase(
        enterpriseId: string,
        workId: string
    ): Promise<WorkEquipmentEntity[]>
    saveWorkEquipmentServerId(entitys: WorkEquipmentEntity[]): void
    loadAllWorkEquipmentByEnterpriseIdAndServerIdValidFromLocalDatabase(
        enterpriseId: string,
        workId: string
    ): Promise<WorkEquipmentEntity[]>
}
