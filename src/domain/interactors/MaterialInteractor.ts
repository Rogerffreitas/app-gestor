import { ChangeErrorFields } from '../types'
import { MaterialRepositoryGateway } from '../application/gateways/MaterialRepositoryGateway'
import { MaterialDto } from '../entity/material/MaterialDto'
import MaterialEntity from '../entity/material/MaterialEntity'
import { MaterialUseCase } from '../use-cases/MaterialUseCase'

export class MaterialInteractor implements MaterialUseCase {
    private materialRepositoryGateway: MaterialRepositoryGateway

    constructor(materialRepositoryGateway: MaterialRepositoryGateway) {
        this.materialRepositoryGateway = materialRepositoryGateway
    }

    async createMaterialInLocalDatabase(
        dto: MaterialDto,
        changeErrorFields: ChangeErrorFields
    ): Promise<MaterialDto> {
        const material = new MaterialEntity().dtoToEntity(dto)
        material.validate(changeErrorFields)
        return new MaterialDto().entityToDto(
            await this.materialRepositoryGateway.createMaterialInLocalDatabase(material)
        )
    }

    async updateMaterialInLocalDatabase(
        dto: MaterialDto,
        changeErrorFields: ChangeErrorFields
    ): Promise<MaterialDto> {
        const material = new MaterialEntity().dtoToEntity(dto)
        material.validate(changeErrorFields)
        return new MaterialDto().entityToDto(
            await this.materialRepositoryGateway.updateMaterialInLocalDatabase(material)
        )
    }

    deleteMaterialInLocalDatabase(id: string, userId: string) {
        return this.materialRepositoryGateway.deleteMaterialInLocalDatabase(id, userId)
    }

    async findMaterialByIdInLocalDatabase(id: string): Promise<MaterialDto> {
        const result = await this.materialRepositoryGateway.findMaterialByIdInLocalDatabase(id)
        return new MaterialDto().entityToDto(result)
    }

    async loadAllMaterialByEnterpriseIdAndDepositIdFromLocalDatabase(
        enterpriseId: string,
        depositId: string
    ): Promise<MaterialDto[]> {
        const result =
            await this.materialRepositoryGateway.loadAllMaterialByEnterpriseIdAndDepositIdFromLocalDatabase(
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
        const result =
            await this.materialRepositoryGateway.loadAllMaterialByEnterpriseIdAndServerIdValidFromLocalDatabase(
                enterpriseId,
                depositId
            )
        return result.map((item) => {
            return new MaterialDto().entityToDto(item)
        })
    }
}
