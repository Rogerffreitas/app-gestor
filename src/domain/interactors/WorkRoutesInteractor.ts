import { ChangeErrorFields } from '../types'
import { WorkRoutesRepositoryGateway } from '../application/gateways/WorkRoutesRepositoryGateway'
import WorkRoutesDto from '../entity/work-routes/WorkRoutesDto'
import WorkRoutesEntity from '../entity/work-routes/WorkRoutesEntity'
import { WorkRoutesUseCase } from '../use-cases/WorkRoutesUseCase'

export class WorkRoutesInteractor implements WorkRoutesUseCase {
    private workRoutesRepositoryGateway: WorkRoutesRepositoryGateway

    constructor(workRoutesRepository: WorkRoutesRepositoryGateway) {
        this.workRoutesRepositoryGateway = workRoutesRepository
    }

    deleteWorkRoutesInLocalDatabase(id: string, userId: string) {
        return this.workRoutesRepositoryGateway.deleteWorkRoutesInLocalDatabase(id, userId)
    }

    async updateWorkRoutesInLocalDatabase(
        dto: WorkRoutesDto,
        changeErrorFields: ChangeErrorFields
    ): Promise<WorkRoutesDto> {
        const workRoutes = new WorkRoutesEntity().dtoToEntity(dto)
        workRoutes.validate(changeErrorFields)
        return new WorkRoutesDto().entityToDto(
            await this.workRoutesRepositoryGateway.updateWorkRoutesInLocalDatabase(workRoutes)
        )
    }

    async findWorkRoutesByIdInLocalDatabase(id: string): Promise<WorkRoutesDto> {
        const result = await this.workRoutesRepositoryGateway.findWorkRoutesByIdInLocalDatabase(id)
        return new WorkRoutesDto().entityToDto(result)
    }

    async createWorkRoutesInLocalDatabase(
        dto: WorkRoutesDto,
        changeErrorFields: ChangeErrorFields
    ): Promise<WorkRoutesDto> {
        const workRoutes = new WorkRoutesEntity().dtoToEntity(dto)
        workRoutes.validate(changeErrorFields)
        return new WorkRoutesDto().entityToDto(
            await this.workRoutesRepositoryGateway.createWorkRoutesInLocalDatabase(workRoutes)
        )
    }

    async loadAllWorkRoutesByEnterpriseIdAndWorkIdFromLocalDatabase(
        enterpriseId: string,
        workId: string
    ): Promise<WorkRoutesDto[]> {
        const result =
            await this.workRoutesRepositoryGateway.loadAllWorkRoutesByEnterpriseIdAndWorkIdFromLocalDatabase(
                enterpriseId,
                workId
            )
        return result.map((item) => {
            return new WorkRoutesDto().entityToDto(item)
        })
    }
    async loadAllWorkRoutesByEnterpriseIdAndServeridValidFromLocalDatabase(
        enterpriseId: string,
        workId: string
    ): Promise<WorkRoutesDto[]> {
        const result =
            await this.workRoutesRepositoryGateway.loadAllWorkRoutesByEnterpriseIdAndServerIdValidFromLocalDatabase(
                enterpriseId,
                workId
            )

        return result.map((item) => {
            return new WorkRoutesDto().entityToDto(item)
        })
    }
}
