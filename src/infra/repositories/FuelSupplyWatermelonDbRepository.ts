import { database } from '../../database'
import { Q } from '@nozbe/watermelondb'
import FuelSupplyModel from '../../database/model/FuelSupplyModel'
import { FuelSupplyRepositoryGateway } from '@gestor/domain/application/gateways/FuelSupplyRepositoryGateway'
import { FuelSupplyTypes, InvoiceStatus, TableName, UserAction } from '../../types'
import { FuelSupplyEntity } from '@gestor/domain/entity/fuel-supply/FuelSupplyEntity'
import FuelSupplyProps from '@gestor/domain/interfaces/props/FuelSupplyProps'

export class FuelSupplyWatermelonDbRepository implements FuelSupplyRepositoryGateway {
    loadCurrentBalanceTankByEnterpriseIdAndWorkIdAndMaintenanceTruckIdAndPreviousDateFromLocalDatabase(
        enterpriseId: string,
        workId: string,
        maintenanceTrucksWorkEquipmentId: string,
        previousDate: number
    ): Promise<number> {
        throw new Error('Method not implemented.')
    }
    loadAllFuelSupplyByEnterpriseIdAndWorkIdAndMaintenanceTruckIdAndStartDateAndEndDateFromLocalDatabase(
        enterpriseId: string,
        workId: string,
        maintenanceTrucksWorkEquipmentId: string,
        startDate: number,
        endDate: number
    ): Promise<FuelSupplyEntity[]> {
        throw new Error('Method not implemented.')
    }
    async createFuelSupplyInLocalDatabase(entity: FuelSupplyEntity): Promise<FuelSupplyEntity> {
        console.log('Creating Fuel Supply in the database')
        try {
            const entityCreated = await database.write(async () => {
                return await database.get<FuelSupplyModel>(TableName.FUEL_SUPPLYS).create((item) => {
                    item.quantity = entity.quantity
                    item.valuePerLiter = entity.valuePerLiter
                    item.value = entity.value
                    item.description = entity.description
                    item.supplyType = entity.supplyType
                    item.transportVehicleOrWorkEquipmentId = entity.transportVehicleOrWorkEquipmentId
                    item.isGasStation = entity.isGasStation
                    item.maintenanceTrucksWorkEquipmentId = entity.maintenanceTrucksWorkEquipmentId
                    item.hourMeterOrOdometer = +entity.hourMeterOrOdometer
                    item.isDiscount = entity.isDiscount
                    item.observation = entity.observation
                    item.invoiceId = +0
                    item.invoiceStatus = InvoiceStatus.PENDING
                    item.workId = entity.workId
                    item.enterpriseId = entity.enterpriseId
                    item.userId = entity.userId
                    item.userAction = UserAction.CREATE
                    item.isValid = true
                    item.serverId = +0
                })
            })
            if (entityCreated) {
                console.log('Entity created: ' + entityCreated)
                return new FuelSupplyEntity().modelToEntity(this.fuelSupplyMapper(entityCreated))
            }
        } catch (error) {
            console.log('[FuelSupply]= ' + error)
            throw new Error('Error create Fuel Supply in local database ')
        }
    }
    async updateFuelSupplyInLocalDatabase(entity: FuelSupplyEntity): Promise<FuelSupplyEntity> {
        console.log('Updating Fuel Supply in the database')
        try {
            const result = await database.write(async () => {
                const item = await database.get<FuelSupplyModel>(TableName.FUEL_SUPPLYS).find(entity.id)
                return await item.update(() => {
                    item.quantity = +entity.quantity
                    item.valuePerLiter = +entity.valuePerLiter
                    item.value = +entity.value
                    item.description = entity.description
                    item.hourMeterOrOdometer = entity.hourMeterOrOdometer
                    item.isDiscount = entity.isDiscount
                    item.observation = entity.observation
                    item.userId = entity.userId
                    item.userAction = UserAction.UPDATE
                })
            })
            return new FuelSupplyEntity().modelToEntity(this.fuelSupplyMapper(result))
        } catch (error) {
            console.log('[FuelSupply]: ' + error)
            throw new Error('Error updating Fuel Supply in local database: ')
        }
    }
    async deleteFuelSupplyInLocalDatabase(id: string, userId: string): Promise<void> {
        const a = await database
            .get(TableName.FUEL_SUPPLYS)
            .query(Q.where('id', id), Q.where('invoice_status', Q.notEq(InvoiceStatus.PENDING)))
            .fetchCount()

        if (a > 0) {
            throw new Error('Não é possível apagar o Abastecimento')
        }
        await database.write(async () => {
            const result = await database.get<FuelSupplyModel>(TableName.FUEL_SUPPLYS).find(id)
            await result.update(() => {
                result.isValid = false
                result.userId = userId
                result.userAction = UserAction.DELETE
            })
        })
    }
    saveFuelSupplyServerId(entiteis: FuelSupplyEntity[]): void {
        throw new Error('Method not implemented.')
    }

