import { ChangeErrorFields } from '../../../types'
import DepositDto from '../../entity/deposit/DepositDto'

export interface DepositServices {
    createDepositInLocalDatabase(dto: DepositDto, changeErrorFields: ChangeErrorFields): Promise<DepositDto>
    updateDepositInLocalDatabase(dto: DepositDto, changeErrorFields: ChangeErrorFields): Promise<DepositDto>
    deleteDepositInLocalDatabase(id: string, userId: string): Promise<void>
    findDepositByIdInLocalDatabase(id: string): Promise<DepositDto | null>
    loadAllDepositByEnterpriseIdFromLocalDatabase(enterpriseId: string): Promise<DepositDto[]>
    saveDepositServerId(dtos: DepositDto[]): void
}
