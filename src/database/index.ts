import { Database } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'

import { schemas } from './schemas'
import migrations from './migrations/migrations'
import MaterialTransportModel from './model/MaterialTransportModel'
import WorkModel from './model/WorkModel'
import WorkRoutesModel from './model/WorkRoutesModel'
import TransportVehicleModel from './model/TransportVehicleModel'
import MaterialModel from './model/MaterialModel'
import DiscountModel from './model/DiscountModel'
import FuelSupplyModel from './model/FuelSupplyModel'
import EquipmentModel from './model/EquipmentModel'
import HourMeterMonitoringModel from './model/HourMeterMonitoringModel'
import MaintenanceTruckModel from './model/MaintenanceTruckModel'
import Deposit from './model/DepositModel'
import ObraWorkEquipmentModel from './model/WorkEquipmentModel'

import { setGenerator } from '@nozbe/watermelondb/utils/common/randomId'
import uuid from 'react-native-uuid'
import WorkEquipmentModel from './model/WorkEquipmentModel'

const adapter = new SQLiteAdapter({
    schema: schemas,
    migrations,
    onSetUpError: (error) => {
        console.log(error)
    },
})

setGenerator(() => uuid.v4().toString())

export const database = new Database({
    adapter,
    modelClasses: [
        TransportVehicleModel,
        ObraWorkEquipmentModel,
        MaterialTransportModel,
        WorkModel,
        WorkRoutesModel,
        MaterialModel,
        DiscountModel,
        FuelSupplyModel,
        EquipmentModel,
        HourMeterMonitoringModel,
        MaintenanceTruckModel,
        WorkEquipmentModel,
        Deposit,
    ],
})
