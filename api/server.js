// api.server.js
import { Pool } from 'pg';
const pool = new Pool({ connectionString: process.env.NEON_DATABASE_URL });

// Simple router based on query param `action`
export default async function handler(req, res) {
  const action = req.query.action;

  try {
    // -----------------------------
    // 1️⃣ Counselor Login
    // -----------------------------
    if (action === "login" && req.method === "POST") {
      const { username, password } = req.body;
      if (!username || !password) return res.status(400).json({ success: false, error: "Missing fields" });

      const result = await pool.query("SELECT * FROM counselors WHERE username=$1", [username]);
      const counselor = result.rows[0];
      if (!counselor) return res.status(401).json({ success: false, error: "User not found" });

      // NOTE: For testing, password = username. Replace with hashed passwords later
      if (password !== username) return res.status(401).json({ success: false, error: "Invalid password" });

      return res.status(200).json({ success: true, counselor: { id: counselor.counselor_id, username: counselor.username, email: counselor.email } });
    }

    // -----------------------------
    // 2️⃣ Fetch Assigned Students
    // -----------------------------
    if (action === "students" && req.method === "GET") {
      const { counselor_id } = req.query;
      if (!counselor_id) return res.status(400).json({ success: false, error: "Missing counselor_id" });

      const result = await pool.query(`
        SELECT u.student_id, u.first_name, u.last_name, u.grade
        FROM student_counselor_assignments sca
        JOIN users u ON sca.student_id = u.student_id
        WHERE sca.counselor_id=$1
        ORDER BY u.last_name, u.first_name
      `, [counselor_id]);

      return res.status(200).json({ success: true, students: result.rows });
    }

    // -----------------------------
    // 3️⃣ Fetch Messages for Student
    // -----------------------------
    if (action === "messages" && req.method === "GET") {
      const { student_id, counselor_id } = req.query;
      if (!student_id || !counselor_id) return res.status(400).json({ success: false, error: "Missing parameters" });

      const result = await pool.query(`
        SELECT id, notes, reason, urgency, crisis, date_time, read
        FROM messages
        WHERE student_id=$1 AND counselor_username=(SELECT username FROM counselors WHERE counselor_id=$2)
        ORDER BY date_time DESC
      `, [student_id, counselor_id]);

      return res.status(200).json({ success: true, messages: result.rows });
    }

    // -----------------------------
    // 4️⃣ Add Notes / Appointments
    // -----------------------------
    if (action === "add-note" && req.method === "POST") {
      const { student_id, counselor_id, note, note_type="general" } = req.body;
      if (!student_id || !counselor_id || !note) return res.status(400).json({ success: false, error: "Missing fields" });

      await pool.query(
        "INSERT INTO student_notes (student_id, counselor_id, note, note_type) VALUES ($1,$2,$3,$4)",
        [student_id, counselor_id, note, note_type]
      );

      return res.status(200).json({ success: true });
    }

    return res.status(400).json({ success: false, error: "Invalid action or method" });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
}
