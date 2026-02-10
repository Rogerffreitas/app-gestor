import { EquipmentRepositoryGateway } from '../domin/application/gateways/EquipmentRepositoryGateway'
import { BankInformation } from '../domin/entity/bank-information/BankInformation'
import { EquipmentEntity } from '../domin/entity/equipment/EquipmentEntity'
import { Q } from '@nozbe/watermelondb'
import { database } from '../database'
import EquipmentModel from '../database/model/EquipmentModel'
import { TableName } from '../types'

export class EquipmentWatermelonDbResitory implements EquipmentRepositoryGateway {
    async updateEquipmentBankInformation(
        id: string,
        bankInformation: BankInformation
    ): Promise<EquipmentEntity> {
        try {
            const entityUpdated = await database.write(async () => {
                const result = await database.get<EquipmentModel>(TableName.EQUIPMENTS).find(id)
                return await result.update((item) => {
                    item.bank = bankInformation.bank
                    item.beneficiary = bankInformation.beneficiary
                    item.agency = bankInformation.agency
                    item.account = bankInformation.account
                    item.pix = bankInformation.pix
                })
            })
            return new EquipmentEntity().modelToEntity(entityUpdated)
        } catch (error) {
            console.log('[Equipment]: ' + error)
            throw new Error('An error occurred while updating bank information', { cause: error })
        }
    }
    async loadAllEquipmentByEnterpriseIdAndWorkIdFromLocalDatabase(
        enterpriseId: string,
        workId: string
    ): Promise<EquipmentEntity[]> {
        try {
            const result = await database
                .get<EquipmentModel>(TableName.EQUIPMENTS)
                .query(
                    Q.unsafeSqlQuery(
                        `select equipamentos.* from equipamentos inner join obra_equipamentos on ` +
                            `obra_equipamentos.obra_id = '` +
                            workId +
                            `' and obra_equipamentos.equipamento_id = equipamentos.id  ` +
                            `where equipamentos.empresa_id = ` +
                            enterpriseId +
                            ` group by(equipamentos.id)`
                    )
                )
                .fetch()

            return result.map((item) => new EquipmentEntity().modelToEntity(item))
        } catch (error) {
            console.log('[Equipment]: ' + error)
            throw new Error('an error occurred while trying to load list ', { cause: error })
        }
    }
    async createEquipmentInLocalDatabase(entity: EquipmentEntity): Promise<EquipmentEntity> {
        console.log('Creating equipment in the database')

        try {
            let entityCreated: EquipmentModel
            await database.write(async () => {
                entityCreated = await database.get<EquipmentModel>(TableName.EQUIPMENTS).create((item) => {
                    item.nameProprietary = entity.nameProprietary
                    item.cpfCnpjProprietary = entity.cpfCnpjProprietary
                    item.telProprietary = entity.telProprietary

                    item.startRental = entity.startRental
                    item.monthlyPayment = entity.monthlyPayment
                    item.valuePerHourKm = entity.valuePerHourKm
                    item.valuePerDay = entity.valuePerDay
                    item.hourMeterOrOdometer = entity.hourMeterOrOdometer

                    item.operatorMotorist = entity.operatorMotorist
                    item.isEquipment = entity.isEquipment

                    item.modelOrPlate = entity.modelOrPlate
                    item.enterpriseId = entity.enterpriseId
                    item.userId = entity.userId
                    item.userAction = entity.userAction
                    item.isValid = entity.isValid
                    item.serverId = entity.serverId
                })
            })
            return new EquipmentEntity().modelToEntity(entityCreated)
        } catch (error) {
            console.log('[Equipment]: ' + error)
            throw new Error('Error create equipament in local database ', { cause: error })
        }
    }
    async updateEquipmentInLocalDatabase(entity: EquipmentEntity): Promise<EquipmentEntity> {
        console.log('Updating equipment in the database')
        try {
            let result: EquipmentModel
            await database.write(async () => {
                const item = await database.get<EquipmentModel>(TableName.EQUIPMENTS).find(entity.id)
                result = await item.update(() => {
                    item.nameProprietary = entity.nameProprietary
                    item.cpfCnpjProprietary = entity.cpfCnpjProprietary
                    item.telProprietary = entity.telProprietary
                    item.startRental = entity.startRental
                    item.monthlyPayment = entity.monthlyPayment
                    item.valuePerHourKm = entity.valuePerHourKm
                    item.valuePerDay = entity.valuePerDay
                    item.hourMeterOrOdometer = entity.hourMeterOrOdometer
                    item.operatorMotorist = entity.operatorMotorist
                    item.modelOrPlate = entity.modelOrPlate
                    item.userId = entity.userId
                    item.userAction = entity.userAction
                })
            })
            return new EquipmentEntity().modelToEntity(result)
        } catch (error) {
            console.log('[Equipment]: ' + error)
            throw new Error('Error create equipament in local database: ', { cause: error })
        }
    }
    async deleteEquipmentInLocalDatabase(id: string, userId: string): Promise<void> {
        const [hourMeterCount, fuelCount, discountCount] = await Promise.all([
            database
                .get(TableName.HOUR_METER_MONITORINGS)
                .query(Q.where('work_equipment_id', id))
                .fetchCount(),
            database
                .get(TableName.FUEL_SUPPLYS)
                .query(Q.where('transport_vehicle_or_equipment_id', id))
                .fetchCount(),
            database
                .get(TableName.DISCOUNTS)
                .query(Q.where('transport_vehicle_or_equipment_id', id))
                .fetchCount(),
        ])

        const totalDependencies = hourMeterCount + fuelCount + discountCount

        if (totalDependencies > 0) {
            throw new Error('Existem registros associados (Horimetro, combustível ou descontos).')
        }

        await database.write(async () => {
            const equipment = await database.get<EquipmentModel>(TableName.EQUIPMENTS).find(id)
            await equipment.update(() => {
                equipment.userAction = 2
                equipment.userId = userId
                equipment.isValid = false
            })
        })
    }
    findEquipmentByIdInLocalDatabase(id: string): Promise<EquipmentEntity> {
        throw new Error('Method not implemented.')
    }
    async loadAllEquipmentByEnterpriseIdFromLocalDatabase(enterpriseId: string): Promise<EquipmentEntity[]> {
        try {
            const result = await database
                .get<EquipmentModel>(TableName.EQUIPMENTS)
                .query(Q.where('enterprise_id', enterpriseId), Q.where('is_valid', true))
                .fetch()

            return result.map((item) => new EquipmentEntity().modelToEntity(item))
        } catch (error) {
            console.log('[Equipment]: ' + error)
            throw new Error('an error occurred while trying to load list ', { cause: error })
        }
    }
    saveEquipmentServerId(entitys: EquipmentEntity[]): void {
        throw new Error('Method not implemented.')
    }
    async loadAllEquipmentByEnterpriseIdAndServerIdValidFromLocalDatabase(
        enterpriseId: string
    ): Promise<EquipmentEntity[]> {
        try {
            const result = await database
                .get<EquipmentModel>(TableName.EQUIPMENTS)
                .query(
                    Q.where('enterprise_id', enterpriseId),
                    Q.where('is_valid', true),
                    Q.where('server_id', Q.gt(0))
                )
                .fetch()

            return result.map((item) => {
                return new EquipmentEntity().modelToEntity(item)
            })
        } catch (error) {
            console.log('[Equipment]: ' + error)
            throw new Error('an error occurred while trying to load list ', { cause: error })
        }
    }
}
