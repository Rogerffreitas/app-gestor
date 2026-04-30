import { schemaMigrations, createTable, addColumns } from '@nozbe/watermelondb/Schema/migrations'

export default schemaMigrations({
    migrations: [
     /*   {
            toVersion: 2,
            steps: [
                addColumns({
                    table: 'transportes',
                    columns: [{ name: 'total_estaca', type: 'number' }],
                }),
                addColumns({
                    table: 'rotas',
                    columns: [{ name: 'estaca', type: 'number' }],
                }),
            ],
        },
        {
            toVersion: 3,
            steps: [
                addColumns({
                    table: 'rotas',
                    columns: [{ name: 'estaca', type: 'number' }],
                }),
            ],
        },
        {
            toVersion: 4,
            steps: [
                addColumns({
                    table: 'rotas',
                    columns: [{ name: 'jazida_id', type: 'string' }],
                }),
                addColumns({
                    table: 'transportes',
                    columns: [
                        { name: 'referencia', type: 'boolean' },
                        { name: 'quantidade', type: 'number' },
                        { name: 'observacao', type: 'string' },
                    ],
                }),
            ],
        }, */
    ],
})
