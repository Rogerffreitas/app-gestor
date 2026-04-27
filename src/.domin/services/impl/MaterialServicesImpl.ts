import { ChangeErrorFields } from '../../../types'
import { MaterialRepositoryGateway } from '../../application/gateways/MaterialRepositoryGateway'
import { MaterialDto } from '../../entity/material/MaterialDto'
import MaterialEntity from '../../entity/material/MaterialEntity'
import { MaterialServices } from '../interfaces/MaterialServices'

export class MaterialServicesImpl implements MaterialServices {
    constructor(private repository: MaterialRepositoryGateway) {}

    async createMaterialInLocalDatabase(
        dto: MaterialDto,
        changeErrorFields: ChangeErrorFields
    ): Promise<MaterialDto> {
        const material = new MaterialEntity().dtoToEntity(dto)
        material.validate(changeErrorFields)
        return new MaterialDto().entityToDto(await this.repository.createMaterialInLocalDatabase(material))
    }

    async updateMaterialInLocalDatabase(
        dto: MaterialDto,
        changeErrorFields: ChangeErrorFields
    ): Promise<MaterialDto> {
        const material = new MaterialEntity().dtoToEntity(dto)
        material.validate(changeErrorFields)
        return new MaterialDto().entityToDto(await this.repository.updateMaterialInLocalDatabase(material))
    }

    deleteMaterialInLocalDatabase(id: string, userId: string) {
        return this.repository.deleteMaterialInLocalDatabase(id, userId)
    }

    async findMaterialByIdInLocalDatabase(id: string): Promise<MaterialDto | null> {
        return new MaterialDto().entityToDto(await this.repository.findMaterialByIdInLocalDatabase(id))
    }

    async loadAllMaterialByEnterpriseIdAndDepositIdFromLocalDatabase(
        enterpriseId: string,
        depositId: string
    ): Promise<MaterialDto[]> {
        const result = await this.repository.loadAllMaterialByEnterpriseIdAndDepositIdFromLocalDatabase(
            enterpriseId,
            depositId
        )
        return result.map((item) => {
            return new MaterialDto().entityToDto(item)
        })
    }
    async loadAllMaterialByEnterpriseIdAndServerIdValidFromLocalDatabase(
        enterpriseId: string,
        depositId: string
    ): Promise<MaterialDto[]> {
        const result = await this.repository.loadAllMaterialByEnterpriseIdAndServerIdValidFromLocalDatabase(
            enterpriseId,
            depositId
        )
        return result.map((item) => {
            return new MaterialDto().entityToDto(item)
        })
    }

    saveMaterialServerId(dtos: MaterialDto[]): void {}
}
