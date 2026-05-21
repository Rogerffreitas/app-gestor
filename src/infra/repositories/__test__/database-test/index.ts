import DiscountModel from '@/src/database/model/DiscountModel'
import FuelSupplyModel from '../../../../database/model/FuelSupplyModel'
import { schemas } from '../../../../database/schemas'
import { Database } from '@nozbe/watermelondb'
import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs'
import DepositModel from '@/src/database/model/DepositModel'
import WorkModel from '@/src/database/model/WorkModel'
import WorkRouteModel from '@/src/database/model/WorkRouteModel'

const adapter = new LokiJSAdapter({
    dbName: 'TEST-DB',
    schema: schemas,
    useWebWorker: false,
    useIncrementalIndexedDB: true,
    extraLokiOptions: {
        autosave: false,
    },
})

export const database = new Database({
    adapter,
    modelClasses: [FuelSupplyModel, DiscountModel, DepositModel, WorkModel, WorkRouteModel],
})
