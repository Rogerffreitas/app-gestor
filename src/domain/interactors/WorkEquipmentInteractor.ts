import { ChangeErrorFields } from '../types'
import { WorkEquipmentRepositoryGateway } from '../application/gateways/WorkEquipmentRepositoryGateway'
import WorkEquipmentDto from '../entity/work-equipment/WorkEquipmentDto'
import { WorkEquipmentEntity } from '../entity/work-equipment/WorkEquipmentEntity'
import { WorkEquipmentUseCase } from '../use-cases/WorkEquipmentUseCase'

export class WorkEquipmentInteractor implements WorkEquipmentUseCase {
    repository: WorkEquipmentRepositoryGateway
    constructor(workEquipmenRepositoryGateway: WorkEquipmentRepositoryGateway) {
        this.repository = workEquipmenRepositoryGateway
    }
    async loadAllWorkEquipmentByEnterpriseIdAndServerIdValidFromLocalDatabase(
        enterpriseId: string,
        workId: string
    ): Promise<WorkEquipmentDto[]> {
        const result =
            await this.repository.loadAllWorkEquipmentByEnterpriseIdAndServerIdValidFromLocalDatabase(
                enterpriseId,
                workId
            )
        return result.map((item) => new WorkEquipmentDto().entityToDto(item))
    }

    async createWorkEquipmentInLocalDatabase(
        dto: WorkEquipmentDto,
        changeErrorFields: ChangeErrorFields
    ): Promise<WorkEquipmentDto> {
        const entity = new WorkEquipmentEntity().dtoToEntity(dto)
        entity.validate(changeErrorFields)

        return new WorkEquipmentDto().entityToDto(
            await this.repository.createWorkEquipmentInLocalDatabase(entity)
        )
    }
    async deleteWorkEquipmentInLocalDatabase(id: string, userId: string): Promise<void> {
        await this.repository.deleteWorkEquipmentInLocalDatabase(id, userId)
    }

    async loadAllWorkEquipmentByEnterpriseIdFromLocalDatabase(
        enterpriseId: string,
        workId: string
    ): Promise<WorkEquipmentDto[]> {
        const result = await this.repository.loadAllWorkEquipmentByEnterpriseIdFromLocalDatabase(
            enterpriseId,
            workId
        )
        return result.map((item) => new WorkEquipmentDto().entityToDto(item))
    }
}
