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
      `SELECT 
         a.id,
         a.answers,
         a.created_at,
         s.first_name,
         s.last_name,
         s.student_id
       FROM assessments a
       JOIN students s ON a.student_id = s.id
       WHERE a.counselor_id = $1
       ORDER BY a.created_at DESC`,
      [counselor_id]
    )

    res.status(200).json(result.rows)

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
