import { MaterialTransportEntity } from '../../entity/material-transport/MaterialTransportEntity'

export interface MaterialTransportRepositoryGateway {
    createMaterialTransportInLocalDatabase(entity: MaterialTransportEntity): Promise<MaterialTransportEntity>
    deleteMaterialTransportInLocalDatabase(id: string, userId: string): Promise<void>
    saveMaterialTransportServerId(entiteis: MaterialTransportEntity[]): void
    loadAllMaterialTransportByEnterpriseIdAndWorkIdAndVehicleIdFromLocalDatabase(
        enterpriseId: string,
        workId: string,
        vehicleId: string
    ): Promise<MaterialTransportEntity[]>
}
