import { Pool } from 'pg'
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY);

const postgres = {
  user: 'postgres',
  host: 'db.jmzstcremutniiksvvjp.supabase.co',
  database: 'postgres',
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
}

export default async function handler(req, res) {
    const jwt = req.headers.authorization.split(' ')[1];
    console.log(jwt);
    // Get user id from session from token
    const { data: { user } } = await supabase.auth.getUser(jwt);
    console.log(user.id);
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
            p.id = ${id} 
        AND 
            p.created_by = '${user.id}';
  `);
  return res.status(200).send(r);
}