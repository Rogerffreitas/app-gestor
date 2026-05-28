import { Database, Q } from '@nozbe/watermelondb'
import EquipmentModel from '../../database/model/EquipmentModel'
import { TableName, UserAction } from '../../types'
import { EquipmentRepositoryGateway } from '@gestor/domain/application/gateways/EquipmentRepositoryGateway'
import { EquipmentEntity } from '@gestor/domain/entity/equipment/EquipmentEntity'
import { BankInformation } from '@gestor/domain/entity/bank-information/BankInformation'
import Mappers from './mappers'

export class EquipmentWatermelonDbResitory implements EquipmentRepositoryGateway {
    private readonly database: Database
    constructor(db: Database) {
        this.database = db
    }

    async updateHourMeterOrOdometerInLocalDatabase(entity: EquipmentEntity): Promise<EquipmentEntity> {
        console.log('Updating equipment in the database')
        try {
            const result = await this.database.write(async () => {
                const item = await this.database.get<EquipmentModel>(TableName.EQUIPMENTS).find(entity.id)
                return await item.update(() => {
                    item.hourMeterOrOdometer = +entity.hourMeterOrOdometer
                    item.userId = entity.userId
                    item.userAction = UserAction.UPDATE
                })
            })
            return new EquipmentEntity().modelToEntity(Mappers.equipmentMapper(result))
        } catch (error) {
            console.log('[Equipment]: ' + error)
            throw new Error('Error update equipament in local database: ', { cause: error })
        }
    }
    async updateEquipmentBankInformation(
        id: string,
        bankInformation: BankInformation
    ): Promise<EquipmentEntity> {
        try {
            const entityUpdated = await this.database.write(async () => {
                const result = await this.database.get<EquipmentModel>(TableName.EQUIPMENTS).find(id)
                return await result.update((item) => {
                    item.bank = bankInformation.bank
                    item.beneficiary = bankInformation.beneficiary
                    item.agency = bankInformation.agency
                    item.account = bankInformation.account
                    item.pix = bankInformation.pix
                })
            })
            return new EquipmentEntity().modelToEntity(Mappers.equipmentMapper(entityUpdated))
        } catch (error) {
            console.log('[Equipment]: ' + error)
            throw new Error('An error occurred while updating bank information', { cause: error })
        }
    }

