import { tableSchema } from '@nozbe/watermelondb'

export const fuelSupplySchema = tableSchema({
    name: 'fuel_supplys',
    columns: [
        { name: 'server_id', type: 'number', isOptional: true },
        { name: 'description', type: 'string' },
        { name: 'value', type: 'number' },
        { name: 'quantity', type: 'number' },
        { name: 'value_per_liter', type: 'number' },
        { name: 'type', type: 'string' },
        { name: 'transport_vehicle_or_equipment_id', type: 'string' },
        { name: 'observation', type: 'string' },
        { name: 'is_gas_station', type: 'boolean' },
        { name: 'maintenance_trucks_work_equipment_id', type: 'string' },
        { name: 'hour_meter_or_km_meter', type: 'number' },
        { name: 'is_discount', type: 'boolean' },
        { name: 'invoice_id', type: 'number' },
        { name: 'invoice_status', type: 'string' },

        { name: 'work_id', type: 'string' },
        { name: 'enterprise_id', type: 'string' },
        { name: 'user_id', type: 'string' },
        { name: 'user_action', type: 'number' },
        { name: 'is_valid', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
        ,
    ],
})
