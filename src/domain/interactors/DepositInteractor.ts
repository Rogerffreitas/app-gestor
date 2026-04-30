import { ChangeErrorFields } from '../types'
import { DepositRepositoryGateway } from '../application/gateways/DepositRepositoryGateway'
import DepositDto from '../entity/deposit/DepositDto'
import DepositEntity from '../entity/deposit/DepositEntity'
import { DepositUseCase } from '../use-cases/DepositUseCase'

export class DepositInteractor implements DepositUseCase {
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

    async updateDepositInLocalDatabase(
        dto: DepositDto,
        changeErrorFields: ChangeErrorFields
    ): Promise<DepositDto> {
        const deposit = new DepositEntity().dtoToEntity(dto)
        deposit.validate(changeErrorFields)
        return new DepositDto().toDto(
            await this.depositRepositoryGateway.updateDepositInLocalDatabase(deposit)
        )
    }

    async findDepositByIdInLocalDatabase(id: string): Promise<DepositDto | null> {
        return new DepositDto().toDto(await this.depositRepositoryGateway.findDepositByIdInLocalDatabase(id))
    }

    async createDepositInLocalDatabase(
        dto: DepositDto,
        changeErrorFields: ChangeErrorFields
    ): Promise<DepositDto> {
        const deposit = new DepositEntity().dtoToEntity(dto)
        deposit.validate(changeErrorFields)
        return new DepositDto().toDto(
            await this.depositRepositoryGateway.createDepositInLocalDatabase(deposit)
        )
    }

    async loadAllDepositByEnterpriseIdFromLocalDatabase(enterpriseId: string): Promise<DepositDto[]> {
        const retuls = await this.depositRepositoryGateway.loadAllDepositByEnterpriseIdFromLocalDatabase(
            enterpriseId
        )
        return retuls.map((item) => new DepositDto().toDto(item))
    }
}
