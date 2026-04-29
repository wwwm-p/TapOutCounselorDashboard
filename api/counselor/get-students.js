import pkg from 'pg'

const { Pool } = pkg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

export default async function handler(req, res) {
  try {
    const { counselor_id } = req.query

    if (!counselor_id) {
      return res.status(400).json({ error: 'Missing counselor_id' })
    }

    const result = await pool.query(
      `SELECT id, first_name, last_name, student_id
       FROM students
       WHERE counselor_id = $1
       ORDER BY last_name ASC`,
      [counselor_id]
    )

    res.status(200).json(result.rows)

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
