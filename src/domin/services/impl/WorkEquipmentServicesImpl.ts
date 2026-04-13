import { TYPES } from '../../../infra/ioc/types'
import { ChangeErrorFields } from '../../../types'
import { WorkEquipmentRepositoryGateway } from '../../application/gateways/WorkEquipmentRepositoryGateway'
import WorkEquipmentDto from '../../entity/work-equipment/WorkEquipmentDto'
import { WorkEquipmentEntity } from '../../entity/work-equipment/WorkEquipmentEntity'
import { WorkEquipmentServices } from '../interfaces/WorkEquipmentServices'
import { inject, injectable } from 'inversify'

@injectable()
export class WorkEquipmentServicesImpl implements WorkEquipmentServices {
    constructor(
        @inject(TYPES.WorkEquipmentRepositoryGateway) private repository: WorkEquipmentRepositoryGateway
    ) {}

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
    saveWorkEquipmentServerId(dtos: WorkEquipmentDto[]): void {
        throw new Error('Method not implemented.')
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
