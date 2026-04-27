import { ChangeErrorFields } from '../../../types'
import { WorkRoutesRepositoryGateway } from '../../application/gateways/WorkRoutesRepositoryGateway'
import WorkRoutesDto from '../../entity/work-routes/WorkRoutesDto'
import WorkRoutesEntity from '../../entity/work-routes/WorkRoutesEntity'
import { WorkRoutesServices } from '../interfaces/WorkRoutesServices'

export class WorkRoutesServicesImpl implements WorkRoutesServices {
    constructor(private repository: WorkRoutesRepositoryGateway) {}

    saveWorkRoutesServerId(dtos: WorkRoutesDto[]): void {
        this.saveWorkRoutesServerId(dtos)
    }
    deleteWorkRoutesInLocalDatabase(id: string, userId: string) {
        return this.repository.deleteWorkRoutesInLocalDatabase(id, userId)
    }

    async updateWorkRoutesInLocalDatabase(
        dto: WorkRoutesDto,
        changeErrorFields: ChangeErrorFields
    ): Promise<WorkRoutesDto> {
        const workRoutes = new WorkRoutesEntity().dtoToEntity(dto)
        workRoutes.validate(changeErrorFields)
        return new WorkRoutesDto().entityToDto(
            await this.repository.updateWorkRoutesInLocalDatabase(workRoutes)
        )
    }

    async findWorkRoutesByIdInLocalDatabase(id: string): Promise<WorkRoutesDto | null> {
        return new WorkRoutesDto().entityToDto(await this.repository.findWorkRoutesByIdInLocalDatabase(id))
    }

    async createWorkRoutesInLocalDatabase(
        dto: WorkRoutesDto,
        changeErrorFields: ChangeErrorFields
    ): Promise<WorkRoutesDto> {
        const workRoutes = new WorkRoutesEntity().dtoToEntity(dto)
        workRoutes.validate(changeErrorFields)
        return new WorkRoutesDto().entityToDto(
            await this.repository.createWorkRoutesInLocalDatabase(workRoutes)
        )
    }

    async loadAllWorkRoutesByEnterpriseIdAndWorkIdFromLocalDatabase(
        enterpriseId: string,
        workId: string
    ): Promise<WorkRoutesDto[]> {
        const result = await this.repository.loadAllWorkRoutesByEnterpriseIdAndWorkIdFromLocalDatabase(
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
        const result = await this.repository.loadAllWorkRoutesByEnterpriseIdAndServerIdValidFromLocalDatabase(
            enterpriseId,
            workId
        )

        return result.map((item) => {
            return new WorkRoutesDto().entityToDto(item)
        })
    }
}
