import { Database } from '@nozbe/watermelondb'
import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs'
import { TableName } from '../../../types'
import { schemas } from '../../../database/schemas'
import HourMeterMonitoringModel from '../../../database/model/HourMeterMonitoringModel'
import { HourMeterMonitoringWatermelonDbRepository } from '../HourMeterMonitoringWatermelonDbRepository'
import {
    hourMeterMonitoringEntity,
    hourMeterMonitoringIDEntity,
    makeHourMeterMonitoringDtoMock,
} from './feke-data/HourMeterMonitoringData'
import { HourMeterMonitoringEntity } from '@gestor/domain/entity/hour-meter-monitoring/HourMeterMonitoringEntity'

const adapter = new LokiJSAdapter({
    dbName: 'TEST-DB',
    schema: schemas,
    useWebWorker: false,
    useIncrementalIndexedDB: true,
})

const database = new Database({
    adapter,
    modelClasses: [HourMeterMonitoringModel],
})

const myMock = makeHourMeterMonitoringDtoMock()

describe('HourMeterMonitoringWatermelonDbRepository', () => {
    let repository: HourMeterMonitoringWatermelonDbRepository
    beforeEach(async () => {
        //repository = new HourMeterMonitoringWatermelonDbRepository()
        await database.write(async () => {
            await database.get(TableName.HOUR_METER_MONITORINGS).query().destroyAllPermanently()
        })
    })

    describe('Tests for the HourMeterMonitoring repository', () => {
        it('Must successfully create a model and return to the entity.', async () => {
            const result =
                await repository.createHourMeterMonitoringInLocalDatabase(hourMeterMonitoringEntity)
            const list =
                await repository.loadAllHourMeterMonitoringByEnterpriseIdAndWorkIdAndWorkEquipmentIdFromLocalDatabase(
                    hourMeterMonitoringEntity.enterpriseId,
                    hourMeterMonitoringEntity.workId,
                    hourMeterMonitoringEntity.workEquipmentId
                )
            expect(hourMeterMonitoringEntity.workEquipment).toEqual(result.workEquipment)
            expect(list.length).toBe(1)
        })

        it('hould throw a custom error if writing to the database fails.', async () => {
            await expect(repository.createHourMeterMonitoringInLocalDatabase(undefined)).rejects.toThrow(
                'Error create  Hour Meter Monitoring in local database '
            )
        })

        it('You should search for a model by ID, update it, and return an entity.', async () => {})

        it('Should create and then delete a record.', async () => {})

        it('Should look for a list.', async () => {
            const result =
                await repository.loadAllHourMeterMonitoringByEnterpriseIdAndWorkIdAndDateFromLocalDatabase(
                    hourMeterMonitoringEntity.enterpriseId,
                    hourMeterMonitoringEntity.workId,
                    '28/02/2025'
                )
            expect(result).toBeDefined()
        })
    })
})
