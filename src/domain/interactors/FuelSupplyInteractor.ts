import { ChangeErrorFields } from '../types'
import { FuelSupplyRepositoryGateway } from '../application/gateways/FuelSupplyRepositoryGateway'
import { FuelSupplyDto } from '../entity/fuel-supply/FuelSupplyDto'
import { FuelSupplyEntity } from '../entity/fuel-supply/FuelSupplyEntity'
import { FuelSupplyUseCase } from '../use-cases/FuelSupplyUseCase'

export class FuelSupplyInteractor implements FuelSupplyUseCase {
    fuelSupplyRepositoryGateway: FuelSupplyRepositoryGateway
    constructor(fuelSupplyRepositoryGateway: FuelSupplyRepositoryGateway) {
        this.fuelSupplyRepositoryGateway = fuelSupplyRepositoryGateway
    }

    async createFuelSupplyInLocalDatabase(
        dto: FuelSupplyDto,
        changeErrorFields: ChangeErrorFields
    ): Promise<FuelSupplyDto> {
        await this.validateCurrentBalance(dto, changeErrorFields)
        const entity = new FuelSupplyEntity().dtoToEntity(dto)
        entity.validate(changeErrorFields)
        const result = await this.fuelSupplyRepositoryGateway.createFuelSupplyInLocalDatabase(entity)
        return new FuelSupplyDto().entityToDto(result)
    }
    async updateFuelSupplyInLocalDatabase(
        dto: FuelSupplyDto,
        changeErrorFields: ChangeErrorFields
    ): Promise<FuelSupplyDto> {
        await this.validateCurrentBalance(dto, changeErrorFields)
        const entity = new FuelSupplyEntity().dtoToEntity(dto)
        entity.validate(changeErrorFields)
        const result = await this.fuelSupplyRepositoryGateway.updateFuelSupplyInLocalDatabase(entity)
        return new FuelSupplyDto().entityToDto(result)
    }
    deleteFuelSupplyInLocalDatabase(id: string, userId: string): Promise<void> {
        return this.fuelSupplyRepositoryGateway.deleteFuelSupplyInLocalDatabase(id, userId)
    }
    saveFuelSupplyServerId(dtos: FuelSupplyDto[]): void {
        throw new Error('Method not implemented.')
    }

    async loadAllFuelSupplyByEnterpriseIdAndWorkIdAndVehicleIdAndTypeFromLocalDatabase(
        enterpriseId: string,
        workId: string,
        transportVehicleOrWorkEquipmentId: string,
        type: string
    ): Promise<FuelSupplyDto[]> {
        const result =
            await this.fuelSupplyRepositoryGateway.loadAllFuelSupplyByEnterpriseIdAndWorkIdAndVehicleIdAndTypeFromLocalDatabase(
                enterpriseId,
                workId,
                transportVehicleOrWorkEquipmentId,
                type
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
        type: string
    ): Promise<FuelSupplyDto[]> {
        const result =
            await this.fuelSupplyRepositoryGateway.loadAllFuelSupplyByEnterpriseIdAndWorkIdAndMaintenanceTruckIdAndTypeFromLocalDatabase(
                enterpriseId,
                workId,
                maintenanceTrucksWorkEquipmentId,
                type
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
            await this.fuelSupplyRepositoryGateway.loadAllFuelSupplyByEnterpriseIdAndWorkIdAndMaintenanceTruckIdFromLocalDatabase(
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
            await this.fuelSupplyRepositoryGateway.loadLastSupplyByEnterpriseIdAndWorkIdAndMaintenanceTruckIdFromLocalDatabase(
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
        return await this.fuelSupplyRepositoryGateway.loadCurrentBalanceTankByEnterpriseIdAndWorkIdAndMaintenanceTruckIdFromLocalDatabase(
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
