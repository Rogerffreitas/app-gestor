import { tableSchema } from '@nozbe/watermelondb'

export const materialSchema = tableSchema({
    name: 'materials',
    columns: [
        { name: 'server_id', type: 'number', isOptional: true },
        { name: 'name', type: 'string' },
        { name: 'density', type: 'number' },
        { name: 'reference_material_calculation', type: 'number' },
        { name: 'value', type: 'number' },
        { name: 'deposit_id', type: 'string' },
        { name: 'enterprise_id', type: 'string' },
        { name: 'user_id', type: 'string' },
        { name: 'user_action', type: 'number' },
        { name: 'is_valid', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
    ],
})