    loadById(id: string): Promise<FuelSupplyEntity> {
        throw new Error('Method not implemented.')
    }

    async loadLastSupplyByEnterpriseIdAndWorkIdAndMaintenanceTruckIdFromLocalDatabase(
        enterpriseId: string,
        workId: string,
        maintenanceTrucksWorkEquipmentId: string
    ): Promise<FuelSupplyEntity> {
        try {
            const result = await database
                .get<FuelSupplyModel>(TableName.FUEL_SUPPLYS)
                .query(
                    Q.sortBy('created_at', Q.desc),
                    Q.where('enterprise_id', enterpriseId),
                    Q.where('work_id', workId),
                    Q.where('is_valid', true),
                    Q.where('maintenance_trucks_work_equipment_id', maintenanceTrucksWorkEquipmentId),
                    Q.where('supply_type', FuelSupplyTypes.MAINTENANCE_TRUCK_TANK),
                    Q.take(1)
                )
                .fetch()

            return new FuelSupplyEntity().modelToEntity(this.fuelSupplyMapper(result[0]))
        } catch (error) {
            console.log('[FuelSupplyRepository]= ' + error)
            throw new Error('Error loading maintenace trucks fuel supply from local database.')
        }
    }

    async loadCurrentBalanceTankByEnterpriseIdAndWorkIdAndMaintenanceTruckIdFromLocalDatabase(
        enterpriseId: string,
        workId: string,
        maintenanceTrucksWorkEquipmentId: string
    ): Promise<number> {
        try {
            const totalTankPromise = database
                .get(TableName.FUEL_SUPPLYS)
                .query(
                    Q.unsafeSqlQuery(
                        `select sum(quantity) as total_tank from ${TableName.FUEL_SUPPLYS} where work_id = ? and maintenance_trucks_work_equipment_id = ? and enterprise_id = ? and supply_type = ? and is_valid = 1`,
                        [
                            workId,
                            maintenanceTrucksWorkEquipmentId,
                            enterpriseId,
                            FuelSupplyTypes.MAINTENANCE_TRUCK_TANK,
                        ]
                    )
                )
                .unsafeFetchRaw()
            const totalFueSupplyPromise = await database
                .get(TableName.FUEL_SUPPLYS)
                .query(
                    Q.unsafeSqlQuery(
                        `select sum(quantity) as total_fuel_supply from ${TableName.FUEL_SUPPLYS} where work_id = ? and maintenance_trucks_work_equipment_id = ? and enterprise_id = ? and supply_type <> ? and is_valid = 1`,
                        [
                            workId,
                            maintenanceTrucksWorkEquipmentId,
                            enterpriseId,
                            FuelSupplyTypes.MAINTENANCE_TRUCK_TANK,
                        ]
                    )
                )
                .unsafeFetchRaw()

            const [totalTank, totalFuelSupply] = await Promise.all([totalTankPromise, totalFueSupplyPromise])

            return (totalTank[0].total_tank ?? 0) - (totalFuelSupply[0].total_fuel_supply ?? 0)
        } catch (err) {
            console.log('[FuelSupplyRepository]= ' + err)
            throw new Error('Error loading maintenace trucks fuel supply from local database.')
        }
    }

    async loadAllFuelSupplyByEnterpriseIdAndWorkIdAndMaintenanceTruckIdFromLocalDatabase(
        enterpriseId: string,
        workId: string,
        maintenanceTrucksWorkEquipmentId: string
    ): Promise<FuelSupplyEntity[]> {
        try {
            const result = await database
                .get<FuelSupplyModel>(TableName.FUEL_SUPPLYS)
                .query(
                    Q.sortBy('created_at', Q.desc),
                    Q.where('enterprise_id', enterpriseId),
                    Q.where('work_id', workId),
                    Q.where('is_valid', true),
                    Q.where('maintenance_trucks_work_equipment_id', maintenanceTrucksWorkEquipmentId),
                    Q.where('invoice_status', InvoiceStatus.PENDING),
                    Q.where('invoice_id', 0)
                )
                .fetch()

            return await Promise.all(
                result.map(async (item: FuelSupplyModel) => {
                    return new FuelSupplyEntity().modelToEntity(this.fuelSupplyMapper(item))
                })
            )
        } catch (error) {
            console.log('[FuelSupplyRepository]: ' + error)
            throw new Error('Error loading fuel supply from local database.')
        }
    }

