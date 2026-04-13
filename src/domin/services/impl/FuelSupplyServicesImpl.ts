import { inject, injectable } from 'inversify'
import { ChangeErrorFields } from '../../../types'
import { FuelSupplyRepositoryGateway } from '../../application/gateways/FuelSupplyRepositoryGateway'
import { FuelSupplyDto } from '../../entity/fuel-supply/FuelSupplyDto'
import { FuelSupplyEntity } from '../../entity/fuel-supply/FuelSupplyEntity'
import { FuelSupplyServices } from '../interfaces/FuelSupplyServices'
import { TYPES } from '../../../infra/ioc/types'

@injectable()
export class FuelSupplyServicesImpl implements FuelSupplyServices {
    constructor(@inject(TYPES.FuelSupplyRepositoryGateway) private repository: FuelSupplyRepositoryGateway) {}

    async createFuelSupplyInLocalDatabase(
        dto: FuelSupplyDto,
        changeErrorFields: ChangeErrorFields
    ): Promise<FuelSupplyDto> {
        await this.validateCurrentBalance(dto, changeErrorFields)
        const entity = new FuelSupplyEntity().dtoToEntity(dto)
        entity.validate(changeErrorFields)
        const result = await this.repository.createFuelSupplyInLocalDatabase(entity)
        return new FuelSupplyDto().entityToDto(result)
    }
    async updateFuelSupplyInLocalDatabase(
        dto: FuelSupplyDto,
        changeErrorFields: ChangeErrorFields
    ): Promise<FuelSupplyDto> {
        await this.validateCurrentBalance(dto, changeErrorFields)
        const entity = new FuelSupplyEntity().dtoToEntity(dto)
        entity.validate(changeErrorFields)
        const result = await this.repository.updateFuelSupplyInLocalDatabase(entity)
        return new FuelSupplyDto().entityToDto(result)
    }
    deleteFuelSupplyInLocalDatabase(id: string, userId: string): Promise<void> {
        return this.repository.deleteFuelSupplyInLocalDatabase(id, userId)
    }
    saveFuelSupplyServerId(dtos: FuelSupplyDto[]): void {
        throw new Error('Method not implemented.')
    }

    async loadAllFuelSupplyByEnterpriseIdAndWorkIdAndVehicleIdAndTypeFromLocalDatabase(
        enterpriseId: string,
        workId: string,
        transportVehicleOrWorkEquipmentId: string,
        supplyType: string
    ): Promise<FuelSupplyDto[]> {
        const result =
            await this.repository.loadAllFuelSupplyByEnterpriseIdAndWorkIdAndVehicleIdAndTypeFromLocalDatabase(
                enterpriseId,
                workId,
                transportVehicleOrWorkEquipmentId,
                supplyType
            )
        return result.map((item) => {
            return new FuelSupplyDto().entityToDto(item)
        })
    }

    loadById(id: string): Promise<FuelSupplyDto> {
        throw new Error('Method not implemented.')
    }

    async loadAllFuelSupplyByEnterpriseIdAndWorkIdAndMaintenanceTruckIdAndTypeFromLocalDatabase(
        enterpriseId: string,
        workId: string,
        maintenanceTrucksWorkEquipmentId: string,
        supplyType: string
    ): Promise<FuelSupplyDto[]> {
        const result =
            await this.repository.loadAllFuelSupplyByEnterpriseIdAndWorkIdAndMaintenanceTruckIdAndTypeFromLocalDatabase(
                enterpriseId,
                workId,
                maintenanceTrucksWorkEquipmentId,
                supplyType
            )
        return result.map((item) => {
            return new FuelSupplyDto().entityToDto(item)
        })
    }

    async loadAllFuelSupplyByEnterpriseIdAndWorkIdAndMaintenanceTruckIdFromLocalDatabase(
        enterpriseId: string,
        workId: string,
        maintenanceTrucksWorkEquipmentId: string
    ): Promise<FuelSupplyDto[]> {
        const result =
            await this.repository.loadAllFuelSupplyByEnterpriseIdAndWorkIdAndMaintenanceTruckIdFromLocalDatabase(
                enterpriseId,
                workId,
                maintenanceTrucksWorkEquipmentId
            )
        return result.map((item) => {
            return new FuelSupplyDto().entityToDto(item)
        })
    }

    async loadLastSupplyByEnterpriseIdAndWorkIdAndMaintenanceTruckIdFromLocalDatabase(
        enterpriseId: string,
        workId: string,
        maintenanceTrucksWorkEquipmentId: string
    ): Promise<FuelSupplyDto> {
        const result =
            await this.repository.loadLastSupplyByEnterpriseIdAndWorkIdAndMaintenanceTruckIdFromLocalDatabase(
                enterpriseId,
                workId,
                maintenanceTrucksWorkEquipmentId
            )
        return new FuelSupplyDto().entityToDto(result)
    }

    async loadCurrentBalanceTankByEnterpriseIdAndWorkIdAndMaintenanceTruckIdFromLocalDatabase(
        enterpriseId: string,
        workId: string,
        maintenanceTrucksWorkEquipmentId: string
    ): Promise<number> {
        return await this.repository.loadCurrentBalanceTankByEnterpriseIdAndWorkIdAndMaintenanceTruckIdFromLocalDatabase(
            enterpriseId,
            workId,
            maintenanceTrucksWorkEquipmentId
        )
    }
    async validateCurrentBalance(dto: FuelSupplyDto, changeErrorFields: ChangeErrorFields) {
        if (dto.maintenanceTrucksWorkEquipmentId && !dto.isGasStation) {
            const currentBalanceTank =
                await this.loadCurrentBalanceTankByEnterpriseIdAndWorkIdAndMaintenanceTruckIdFromLocalDatabase(
                    dto.enterpriseId,
                    dto.workId,
                    dto.maintenanceTrucksWorkEquipmentId
                )
            if (+dto.quantity > +currentBalanceTank) {
                changeErrorFields('quantity')('Quantidade Inválida')
                throw new Error(
                    `Quantidade informada ${dto.quantity / 100}, Quatidade disponível ${currentBalanceTank}`
                )
            }
        }
    }
}
