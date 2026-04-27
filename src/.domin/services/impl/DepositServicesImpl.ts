import { ChangeErrorFields } from '../../../types'
import { DepositServices } from '../interfaces/DepositServices'
import { DepositRepositoryGateway } from '@domin/application/gateways/DepositRepositoryGateway'
import DepositDto from '@domin/entity/deposit/DepositDto'
import DepositEntity from '@domin/entity/deposit/DepositEntity'

export class DepositServicesImpl implements DepositServices {
    constructor(private repository: DepositRepositoryGateway) {}
    saveDepositServerId(dto: DepositDto): void {
        this.saveDepositServerId(dto)
    }
    deleteDepositInLocalDatabase(id: string, userId: string) {
        return this.repository.deleteDepositInLocalDatabase(id, userId)
    }

    async updateDepositInLocalDatabase(
        dto: DepositDto,
        changeErrorFields: ChangeErrorFields
    ): Promise<DepositDto> {
        try {
            const deposit = new DepositEntity().dtoToEntity(dto)
            deposit.validate()
            return new DepositDto().toDto(await this.repository.updateDepositInLocalDatabase(deposit))
        } catch (error) {}
    }

    async findDepositByIdInLocalDatabase(id: string): Promise<DepositDto | null> {
        const result = await this.repository.findDepositByIdInLocalDatabase(id)

        if (result) return new DepositDto().toDto(result)
        return null
    }

    async createDepositInLocalDatabase(
        dto: DepositDto,
        changeErrorFields: ChangeErrorFields
    ): Promise<DepositDto> {
        try {
            const deposit = new DepositEntity().dtoToEntity(dto)
            deposit.validate()
            return new DepositDto().toDto(await this.repository.updateDepositInLocalDatabase(deposit))
        } catch (error) {}
    }

    async loadAllDepositByEnterpriseIdFromLocalDatabase(enterpriseId: string): Promise<DepositDto[]> {
        const result = await this.repository.loadAllDepositByEnterpriseIdFromLocalDatabase(enterpriseId)

        return result.map((item) => {
            return new DepositDto().toDto(item)
        })
    }
}
