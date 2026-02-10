import { ChangeErrorFields } from '../../../types'
import { DepositRepositoryGateway } from '../../application/gateways/DepositRepositoryGateway'
import DepositDto from '../../entity/deposit/DepositDto'
import DepositEntity from '../../entity/deposit/DepositEntity'
import { DepositServices } from '../interfaces/DepositServices'

export class DepositServicesImpl implements DepositServices {
    private depositRepositoryGateway: DepositRepositoryGateway

    constructor(depositRepository: DepositRepositoryGateway) {
        this.depositRepositoryGateway = depositRepository
    }
    saveDepositServerId(dtos: DepositDto[]): void {
        this.saveDepositServerId(dtos)
    }
    deleteDepositInLocalDatabase(id: string, userId: string) {
        return this.depositRepositoryGateway.deleteDepositInLocalDatabase(id, userId)
    }

    updateDepositInLocalDatabase(dto: DepositDto, changeErrorFields: ChangeErrorFields): Promise<DepositDto> {
        const deposit = new DepositEntity().dtoToEntity(dto)
        deposit.validate(changeErrorFields)
        return this.depositRepositoryGateway.updateDepositInLocalDatabase(deposit)
    }

    findDepositByIdInLocalDatabase(id: string): Promise<DepositDto | null> {
        return this.depositRepositoryGateway.findDepositByIdInLocalDatabase(id)
    }

    createDepositInLocalDatabase(dto: DepositDto, changeErrorFields: ChangeErrorFields): Promise<DepositDto> {
        const deposit = new DepositEntity().dtoToEntity(dto)
        deposit.validate(changeErrorFields)
        return this.depositRepositoryGateway.createDepositInLocalDatabase(deposit)
    }

    loadAllDepositByEnterpriseIdFromLocalDatabase(enterpriseId: string): Promise<DepositDto[]> {
        return this.depositRepositoryGateway.loadAllDepositByEnterpriseIdFromLocalDatabase(enterpriseId)
    }
}
