import { tableSchema } from '@nozbe/watermelondb'

export const workRoutesSchema = tableSchema({
    name: 'work_routes',
    columns: [
        { name: 'server_id', type: 'number', isOptional: true },
        { name: 'arrival_location', type: 'string' },
        { name: 'departure_location', type: 'string' },
        { name: 'km', type: 'number' },
        { name: 'initial_picket', type: 'number' },
        { name: 'value', type: 'number' },
        { name: 'is_fixed_value', type: 'boolean' },
        { name: 'work_id', type: 'string' },
        { name: 'deposit_id', type: 'string' },

        { name: 'enterprise_id', type: 'string' },
        { name: 'user_id', type: 'string' },
        { name: 'user_action', type: 'number' },
        { name: 'is_valid', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
    ],
})
