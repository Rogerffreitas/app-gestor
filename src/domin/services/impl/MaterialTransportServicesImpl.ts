import { ChangeErrorFields } from '../../../types'
import { MaterialTransportRepositoryGateway } from '../../application/gateways/MaterialTransportRepositoryGateway'
import MaterialTransportDto from '../../entity/material-transport/MaterialTransportDto'
import { MaterialTransportEntity } from '../../entity/material-transport/MaterialTransportEntity'
import { MaterialTransportServices } from '../interfaces/MaterialTransportServices'

export class MaterialTransportServicesImpl implements MaterialTransportServices {
    private repository: MaterialTransportRepositoryGateway

    constructor(repository: MaterialTransportRepositoryGateway) {
        this.repository = repository
    }
    async createMaterialTransportInLocalDatabase(
        dto: MaterialTransportDto,
        changeErrorFields: ChangeErrorFields
    ): Promise<MaterialTransportDto> {
        const entity = MaterialTransportEntity.dtoToEntity(dto)
        entity.validate(changeErrorFields)
        const createdEntity = await this.repository.createMaterialTransportInLocalDatabase(entity)
        return MaterialTransportDto.fromDto(createdEntity)
    }
    deleteMaterialTransportInLocalDatabase(id: string, userId: string): Promise<void> {
        return this.repository.deleteMaterialTransportInLocalDatabase(id, userId)
    }
    saveMaterialTransportServerId(dtos: MaterialTransportDto[]): void {
        throw new Error('Method not implemented.')
    }
    async loadAllMaterialTransportByEnterpriseIdAndWorkIdAndVehicleIdFromLocalDatabase(
        enterpriseId: string,
        workId: string,
        vehicleId: string
    ): Promise<MaterialTransportDto[]> {
        const entities =
            await this.repository.loadAllMaterialTransportByEnterpriseIdAndWorkIdAndVehicleIdFromLocalDatabase(
                enterpriseId,
                workId,
                vehicleId
            )
        return entities.map((entity) => MaterialTransportDto.fromDto(entity))
    }
}
