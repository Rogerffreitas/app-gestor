import { tableSchema } from '@nozbe/watermelondb'

export const discountSchema = tableSchema({
    name: 'discounts',
    columns: [
        { name: 'server_id', type: 'number', isOptional: true },
        { name: 'description', type: 'string' },
        { name: 'valeu', type: 'number' },
        { name: 'type', type: 'string' },
        { name: 'transport_vehicle_or_equipment_id', type: 'string' },
        { name: 'work_id', type: 'string' },
        { name: 'invoice_id', type: 'number' },
        { name: 'invoice_status', type: 'string' },
        { name: 'enterprise_id', type: 'string' },
        { name: 'user_id', type: 'string' },
        { name: 'user_action', type: 'number' },
        { name: 'is_valid', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
    ],
})
