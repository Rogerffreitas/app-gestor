import { tableSchema } from '@nozbe/watermelondb'

export const transportVehicleSchema = tableSchema({
    name: 'transport_vehicles',
    columns: [
        { name: 'server_id', type: 'number', isOptional: true },
        { name: 'name_proprietary', type: 'string' },
        { name: 'cpf_cnpj_proprietary', type: 'string' },
        { name: 'tel_proprietary', type: 'string' },
        { name: 'motorist', type: 'string' },
        { name: 'plate', type: 'string' },
        { name: 'color', type: 'string' },
        { name: 'capacity', type: 'number' },

        { name: 'bank', type: 'string' },
        { name: 'beneficiary', type: 'string' },
        { name: 'agency', type: 'string' },
        { name: 'account', type: 'string' },
        { name: 'pix', type: 'string' },

        { name: 'work_id', type: 'string' },
        { name: 'enterprise_id', type: 'string' },
        { name: 'user_id', type: 'string' },
        { name: 'user_action', type: 'number' },
        { name: 'is_valid', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
    ],
})
