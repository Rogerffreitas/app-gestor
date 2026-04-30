import { ChangeErrorFields } from '../types'
import WorkEquipmentDto from '../entity/work-equipment/WorkEquipmentDto'

export interface WorkEquipmentUseCase {
    createWorkEquipmentInLocalDatabase(
        dto: WorkEquipmentDto,
        changeErrorFields: ChangeErrorFields,
    ): Promise<WorkEquipmentDto>
    deleteWorkEquipmentInLocalDatabase(id: string, userId: string): Promise<void>
    saveWorkEquipmentServerId(dtos: WorkEquipmentDto[]): void
    loadAllWorkEquipmentByEnterpriseIdAndServerIdValidFromLocalDatabase(
        enterpriseId: string,
        workId: string,
    ): Promise<WorkEquipmentDto[]>
    loadAllWorkEquipmentByEnterpriseIdFromLocalDatabase(
        enterpriseId: string,
        workId: string,
    ): Promise<WorkEquipmentDto[]>
}
