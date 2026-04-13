import { TYPES } from '../../../infra/ioc/types'
import { ChangeErrorFields } from '../../../types'
import { MaterialTransportRepositoryGateway } from '../../application/gateways/MaterialTransportRepositoryGateway'
import MaterialTransportDto from '../../entity/material-transport/MaterialTransportDto'
import { MaterialTransportEntity } from '../../entity/material-transport/MaterialTransportEntity'
import { MaterialTransportServices } from '../interfaces/MaterialTransportServices'
import { inject, injectable } from 'inversify'

@injectable()
export class MaterialTransportServicesImpl implements MaterialTransportServices {
    constructor(
        @inject(TYPES.MaterialTransportRepositoryGateway)
        private repository: MaterialTransportRepositoryGateway
    ) {}
    async createMaterialTransportInLocalDatabase(
        dto: MaterialTransportDto,
        changeErrorFields: ChangeErrorFields
    ): Promise<MaterialTransportDto> {
        const entity = new MaterialTransportEntity().dtoToEntity(dto)
        entity.validate(changeErrorFields)
        const createdEntity = await this.repository.createMaterialTransportInLocalDatabase(entity)
        return new MaterialTransportDto().fromDto(createdEntity)
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
        return entities.map((entity) => new MaterialTransportDto().fromDto(entity))
    }
}