    async loadAllFuelSupplyByEnterpriseIdAndWorkIdAndMaintenanceTruckIdAndTypeFromLocalDatabase(
        enterpriseId: string,
        workId: string,
        maintenanceTrucksWorkEquipmentId: string,
        supplyType: string
    ): Promise<FuelSupplyEntity[]> {
        try {
            const result = await database
                .get<FuelSupplyModel>(TableName.FUEL_SUPPLYS)
                .query(
                    Q.sortBy('created_at', Q.desc),
                    Q.where('enterprise_id', enterpriseId),
                    Q.where('work_id', workId),
                    Q.where('is_valid', true),
                    Q.where('maintenance_trucks_work_equipment_id', maintenanceTrucksWorkEquipmentId),
                    Q.where('supply_type', supplyType),
                    Q.where('invoice_status', InvoiceStatus.PENDING),
                    Q.where('invoice_id', 0)
                )
                .fetch()

            return await Promise.all(
                result.map(async (item: FuelSupplyModel) => {
                    return new FuelSupplyEntity().modelToEntity(this.fuelSupplyMapper(item))
                })
            )
        } catch (error) {
            console.info('[FuelSupplyRepository]= ' + error)
            throw new Error('Error loading fuel supply from local database.')
        }
    }

    async loadAllFuelSupplyByEnterpriseIdAndWorkIdAndVehicleIdAndTypeFromLocalDatabase(
        enterpriseId: string,
        workId: string,
        transportVehicleOrWorkEquipmentId: string,
        supplyType: string
    ): Promise<FuelSupplyEntity[]> {
        try {
            const result = await database
                .get<FuelSupplyModel>(TableName.FUEL_SUPPLYS)
                .query(
                    Q.sortBy('created_at', Q.desc),
                    Q.where('enterprise_id', enterpriseId),
                    Q.where('work_id', workId),
                    Q.where('is_valid', true),
                    Q.where('transport_vehicle_or_work_equipment_id', transportVehicleOrWorkEquipmentId),
                    Q.where('supply_type', supplyType),
                    Q.where('maintenance_trucks_work_equipment_id', ''),
                    Q.where('invoice_status', InvoiceStatus.PENDING),
                    Q.where('invoice_id', 0)
                )
                .fetch()
            return await Promise.all(
                result.map(async (item: FuelSupplyModel) => {
                    return new FuelSupplyEntity().modelToEntity(this.fuelSupplyMapper(item))
                })
            )
        } catch (error) {
            console.log('[FuelSupplyRepository]= ' + error)
            throw new Error('Error loading fuel supply from local database.')
        }
    }

    private fuelSupplyMapper(model: FuelSupplyModel): FuelSupplyProps {
        return {
            quantity: model.quantity,
            valuePerLiter: model.valuePerLiter,
            value: model.value,
            description: model.description,
            supplyType: model.supplyType as FuelSupplyTypes,
            transportVehicleOrWorkEquipmentId: model.transportVehicleOrWorkEquipmentId,
            observation: model.observation,
            isGasStation: model.isGasStation,
            maintenanceTrucksWorkEquipmentId: model.maintenanceTrucksWorkEquipmentId,
            hourMeterOrOdometer: model.hourMeterOrOdometer,
            isDiscount: model.isDiscount,

            // Relacionamentos e Notas
            invoiceId: model.invoiceId,
            invoiceStatus: model.invoiceStatus as InvoiceStatus,
            workId: model.workId,

            // Propriedades da AbstractEntity
            serverId: model.serverId,
            id: model.id,
            userId: model.userId,
            userAction: model.userAction,
            enterpriseId: model.enterpriseId,
            isValid: model.isValid,
            createdAt: Number(model.createdAt),
            updatedAt: Number(model.updatedAt),
            status: model._raw._status,
        }
    }
}
