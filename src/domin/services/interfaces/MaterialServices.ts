import { ChangeErrorFields } from '../../../types'
import { MaterialDto } from '../../entity/material/MaterialDto'

export interface MaterialServices {
    createMaterialInLocalDatabase(
        dto: MaterialDto,
        changeErrorFields: ChangeErrorFields
    ): Promise<MaterialDto>
    updateMaterialInLocalDatabase(
        dto: MaterialDto,
        changeErrorFields: ChangeErrorFields
    ): Promise<MaterialDto>
    deleteMaterialInLocalDatabase(id: string, userId: string): Promise<void>
    findMaterialByIdInLocalDatabase(id: string): Promise<MaterialDto | null>
    saveMaterialServerId(dtos: MaterialDto[]): void
    loadAllMaterialByEnterpriseIdAndDepositIdFromLocalDatabase(
        enterpriseId: string,
        depositId: string
    ): Promise<MaterialDto[]>
    loadAllMaterialByEnterpriseIdAndServerIdValidFromLocalDatabase(
        enterpriseId: string,
        depositId: string
    ): Promise<MaterialDto[]>
}
