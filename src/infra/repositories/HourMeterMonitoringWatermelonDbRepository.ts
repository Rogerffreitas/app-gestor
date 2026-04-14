import { database } from '../../database'
import { Q } from '@nozbe/watermelondb'
import HourMeterMonitoringModel from '../../database/model/HourMeterMonitoringModel'
import { HourMeterMonitoringRepositoryGateway } from '../../domin/application/gateways/HourMeterMonitoringRepositoryGateway'
import { HourMeterMonitoringEntity } from '../../domin/entity/hour-meter-monitoring/HourMeterMonitoringEntity'
import { InvoiceStatus, TableName, UserAction } from '../../types'

export class HourMeterMonitoringWatermelonDbRepository implements HourMeterMonitoringRepositoryGateway {
    async createHourMeterMonitoringInLocalDatabase(
        entity: HourMeterMonitoringEntity
    ): Promise<HourMeterMonitoringEntity> {
        console.log('Creating Hour Meter Monitoring in the database')
        try {
            const entityCreated = await database.write(async () => {
                return await database
                    .get<HourMeterMonitoringModel>(TableName.HOUR_METER_MONITORINGS)
                    .create((item) => {
                        item.value = +entity.value
                        item.date = entity.date
                        item.initialHourMeterValue = entity.initialHourMeterValue
                        item.currentHourMeterValue = entity.currentHourMeterValue
                        item.totalCalculatedInThePeriodInformed = entity.totalCalculatedInThePeriodInformed
                        item.workEquipmentId = entity.workEquipmentId
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
            console.log('Entity created: ' + entityCreated)
            return new HourMeterMonitoringEntity().modelToEntity(entityCreated)
        } catch (error) {
            console.log('[HourMeterMonitoring]: ' + error)
            throw new Error('Error create  Hour Meter Monitoring in local database ', { cause: error })
        }
    }
    async updateHourMeterMonitoringInLocalDatabase(
        entity: HourMeterMonitoringEntity
    ): Promise<HourMeterMonitoringEntity> {
        console.log('Updating Hour Meter Monitoring in the database')
        try {
            const entityCreated = await database.write(async () => {
                const item = await database
                    .get<HourMeterMonitoringModel>(TableName.HOUR_METER_MONITORINGS)
                    .find(entity.id)
                return await item.update((item) => {
                    item.value = +entity.value
                    item.date = entity.date
                    item.initialHourMeterValue = entity.initialHourMeterValue
                    item.currentHourMeterValue = entity.currentHourMeterValue
                    item.totalCalculatedInThePeriodInformed = entity.totalCalculatedInThePeriodInformed
                    item.observation = entity.observation
                    item.userId = entity.userId
                    item.userAction = UserAction.UPDATE
                })
            })
            console.log('Entity created: ' + entityCreated)
            return new HourMeterMonitoringEntity().modelToEntity(entityCreated)
        } catch (error) {
            console.log('[HourMeterMonitoring]: ' + error)
            throw new Error('Error updating  Hour Meter Monitoring in local database ', { cause: error })
        }
    }
    async deleteHourMeterMonitoringInLocalDatabase(id: string, userId: string): Promise<void> {
        try {
            const a = await database
                .get(TableName.HOUR_METER_MONITORINGS)
                .query(Q.where('id', id), Q.where('invoice_status', Q.notEq(InvoiceStatus.PENDING)))
                .fetchCount()

            if (a > 0) {
                throw new Error('Não é possível apagar o Apontamento')
            }
            await database.write(async () => {
                const result = await database
                    .get<HourMeterMonitoringModel>(TableName.HOUR_METER_MONITORINGS)
                    .find(id)
                await result.update(() => {
                    result.isValid = false
                    result.userId = userId
                    result.userAction = UserAction.DELETE
                })
            })
        } catch (error) {
            console.log('[HourMeterMonitoring]: ' + error)
            throw new Error('Error updating  Hour Meter Monitoring in local database ', { cause: error })
        }
    }
    async findHourMeterMonitoringByIdInLocalDatabase(id: string): Promise<HourMeterMonitoringEntity> {
        try {
            const result = await database
                .get<HourMeterMonitoringModel>(TableName.HOUR_METER_MONITORINGS)
                .find(id)
            if (result) {
                return new HourMeterMonitoringEntity().modelToEntity(result)
            }
            return null
        } catch (error) {
            console.log('[HourMeterMonitoring]: ' + error)
            throw new Error('Error loading HourMeterMonitoring from local database.', {
                cause: error,
            })
        }
    }
    saveHourMeterMonitoringServerId(entities: HourMeterMonitoringEntity[]): void {
        throw new Error('Method not implemented.')
    }
    async loadAllHourMeterMonitoringByEnterpriseIdAndWorkIdAndWorkEquipmentIdFromLocalDatabase(
        enterpriseId: string,
        workId: string,
        workEquipmentId: string
    ): Promise<HourMeterMonitoringEntity[]> {
        try {
            const result = await database
                .get<HourMeterMonitoringModel>(TableName.HOUR_METER_MONITORINGS)
                .query(
                    Q.sortBy('created_at', Q.desc),
                    Q.where('enterprise_id', enterpriseId),
                    Q.where('work_id', workId),
                    Q.where('is_valid', true),
                    Q.where('work_equipment_id', workEquipmentId),
                    Q.where('invoice_id', 0),
                    Q.where('invoice_status', InvoiceStatus.PENDING)
                )
                .fetch()

            return await Promise.all(
                result.map(async (item: HourMeterMonitoringModel) => {
                    return new HourMeterMonitoringEntity().modelToEntity(item)
                })
            )
        } catch (error) {
            console.log('[HourMeterMonitoring]: ' + error)
            throw new Error('Error loading Hour Meter Monitoring from local database.')
        }
    }
    async findLastHourMeterReading(
        enterpriseId: string,
        workId: string,
        workEquipmentId: string
    ): Promise<HourMeterMonitoringEntity> {
        try {
            const result = await database
                .get<HourMeterMonitoringModel>(TableName.HOUR_METER_MONITORINGS)
                .query(
                    Q.sortBy('current_hour_meter_value', Q.desc),
                    Q.where('enterprise_id', enterpriseId),
                    Q.where('work_id', workId),
                    Q.where('is_valid', true),
                    Q.where('work_equipment_id', workEquipmentId),
                    Q.take(1)
                )
                .fetch()
            return new HourMeterMonitoringEntity().modelToEntity(result[0])
        } catch (error) {
            console.log('[HourMeterMonitoring]: ' + error)
            throw new Error('Error loading Hour Meter Monitoring from local database.')
        }
    }
    async loadAllHourMeterMonitoringByEnterpriseIdAndWorkIdAndDateFromLocalDatabase(
        enterpriseId: string,
        workId: string,
        date: string
    ): Promise<HourMeterMonitoringEntity[]> {
        try {
            const result = await database
                .get<HourMeterMonitoringModel>(TableName.HOUR_METER_MONITORINGS)
                .query(
                    Q.sortBy('created_at', Q.desc),
                    Q.where('enterprise_id', enterpriseId),
                    Q.where('work_id', workId),
                    Q.where('is_valid', true),
                    Q.where('date', date)
                )
                .fetch()

            return await Promise.all(
                result.map(async (item: HourMeterMonitoringModel) => {
                    return new HourMeterMonitoringEntity().modelToEntity(item)
                })
            )
        } catch (error) {
            console.log('[HourMeterMonitoring]: ' + error)
            throw new Error('Error loading Hour Meter Monitoring from local database.')
        }
    }
}
