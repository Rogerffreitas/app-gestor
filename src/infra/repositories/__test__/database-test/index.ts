import DiscountModel from '@/src/database/model/DiscountModel'
import FuelSupplyModel from '../../../../database/model/FuelSupplyModel'
import { schemas } from '../../../../database/schemas'
import { Database } from '@nozbe/watermelondb'
import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs'
import DepositModel from '@/src/database/model/DepositModel'
import WorkModel from '@/src/database/model/WorkModel'
import WorkRouteModel from '@/src/database/model/WorkRouteModel'
import TransportVehicleModel from '@/src/database/model/TransportVehicleModel'
import MaterialModel from '@/src/database/model/MaterialModel'
import MaterialTransportModel from '@/src/database/model/MaterialTransportModel'
import EquipmentModel from '@/src/database/model/EquipmentModel'
import HourMeterMonitoringModel from '@/src/database/model/HourMeterMonitoringModel'
import MaintenanceTruckModel from '@/src/database/model/MaintenanceTruckModel'
import WorkEquipmentModel from '@/src/database/model/WorkEquipmentModel'

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
    modelClasses: [
        FuelSupplyModel,
        DiscountModel,
        DepositModel,
        WorkModel,
        WorkRouteModel,
        TransportVehicleModel,
        MaterialModel,
        MaterialTransportModel,
        EquipmentModel,
        HourMeterMonitoringModel,
        MaintenanceTruckModel,
        WorkEquipmentModel,
        HourMeterMonitoringModel,
    ],
})