    async createEquipmentInLocalDatabase(entity: EquipmentEntity): Promise<EquipmentEntity> {
        console.log('Creating equipment in the database')

        try {
            const entityCreated = await this.database.write(async () => {
                return await this.database.get<EquipmentModel>(TableName.EQUIPMENTS).create((item) => {
                    item.nameProprietary = entity.nameProprietary
                    item.cpfCnpjProprietary = entity.cpfCnpjProprietary
                    item.telProprietary = entity.telProprietary
                    item.startRental = entity.startRental
                    item.monthlyPayment = +entity.monthlyPayment
                    item.valuePerHourKm = +entity.valuePerHourKm
                    item.valuePerDay = +entity.valuePerDay
                    item.hourMeterOrOdometer = +entity.hourMeterOrOdometer
                    item.operatorMotorist = entity.operatorMotorist
                    item.isEquipment = entity.isEquipment
                    item.modelOrPlate = entity.modelOrPlate
                    item.enterpriseId = entity.enterpriseId
                    item.userId = entity.userId
                    item.userAction = UserAction.CREATE
                    item.isValid = true
                    item.serverId = +0
                })
            })
            return new EquipmentEntity().modelToEntity(Mappers.equipmentMapper(entityCreated))
        } catch (error) {
            console.log('[Equipment]: ' + error)
            throw new Error('Error create equipament in local database ', { cause: error })
        }
    }
    async updateEquipmentInLocalDatabase(entity: EquipmentEntity): Promise<EquipmentEntity> {
        console.log('Updating equipment in the database')
        try {
            const result = await this.database.write(async () => {
                const item = await this.database.get<EquipmentModel>(TableName.EQUIPMENTS).find(entity.id)
                return await item.update(() => {
                    item.nameProprietary = entity.nameProprietary
                    item.cpfCnpjProprietary = entity.cpfCnpjProprietary
                    item.telProprietary = entity.telProprietary
                    item.startRental = entity.startRental
                    item.monthlyPayment = +entity.monthlyPayment
                    item.valuePerHourKm = +entity.valuePerHourKm
                    item.valuePerDay = +entity.valuePerDay
                    item.hourMeterOrOdometer = +entity.hourMeterOrOdometer
                    item.operatorMotorist = entity.operatorMotorist
                    item.modelOrPlate = entity.modelOrPlate
                    item.userId = entity.userId
                    item.userAction = UserAction.UPDATE
                })
            })
            return new EquipmentEntity().modelToEntity(Mappers.equipmentMapper(result))
        } catch (error) {
            console.log('[Equipment]: ' + error)
            throw new Error('Error update equipament in local database: ', { cause: error })
        }
    }
    async deleteEquipmentInLocalDatabase(id: string, userId: string): Promise<void> {
        const [hourMeterCount, fuelCount, discountCount] = await Promise.all([
            this.database
                .get(TableName.HOUR_METER_MONITORINGS)
                .query(Q.where('work_equipment_id', id))
                .fetchCount(),
            this.database
                .get(TableName.FUEL_SUPPLYS)
                .query(Q.where('transport_vehicle_or_equipment_id', id))
                .fetchCount(),
            this.database
                .get(TableName.DISCOUNTS)
                .query(Q.where('transport_vehicle_or_equipment_id', id))
                .fetchCount(),
        ])

        const totalDependencies = hourMeterCount + fuelCount + discountCount

        if (totalDependencies > 0) {
            throw new Error('Existem registros associados (Horimetro, combustível ou descontos).')
        }
        await this.database.write(async () => {
            const equipment = await this.database.get<EquipmentModel>(TableName.EQUIPMENTS).find(id)
            await equipment.update(() => {
                equipment.userAction = UserAction.DELETE
                equipment.userId = userId
                equipment.isValid = false
            })
        })
    }
    async findEquipmentByIdInLocalDatabase(id: string): Promise<EquipmentEntity> {
        try {
            const result = await this.database.get<EquipmentModel>(TableName.EQUIPMENTS).find(id)
            return new EquipmentEntity().modelToEntity(Mappers.equipmentMapper(result))
        } catch (error) {
            console.log('[Equipment]: ' + error)
            throw new Error('Error find equipament in local database: ', { cause: error })
        }
    }
    async loadAllEquipmentByEnterpriseIdFromLocalDatabase(enterpriseId: string): Promise<EquipmentEntity[]> {
        try {
            const result = await this.database
                .get<EquipmentModel>(TableName.EQUIPMENTS)
                .query(Q.where('enterprise_id', enterpriseId), Q.where('is_valid', true))
                .fetch()

            return result.map((item) => new EquipmentEntity().modelToEntity(Mappers.equipmentMapper(item)))
        } catch (error) {
            console.log('[Equipment]: ' + error)
            throw new Error('an error occurred while trying to load list ', { cause: error })
        }
    }

    async loadAllEquipmentByEnterpriseIdAndServerIdValidFromLocalDatabase(
        enterpriseId: string
    ): Promise<EquipmentEntity[]> {
        try {
            const result = await this.database
                .get<EquipmentModel>(TableName.EQUIPMENTS)
                .query(
                    Q.where('enterprise_id', enterpriseId),
                    Q.where('is_valid', true),
                    Q.where('server_id', Q.gt(0))
                )
                .fetch()

            return result.map((item) => {
                return new EquipmentEntity().modelToEntity(Mappers.equipmentMapper(item))
            })
        } catch (error) {
            console.log('[Equipment]: ' + error)
            throw new Error('an error occurred while trying to load list ', { cause: error })
        }
    }
}
