const Database = require('better-sqlite3');
const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const sqlite = new Database(
    path.join(__dirname, 'civic_impact.sqlite'),
    { readonly: true }
);

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

const tables = [
    'users',
    'complaints',
    'complaint_updates',
    'waste_pickup_requests',
    'recycling_centres',
    'educational_content',
    'reuse_listings',
    'item_requests',
    'green_point_transactions',
    'notifications'
];

async function migrate() {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Ensure destination tables are empty.
        for (const table of tables) {
            const result = await client.query(
                `SELECT COUNT(*) FROM "${table}"`
            );

            if (Number(result.rows[0].count) !== 0) {
                throw new Error(`Neon table "${table}" is not empty. Migration stopped.`);
            }
        }

        console.log('Neon tables verified as empty.');

        for (const table of tables) {
            const rows = sqlite.prepare(
                `SELECT * FROM "${table}" ORDER BY id`
            ).all();

            const columns = sqlite.prepare(
                `PRAGMA table_info("${table}")`
            ).all().map(column => column.name);

            for (const row of rows) {
                const values = columns.map(column => {
                    let value = row[column];

                    if (['is_sample', 'is_read'].includes(column)) {
                        value = value === null ? null : Boolean(value);
                    }

                    if (
                        ['preferred_date', 'scheduled_date'].includes(column) &&
                        value === ''
                    ) {
                        value = null;
                    }

                    return value;
                });

                const placeholders = values
                    .map((_, index) => `$${index + 1}`)
                    .join(', ');

                const columnNames = columns
                    .map(column => `"${column}"`)
                    .join(', ');

                await client.query(
                    `INSERT INTO "${table}" (${columnNames})
                     VALUES (${placeholders})`,
                    values
                );
            }

            console.log(`${table}: ${rows.length} records copied.`);
        }

        // Reset PostgreSQL auto-increment sequences.
        for (const table of tables) {
            await client.query(`
                SELECT setval(
                    pg_get_serial_sequence('public.${table}', 'id'),
                    COALESCE((SELECT MAX(id) FROM "${table}"), 1),
                    EXISTS (SELECT 1 FROM "${table}")
                )
            `);
        }

        // Verify migrated record counts.
        console.log('\nVerifying migration...');

        for (const table of tables) {
            const localCount = sqlite.prepare(
                `SELECT COUNT(*) AS count FROM "${table}"`
            ).get().count;

            const cloudResult = await client.query(
                `SELECT COUNT(*) FROM "${table}"`
            );

            const cloudCount = Number(cloudResult.rows[0].count);

            if (localCount !== cloudCount) {
                throw new Error(`Count mismatch in ${table}.`);
            }

            console.log(`${table}: ${cloudCount} records verified.`);
        }

        await client.query('COMMIT');

        console.log('\nSUCCESS: All records migrated successfully!');

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('\nMigration failed. Changes rolled back.');
        console.error(error.message);
        process.exitCode = 1;

    } finally {
        client.release();
        sqlite.close();
        await pool.end();
    }
}

migrate();