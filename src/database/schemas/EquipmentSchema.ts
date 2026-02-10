import { tableSchema } from '@nozbe/watermelondb'

export const equipmentSchema = tableSchema({
    name: 'equipments',
    columns: [
        { name: 'server_id', type: 'number', isOptional: true },

        { name: 'name_proprietary', type: 'string' },
        { name: 'cpf_cnpj_proprietary', type: 'string' },
        { name: 'tel_proprietary', type: 'string' },

        { name: 'operator_motorist', type: 'string' },
        { name: 'is_equipment', type: 'boolean' },
        { name: 'model_or_plate', type: 'string' },
        { name: 'start_rental', type: 'string' },
        { name: 'hour_meter_or_odometer', type: 'number' },
        { name: 'monthly_payment', type: 'number' },
        { name: 'value_per_hour_km', type: 'number' },
        { name: 'value_per_day', type: 'number' },
        { name: 'bank', type: 'string' },
        { name: 'beneficiary', type: 'string' },
        { name: 'agency', type: 'string' },
        { name: 'account', type: 'string' },
        { name: 'pix', type: 'string' },

        { name: 'enterprise_id', type: 'string' },
        { name: 'user_id', type: 'string' },
        { name: 'user_action', type: 'number' },
        { name: 'is_valid', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
    ],
})
