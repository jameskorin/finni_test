import { Pool } from 'pg'

const postgres = {
  user: 'postgres',
  host: 'db.jmzstcremutniiksvvjp.supabase.co',
  database: 'postgres',
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
}

export default async function handler(req, res) {
    const { id } = req.body;
    const pool = new Pool(postgres);
    const r = await pool.query(`
        SELECT
        p.first_name,
        p.middle_name,
        p.last_name,
        p.date_of_birth,
        p.custom_data,
        p.id,
        (
            SELECT json_agg(json_build_object('street', a.street, 'city', a.city, 'state', a.state, 'zip', a.zip, 'primary', a.primary, 'id', a.id))
            FROM addresses a
            WHERE a.patient_id = p.id
        ) AS addresses
        FROM
            patients p
        WHERE
            p.id = ${id};
  `);

  console.log(r);
  return res.status(200).send(r);
}