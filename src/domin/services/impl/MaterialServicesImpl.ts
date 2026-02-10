import { ChangeErrorFields } from '../../../types'
import { MaterialRepositoryGateway } from '../../application/gateways/MaterialRepositoryGateway'
import { MaterialDto } from '../../entity/material/MaterialDto'
import MaterialEntity from '../../entity/material/MaterialEntity'
import { MaterialServices } from '../interfaces/MaterialServices'

export class MaterialServicesImpl implements MaterialServices {
    private materialRepositoryGateway: MaterialRepositoryGateway

    constructor(materialRepositoryGateway: MaterialRepositoryGateway) {
        this.materialRepositoryGateway = materialRepositoryGateway
    }

    createMaterialInLocalDatabase(
        dto: MaterialDto,
        changeErrorFields: ChangeErrorFields
    ): Promise<MaterialDto> {
        const material = new MaterialEntity().dtoToEntity(dto)
        material.validate(changeErrorFields)
        return this.materialRepositoryGateway.createMaterialInLocalDatabase(material)
    }

    updateMaterialInLocalDatabase(
        dto: MaterialDto,
        changeErrorFields: ChangeErrorFields
    ): Promise<MaterialDto> {
        const material = new MaterialEntity().dtoToEntity(dto)
        material.validate(changeErrorFields)
        return this.materialRepositoryGateway.updateMaterialInLocalDatabase(material)
    }

    deleteMaterialInLocalDatabase(id: string, userId: string) {
        return this.materialRepositoryGateway.deleteMaterialInLocalDatabase(id, userId)
    }

    findMaterialByIdInLocalDatabase(id: string): Promise<MaterialDto | null> {
        return this.materialRepositoryGateway.findMaterialByIdInLocalDatabase(id)
    }

    loadAllMaterialByEnterpriseIdAndDepositIdFromLocalDatabase(
        enterpriseId: string,
        depositId: string
    ): Promise<MaterialDto[]> {
        return this.materialRepositoryGateway.loadAllMaterialByEnterpriseIdAndDepositIdFromLocalDatabase(
            enterpriseId,
            depositId
        )
    }
    loadAllMaterialByEnterpriseIdAndServerIdValidFromLocalDatabase(
        enterpriseId: string,
        depositId: string
    ): Promise<MaterialDto[]> {
        return this.materialRepositoryGateway.loadAllMaterialByEnterpriseIdAndServerIdValidFromLocalDatabase(
            enterpriseId,
            depositId
        )
    }

    saveMaterialServerId(dtos: MaterialDto[]): void {
        this.materialRepositoryGateway.saveMaterialServerId(dtos)
    }
}
