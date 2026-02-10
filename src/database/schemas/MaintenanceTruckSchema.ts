import { tableSchema } from '@nozbe/watermelondb'

export const maintenanceTruckSchema = tableSchema({
    name: 'maintenance_trucks',
    columns: [
        { name: 'server_id', type: 'number', isOptional: true },
        { name: 'users_list', type: 'string' },
        { name: 'capacity', type: 'number' },
        { name: 'name_proprietary', type: 'string' },
        { name: 'work_equipment_id', type: 'string' },
        { name: 'operator_motorist', type: 'string' },
        { name: 'model_or_plate', type: 'string' },

        { name: 'work_id', type: 'string' },
        { name: 'enterprise_id', type: 'string' },
        { name: 'user_id', type: 'string' },
        { name: 'user_action', type: 'number' },
        { name: 'is_valid', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
    ],
})
