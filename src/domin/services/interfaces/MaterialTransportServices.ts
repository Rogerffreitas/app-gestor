import { ChangeErrorFields } from '../../../types'
import MaterialTransportDto from '../../entity/material-transport/MaterialTransportDto'

export interface MaterialTransportServices {
    createMaterialTransportInLocalDatabase(
        dto: MaterialTransportDto,
        changeErrorFields: ChangeErrorFields
    ): Promise<MaterialTransportDto>
    deleteMaterialTransportInLocalDatabase(id: string, userId: string): Promise<void>
    saveMaterialTransportServerId(dtos: MaterialTransportDto[]): void
    loadAllMaterialTransportByEnterpriseIdAndWorkIdAndVehicleIdFromLocalDatabase(
        enterpriseId: string,
        workId: string,
        vehicleId: string
    ): Promise<MaterialTransportDto[]>
}
