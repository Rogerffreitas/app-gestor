import { EnterpriseRepositoryGateway } from '../application/gateways/EnterpriseRepositoryGateway'
import { EnterpriseDto } from '../entity/enterprise/EnterpriseDto'
import { EnterpriseUseCase } from '../use-cases/EnterpriseUseCase'

export class EnterpriseInteractor implements EnterpriseUseCase {
    private repository: EnterpriseRepositoryGateway

    constructor(repository: EnterpriseRepositoryGateway) {
        this.repository = repository
    }
    async loadEnterpriseByID(id: string): Promise<EnterpriseDto | null> {
        const result = await this.repository.loadEnterpriseByID(id)
        if (result) {
            new EnterpriseDto({ name: result.name, id: result.id, companyName: result.companyName })
        }
        return null
    }
}
