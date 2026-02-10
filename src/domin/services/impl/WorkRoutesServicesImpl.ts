import { ChangeErrorFields } from '../../../types'
import { WorkRoutesRepositoryGateway } from '../../application/gateways/WorkRoutesRepositoryGateway'
import WorkRoutesDto from '../../entity/work-routes/WorkRoutesDto'
import WorkRoutesEntity from '../../entity/work-routes/WorkRoutesEntity'
import { WorkRoutesServices } from '../interfaces/WorkRoutesServices'

export class WorkRoutesServicesImpl implements WorkRoutesServices {
    private workRoutesRepositoryGateway: WorkRoutesRepositoryGateway

    constructor(workRoutesRepository: WorkRoutesRepositoryGateway) {
        this.workRoutesRepositoryGateway = workRoutesRepository
    }
    saveWorkRoutesServerId(dtos: WorkRoutesDto[]): void {
        this.saveWorkRoutesServerId(dtos)
    }
    deleteWorkRoutesInLocalDatabase(id: string, userId: string) {
        return this.workRoutesRepositoryGateway.deleteWorkRoutesInLocalDatabase(id, userId)
    }

    updateWorkRoutesInLocalDatabase(
        dto: WorkRoutesDto,
        changeErrorFields: ChangeErrorFields
    ): Promise<WorkRoutesDto> {
        const workRoutes = new WorkRoutesEntity().dtoToEntity(dto)
        workRoutes.validate(changeErrorFields)
        return this.workRoutesRepositoryGateway.updateWorkRoutesInLocalDatabase(workRoutes)
    }

    findWorkRoutesByIdInLocalDatabase(id: string): Promise<WorkRoutesDto | null> {
        return this.workRoutesRepositoryGateway.findWorkRoutesByIdInLocalDatabase(id)
    }

    createWorkRoutesInLocalDatabase(
        dto: WorkRoutesDto,
        changeErrorFields: ChangeErrorFields
    ): Promise<WorkRoutesDto> {
        const workRoutes = new WorkRoutesEntity().dtoToEntity(dto)
        workRoutes.validate(changeErrorFields)
        return this.workRoutesRepositoryGateway.createWorkRoutesInLocalDatabase(workRoutes)
    }

    loadAllWorkRoutesByEnterpriseIdAndWorkIdFromLocalDatabase(
        enterpriseId: string,
        workId: string
    ): Promise<WorkRoutesDto[]> {
        return this.workRoutesRepositoryGateway.loadAllWorkRoutesByEnterpriseIdAndWorkIdFromLocalDatabase(
            enterpriseId,
            workId
        )
    }
    loadAllWorkRoutesByEnterpriseIdAndServeridValidFromLocalDatabase(
        enterpriseId: string,
        workId: string
    ): Promise<WorkRoutesDto[]> {
        return this.workRoutesRepositoryGateway.loadAllWorkRoutesByEnterpriseIdAndServerIdValidFromLocalDatabase(
            enterpriseId,
            workId
        )
    }
}
