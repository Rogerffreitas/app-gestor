import { tableSchema } from '@nozbe/watermelondb'

export const workEquipmentSchema = tableSchema({
    name: 'work_equipments',
    columns: [
        { name: 'server_id', type: 'number', isOptional: true },

        { name: 'equipment_id', type: 'string' },
        { name: 'name_proprietary', type: 'string' },
        { name: 'operator_motorist', type: 'string' },
        { name: 'is_equipment', type: 'boolean' },
        { name: 'model_or_plate', type: 'string' },
        { name: 'start_rental', type: 'string' },
        { name: 'hour_meter_or_odometer', type: 'number' },
        { name: 'monthly_payment', type: 'number' },
        { name: 'value_per_hour_km', type: 'number' },
        { name: 'value_per_day', type: 'number' },
        { name: 'work_id', type: 'string' },

        { name: 'enterprise_id', type: 'string' },
        { name: 'user_id', type: 'string' },
        { name: 'user_action', type: 'number' },
        { name: 'is_valid', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
    ],
})
