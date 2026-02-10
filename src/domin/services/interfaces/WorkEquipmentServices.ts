import { ChangeErrorFields } from '../../../types'
import WorkEquipmentDto from '../../entity/work-equipment/WorkEquipmentDto'

export interface WorkEquipmentServices {
    createWorkEquipmentInLocalDatabase(
        dto: WorkEquipmentDto,
        changeErrorFields: ChangeErrorFields
    ): Promise<WorkEquipmentDto>
    deleteWorkEquipmentInLocalDatabase(id: string, userId: string): Promise<void>
    saveWorkEquipmentServerId(dtos: WorkEquipmentDto[]): void
    loadAllWorkEquipmentByEnterpriseIdAndServerIdValidFromLocalDatabase(
        workId: string,
        enterpriseId: string
    ): Promise<WorkEquipmentDto[]>
    loadAllWorkEquipmentByEnterpriseIdFromLocalDatabase(
        workId: string,
        enterpriseId: string
    ): Promise<WorkEquipmentDto[]>
}
