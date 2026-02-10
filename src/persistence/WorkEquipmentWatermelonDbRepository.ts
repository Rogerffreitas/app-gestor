import { WorkEquipmentRepositoryGateway } from '../domin/application/gateways/WorkEquipmentRepositoryGateway'
import { WorkEquipmentEntity } from '../domin/entity/work-equipment/WorkEquipmentEntity'
import WorkEquipmentModel from '../database/model/WorkEquipmentModel'
import { database } from '../database'
import { Q } from '@nozbe/watermelondb'
import { TableName, UserAction } from '../types'

export class WorkEquipmentWatermelonDbRepository implements WorkEquipmentRepositoryGateway {
    async createWorkEquipmentInLocalDatabase(entity: WorkEquipmentEntity): Promise<WorkEquipmentEntity> {
        console.log('Creating WorkEquipment in the database')
        try {
            const entityCreated = await database.write(async () => {
                return await database.get<WorkEquipmentModel>(TableName.WORK_EQUIPMENTS).create((item) => {
                    item.equipmentId = entity.equipment.id
                    item.isEquipment = entity.isEquipment
                    item.nameProprietary = entity.nameProprietary
                    item.hourMeterOrOdometer = +entity.hourMeterOrOdometer
                    item.startRental = entity.startRental
                    item.monthlyPayment = +entity.monthlyPayment
                    item.valuePerHourKm = +entity.valuePerHourKm
                    item.valuePerDay = +entity.valuePerDay
                    item.operatorMotorist = entity.operatorMotorist
                    item.modelOrPlate = entity.modelOrPlate
                    item.workId = entity.workId
                    item.enterpriseId = entity.enterpriseId
                    item.userId = entity.userId
                    item.userAction = entity.userAction
                    item.isValid = entity.isValid
                    item.serverId = entity.serverId
                })
            })
            return new WorkEquipmentEntity().modelToEntity(entityCreated)
        } catch (error) {
            console.log('[WorkEquipmentRepository]: ' + error)
            throw new Error('Error create equipament in local database: ', { cause: error })
        }
    }
    async deleteWorkEquipmentInLocalDatabase(id: string, userId: string): Promise<void> {
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
        try {
            await database.write(async () => {
                const result = await database.get<WorkEquipmentModel>(TableName.WORK_EQUIPMENTS).find(id)
                await result.update(() => {
                    result.userId = userId
                    result.userAction = UserAction.DELETE
                    result.isValid = false
                })
            })
        } catch (error) {
            console.error('[WorkEquipmentRepository]: Error deleting Equipament in local database.', error)
            throw new Error('Error deleting Equipament in local database.', { cause: error })
        }
    }
    async loadAllWorkEquipmentByEnterpriseIdFromLocalDatabase(
        workId: string,
        enterpriseId: string
    ): Promise<WorkEquipmentEntity[]> {
        try {
            const result = await database
                .get<WorkEquipmentModel>(TableName.WORK_EQUIPMENTS)
                .query(
                    Q.sortBy('created_at', Q.desc),
                    Q.where('is_valid', true),
                    Q.where('enterprise_id', enterpriseId),
                    Q.where('work_id', workId)
                )
            return await Promise.all(
                result.map((item: WorkEquipmentModel) => {
                    return new WorkEquipmentEntity().modelToEntity(item)
                })
            )
        } catch (error) {
            console.log('[WorkEquipmentRepository]: ' + error)
            throw new Error('Error loading work equipments from local database.', { cause: error })
        }
    }
    saveWorkEquipmentServerId(entitys: WorkEquipmentEntity[]): void {
        throw new Error('Method not implemented.')
    }
    async loadAllWorkEquipmentByEnterpriseIdAndServerIdValidFromLocalDatabase(
        workId: string,
        enterpriseId: string
    ): Promise<WorkEquipmentEntity[]> {
        try {
            const result = await database.get<WorkEquipmentModel>(TableName.WORK_EQUIPMENTS).query(
                Q.sortBy('created_at', Q.desc),
                Q.where('is_valid', true),
                Q.where('enterprise_id', enterpriseId),
                Q.where('work_id', workId)
                //Q.where('server_id', Q.gt(0))
            )
            return await Promise.all(
                result.map((item: WorkEquipmentModel) => {
                    return new WorkEquipmentEntity().modelToEntity(item)
                })
            )
        } catch (error) {
            console.log('[WorkEquipmentRepository]: ' + error)
            throw new Error('Error loading work equipments from local database.', { cause: error })
        }
    }
}
