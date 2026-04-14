import { ChangeErrorFields } from '../../../types'
import { DepositRepositoryGateway } from '../../application/gateways/DepositRepositoryGateway'
import DepositDto from '../../entity/deposit/DepositDto'
import DepositEntity from '../../entity/deposit/DepositEntity'
import { DepositServices } from '../interfaces/DepositServices'

export class DepositServicesImpl implements DepositServices {
    constructor(private repository: DepositRepositoryGateway) {}
    saveDepositServerId(dto: DepositDto): void {
        this.saveDepositServerId(dto)
    }
    deleteDepositInLocalDatabase(id: string, userId: string) {
        return this.repository.deleteDepositInLocalDatabase(id, userId)
    }

    updateDepositInLocalDatabase(dto: DepositDto, changeErrorFields: ChangeErrorFields): Promise<DepositDto> {
        const deposit = new DepositEntity().dtoToEntity(dto)
        deposit.validate(changeErrorFields)
        return this.repository.updateDepositInLocalDatabase(deposit)
    }

    findDepositByIdInLocalDatabase(id: string): Promise<DepositDto | null> {
        return this.repository.findDepositByIdInLocalDatabase(id)
    }

    createDepositInLocalDatabase(dto: DepositDto, changeErrorFields: ChangeErrorFields): Promise<DepositDto> {
        const deposit = new DepositEntity().dtoToEntity(dto)
        deposit.validate(changeErrorFields)
        return this.repository.createDepositInLocalDatabase(deposit)
    }

    loadAllDepositByEnterpriseIdFromLocalDatabase(enterpriseId: string): Promise<DepositDto[]> {
        return this.repository.loadAllDepositByEnterpriseIdFromLocalDatabase(enterpriseId)
    }
}
