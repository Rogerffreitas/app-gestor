import { tableSchema } from '@nozbe/watermelondb'

export const materialTransportSchema = tableSchema({
    name: 'material_transports',
    columns: [
        { name: 'server_id', type: 'number', isOptional: true },

        { name: 'work_routes_id', type: 'string' },
        { name: 'arrival_location', type: 'string' },
        { name: 'departure_location', type: 'string' },
        { name: 'km', type: 'number' },
        { name: 'unit_value', type: 'number' },
        { name: 'value', type: 'number' },

        { name: 'transport_vehicle_id', type: 'string' },
        { name: 'name_proprietary', type: 'string' },
        { name: 'cpf_cnpj_proprietary', type: 'string' },
        { name: 'tel_proprietary', type: 'string' },
        { name: 'motorist', type: 'string' },
        { name: 'plate', type: 'string' },
        { name: 'capacity', type: 'number' },

        { name: 'material_id', type: 'string' },
        { name: 'material_name', type: 'string' },
        { name: 'is_reference_capacity', type: 'boolean' },
        { name: 'quantity', type: 'number' },

        { name: 'delivery_picket', type: 'string' },
        { name: 'total_pickets', type: 'number' },
        { name: 'distance_traveled_within_the_work', type: 'number' },

        { name: 'observation', type: 'string', isOptional: true },

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
