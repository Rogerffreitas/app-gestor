import { tableSchema } from '@nozbe/watermelondb'

export const hourMeterMonitoringSchema = tableSchema({
    name: 'hour_meter_monitorings',
    columns: [
        { name: 'server_id', type: 'number', isOptional: true },
        { name: 'date', type: 'string' },
        { name: 'initial_hour_meter_value', type: 'number' },
        { name: 'current_hour_meter_value', type: 'number' },
        { name: 'observation', type: 'string' },
        { name: 'total_calculated_in_the_period_informed', type: 'number' },
        { name: 'value', type: 'number' },
        { name: 'invoice_id', type: 'number' },
        { name: 'invoice_status', type: 'string' },
        { name: 'work_equipment_id', type: 'string' },

        { name: 'work_id', type: 'string' },
        { name: 'enterprise_id', type: 'string' },
        { name: 'user_id', type: 'string' },
        { name: 'user_action', type: 'number' },
        { name: 'is_valid', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
    ],
})
