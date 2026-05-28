import WorkDto from '../entity/work/WorkDto'
import { WorkRepositoryGateway } from '../application/gateways/WorkRepositoryGateway'
import WorkEntity from '../entity/work/WorkEntity'
import { WorkUseCase } from '../use-cases/WorkUseCase'
import { UserRoles } from '../types'
import { ChangeErrorFields } from '../types'

export class WorkInteractor implements WorkUseCase {
    private workRepositoryGateway: WorkRepositoryGateway

    constructor(workRepository: WorkRepositoryGateway) {
        this.workRepositoryGateway = workRepository
    }
    deleteWorkInLocalDatabase(id: string, userId: string) {
        return this.workRepositoryGateway.deleteWorkInLocalDatabase(id, userId)
    }

    async updateWorkInLocalDatabase(dto: WorkDto, changeErrorFields: ChangeErrorFields): Promise<WorkDto> {
        const work = new WorkEntity().dtoToEntity(dto)
        work.validate(changeErrorFields)
        return new WorkDto().entityToDto(await this.workRepositoryGateway.updateWorkInLocalDatabase(work))
    }

    async findWorkByIdInLocalDatabase(id: string): Promise<WorkDto> {
        const result = await this.workRepositoryGateway.findWorkByIdInLocalDatabase(id)

        return new WorkDto().entityToDto(result)
    }

    async createWorkInLocalDatabase(dto: WorkDto, changeErrorFields: ChangeErrorFields): Promise<WorkDto> {
        const work = new WorkEntity().dtoToEntity(dto)
        work.validate(changeErrorFields)
        return new WorkDto().entityToDto(await this.workRepositoryGateway.createWorkInLocalDatabase(work))
    }

    async loadWorkListFromDatabase(
        enterpriseId: string,
        userId: string,
        userRole: string
    ): Promise<WorkDto[]> {
        if (userRole != UserRoles.ADMIN) {
            const result =
                await this.workRepositoryGateway.loadAllWorksByEnterpriseIdAndUserIdFromLocalDatabase(
                    enterpriseId,
                    userId
                )
            return result.map((item) => new WorkDto().entityToDto(item))
        }

        const result = this.workRepositoryGateway.loadAllWorksByEnterpriseIdFromLocalDatabase(enterpriseId)
        return (await result).map((item) => new WorkDto().entityToDto(item))
    }
}
