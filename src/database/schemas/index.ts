import { appSchema } from '@nozbe/watermelondb'
import { workSchema } from './WorkSchema'
import { materialTransportSchema } from './MaterialTransportSchema'
import { workRoutesSchema } from './WorkRoutesSchema'
import { transportVehicleSchema } from './TransportVehicleSchema'
import { materialSchema } from './MaterialShema'
import { fuelSupplySchema } from './FuelSupplySchema'
import { equipmentSchema } from './EquipmentSchema'
import { hourMeterMonitoringSchema } from './HourMeterMonitoringSchema'
import { maintenanceTruckSchema } from './MaintenanceTruckSchema'
import { depositSchema } from './DepositSchema'
import { workEquipmentSchema } from './WorkEquipmentSchema'
import { discountSchema } from './DiscountSchema'

export const schemas = appSchema({
    version: 1,
    tables: [
        workSchema,
        materialTransportSchema,
        workRoutesSchema,
        transportVehicleSchema,
        materialSchema,
        discountSchema,
        fuelSupplySchema,
        equipmentSchema,
        hourMeterMonitoringSchema,
        maintenanceTruckSchema,
        depositSchema,
        workEquipmentSchema,
    ],
})
