// pages/api/server.js
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.NEON_DATABASE_URL });

// -----------------------------
// Counselor API - SIS-ready
// -----------------------------
export default async function handler(req, res) {
  const action = req.query.action;

  try {
    // -----------------------------
    // 1️⃣ Counselor Login
    // -----------------------------
    if (action === "login" && req.method === "POST") {
      const { username, password } = req.body;
      if (!username || !password) return res.status(400).json({ success: false, error: "Missing fields" });

      const result = await pool.query(
        "SELECT counselor_id, username, email, metadata FROM counselors WHERE username=$1 AND active=TRUE",
        [username]
      );
      const counselor = result.rows[0];
      if (!counselor) return res.status(401).json({ success: false, error: "User not found or inactive" });

      // NOTE: For testing only, password = username. Replace with hashed passwords in production
      if (password !== username) return res.status(401).json({ success: false, error: "Invalid password" });

      return res.status(200).json({ success: true, counselor });
    }

    // -----------------------------
    // 2️⃣ Fetch Assigned Students + Messages + Notes
    // -----------------------------
    if (action === "students" && req.method === "GET") {
      const { counselor_id } = req.query;
      if (!counselor_id) return res.status(400).json({ success: false, error: "Missing counselor_id" });

      // Fetch assigned students
      const studentsResult = await pool.query(`
        SELECT u.student_id, u.first_name, u.last_name, u.grade, u.metadata
        FROM student_counselor_assignments sca
        JOIN users u ON sca.student_id = u.student_id
        WHERE sca.counselor_id = $1
        ORDER BY u.last_name, u.first_name
      `, [counselor_id]);
      const students = studentsResult.rows;
      const studentIds = students.map(s => s.student_id);

      // Fetch messages
      let messages = [];
      if (studentIds.length > 0) {
        const messagesResult = await pool.query(`
          SELECT id, student_id, notes, reason, urgency, crisis, date_time, read
          FROM messages
          WHERE counselor_id=$1 AND student_id = ANY($2)
          ORDER BY date_time DESC
        `, [counselor_id, studentIds]);
        messages = messagesResult.rows;
      }

      // Fetch notes / past appointments
      let notes = [];
      if (studentIds.length > 0) {
        const notesResult = await pool.query(`
          SELECT id, student_id, note, note_type, date_created
          FROM student_notes
          WHERE counselor_id=$1 AND student_id = ANY($2)
          ORDER BY date_created DESC
        `, [counselor_id, studentIds]);
        notes = notesResult.rows;
      }

      return res.status(200).json({ success: true, students, messages, notes });
    }

    // -----------------------------
    // 3️⃣ Add Message for a Student
    // -----------------------------
    if (action === "add-message" && req.method === "POST") {
      const { student_id, counselor_id, notes="", reason, urgency, crisis=false } = req.body;
      if (!student_id || !counselor_id || !reason || !urgency) {
        return res.status(400).json({ success: false, error: "Missing required fields" });
      }

      await pool.query(`
        INSERT INTO messages (student_id, counselor_id, notes, reason, urgency, crisis)
        VALUES ($1,$2,$3,$4,$5,$6)
      `, [student_id, counselor_id, notes, reason, urgency, crisis]);

      return res.status(200).json({ success: true });
    }

    // -----------------------------
    // 4️⃣ Add Note / Appointment for a Student
    // -----------------------------
    if (action === "add-note" && req.method === "POST") {
      const { student_id, counselor_id, note, note_type="general" } = req.body;
      if (!student_id || !counselor_id || !note) {
        return res.status(400).json({ success: false, error: "Missing required fields" });
      }

      await pool.query(`
        INSERT INTO student_notes (student_id, counselor_id, note, note_type)
        VALUES ($1,$2,$3,$4)
      `, [student_id, counselor_id, note, note_type]);

      return res.status(200).json({ success: true });
    }

    // -----------------------------
    // Invalid action
    // -----------------------------
    return res.status(400).json({ success: false, error: "Invalid action or method" });

  } catch (err) {
    console.error("Counselor API error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
}
