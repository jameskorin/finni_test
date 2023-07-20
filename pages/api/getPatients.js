import { Pool } from 'pg'

const postgres = {
  user: 'postgres',
  host: 'db.jmzstcremutniiksvvjp.supabase.co',
  database: 'postgres',
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
}

const page_size = 10;

export default async function handler(req, res) {
  const { page, search } = req.body;
  const pool = new Pool(postgres);
  const r = await pool.query(`
    SELECT
      p.first_name,
      p.middle_name,
      p.last_name,
      p.date_of_birth,
      p.id,
      a.street,
      a.city,
      a.state,
      a.zip
    FROM
      patients p
    INNER JOIN
      addresses a ON p.id = a.patient_id
    WHERE
      a.primary = true
      ${search === '' ? '' :
      `
        AND (
          p.first_name ILIKE '${search}'
          OR p.last_name ILIKE '${search}'
          OR LOWER(CONCAT_WS(' ',p.first_name,p.last_name)) ILIKE '${search}'
          OR LOWER(CONCAT_WS(' ',p.first_name,p.middle_name,p.last_name)) ILIKE '${search}'
          OR a.street ILIKE '${search}'
          OR a.city ILIKE '${search}'
          OR a.state ILIKE '${search}'
          OR a.zip ILIKE '${search}'
        )
      `}
    ORDER BY
      p.id
    OFFSET ${page} * ${page_size}
    LIMIT ${page_size};
  `);

  return res.status(200).send(r);
}