import { tableSchema } from '@nozbe/watermelondb'

export const depositSchema = tableSchema({
    name: 'deposits',
    columns: [
        { name: 'server_id', type: 'number', isOptional: true },
        { name: 'name', type: 'string' },
        { name: 'description', type: 'string' },
        { name: 'enterprise_id', type: 'string' },
        { name: 'user_id', type: 'string' },
        { name: 'user_action', type: 'number' },
        { name: 'is_valid', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
    ],
})
