import { tableSchema } from '@nozbe/watermelondb'

export const fuelSupplesSchema = tableSchema({
    name: 'fuel_supplies',
    columns: [
        { name: 'description', type: 'string' },
        { name: 'value', type: 'number' },
        { name: 'quantity', type: 'number' },
        { name: 'value_per_liter', type: 'number' },
        { name: 'server_id', type: 'number', isOptional: true },

        { name: 'supply_type', type: 'string' },
        { name: 'transport_vehicle_or_work_equipment_id', type: 'string' },
        { name: 'observation', type: 'string' },
        { name: 'is_gas_station', type: 'boolean' },
        { name: 'hour_meter_or_odometer', type: 'number' },
        { name: 'maintenance_trucks_work_equipment_id', type: 'string' },
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
    ],
})
