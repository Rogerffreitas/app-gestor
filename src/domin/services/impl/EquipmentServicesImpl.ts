import { ChangeErrorFields } from '../../../types'
import { EquipmentRepositoryGateway } from '../../application/gateways/EquipmentRepositoryGateway'
import { BankInformation } from '../../entity/bank-information/BankInformation'
import EquipmentDto from '../../entity/equipment/EquipmentDto'
import { EquipmentEntity } from '../../entity/equipment/EquipmentEntity'
import { EquipmentServices } from '../interfaces/EquipmentServices'

export default class EquipmentServicesImpl implements EquipmentServices {
    equipmentRepositoryGateway: EquipmentRepositoryGateway
    constructor(equipmentRepositoryGateway: EquipmentRepositoryGateway) {
        this.equipmentRepositoryGateway = equipmentRepositoryGateway
    }
    async loadAllEquipmentByEnterpriseIdFromLocalDatabase(enterpriseId: string): Promise<EquipmentDto[]> {
        const result = await this.equipmentRepositoryGateway.loadAllEquipmentByEnterpriseIdFromLocalDatabase(
            enterpriseId
        )
        return result.map((item) => new EquipmentDto().entityToDto(item))
    }

    async createEquipmentInLocalDatabase(
        dto: EquipmentDto,
        changeErrorFields: ChangeErrorFields
    ): Promise<EquipmentDto> {
        const entity = new EquipmentEntity().dtoToEntity(dto)
        entity.validate(changeErrorFields)
        const result = await this.equipmentRepositoryGateway.createEquipmentInLocalDatabase(entity)
        return new EquipmentDto().entityToDto(result)
    }
    async updateEquipmentInLocalDatabase(
        dto: EquipmentDto,
        changeErrorFields: ChangeErrorFields
    ): Promise<EquipmentDto> {
        const entity = new EquipmentEntity().dtoToEntity(dto)
        entity.validate(changeErrorFields)
        const result = await this.equipmentRepositoryGateway.updateEquipmentInLocalDatabase(entity)
        return new EquipmentDto().entityToDto(result)
    }
    async updateEquipmentBankInformation(
        id: string,
        bankInformation: BankInformation
    ): Promise<EquipmentDto> {
        const result = await this.equipmentRepositoryGateway.updateEquipmentBankInformation(
            id,
            bankInformation
        )
        return new EquipmentDto().entityToDto(result)
    }
    deleteEquipmentInLocalDatabase(id: string, userId: string): Promise<void> {
        return this.equipmentRepositoryGateway.deleteEquipmentInLocalDatabase(id, userId)
    }
    findEquipmentByIdInLocalDatabase(id: string): Promise<EquipmentDto> {
        throw new Error('Method not implemented.')
    }
    saveEquipmentServerId(dtos: EquipmentDto[]): void {
        throw new Error('Method not implemented.')
    }
    async loadAllEquipmentByEnterpriseIdAndWorkIdFromLocalDatabase(
        enterpriseId: string,
        workId: string
    ): Promise<EquipmentDto[]> {
        const result =
            await this.equipmentRepositoryGateway.loadAllEquipmentByEnterpriseIdAndWorkIdFromLocalDatabase(
                enterpriseId,
                workId
            )
        return result.map((item) => {
            return new EquipmentDto().entityToDto(item)
        })
    }
    async loadAllEquipmentByEnterpriseIdAndServerIdValidFromLocalDatabase(
        enterpriseId: string
    ): Promise<EquipmentDto[]> {
        const result =
            await this.equipmentRepositoryGateway.loadAllEquipmentByEnterpriseIdAndServerIdValidFromLocalDatabase(
                enterpriseId
            )
        return result.map((item) => new EquipmentDto().entityToDto(item))
    }
}
