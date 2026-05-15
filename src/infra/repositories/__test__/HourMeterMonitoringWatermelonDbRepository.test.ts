import { Database } from '@nozbe/watermelondb'
import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs'
import { TableName } from '../../../types'
import { schemas } from '../../../database/schemas'
import HourMeterMonitoringModel from '../../../database/model/HourMeterMonitoringModel'
import { HourMeterMonitoringWatermelonDbRepository } from '../HourMeterMonitoringWatermelonDbRepository'
import {
    hourMeterMonitoringEntity,
    makeHourMeterMonitoringDtoMock,
} from './feke-data/HourMeterMonitoringData'

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

describe('HourMeterMonitoringWatermelonDbRepository', () => {
    let repository: HourMeterMonitoringWatermelonDbRepository
    beforeEach(async () => {
        repository = new HourMeterMonitoringWatermelonDbRepository()
        await database.write(async () => {
            await database.get(TableName.HOUR_METER_MONITORINGS).query().destroyAllPermanently()
        })
    })

    describe('Tests for the HourMeterMonitoring repository', () => {
        it('hould throw a custom error if writing to the database fails.', async () => {
            await expect(repository.createHourMeterMonitoringInLocalDatabase(undefined)).rejects.toThrow(
                /Error create  Hour Meter Monitoring in local database./
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
