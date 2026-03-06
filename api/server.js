const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.get("/", (req,res)=>{
  res.send("Counselor API running");
});

/* ==============================
   STUDENT SEND MESSAGE
============================== */

app.post("/api/messages", async (req,res)=>{

  const {
    firstName,
    lastName,
    grade,
    studentId,
    notes,
    reason,
    urgency,
    counselor,
    counselorEmail,
    dateTime
  } = req.body;

  try{

    await pool.query(
      `INSERT INTO messages
      (first_name,last_name,grade,student_id,notes,reason,urgency,counselor,counselor_email,date_time)
      VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [
        firstName,
        lastName,
        grade,
        studentId,
        notes,
        reason,
        urgency,
        counselor,
        counselorEmail,
        dateTime
      ]
    );

    res.json({success:true});

  }catch(err){
    console.error(err);
    res.status(500).json({success:false});
  }

});

/* ==============================
   COUNSELOR GET MESSAGES
============================== */

app.get("/api/counselor/messages/:username", async (req,res)=>{

  const username = req.params.username;

  try{

    const result = await pool.query(
      `SELECT * FROM messages
       WHERE counselor=$1
       ORDER BY date_time DESC`,
       [username]
    );

    res.json(result.rows);

  }catch(err){
    console.error(err);
    res.status(500).json({success:false});
  }

});

/* ==============================
   ADMIN CRISIS ALERTS
============================== */

app.get("/api/admin/crisis", async (req,res)=>{

  try{

    const result = await pool.query(
      `SELECT * FROM messages
       WHERE urgency='I’m in Crisis'
       ORDER BY date_time DESC`
    );

    res.json(result.rows);

  }catch(err){
    console.error(err);
    res.status(500).json({success:false});
  }

});

/* ==============================
   START SERVER
============================== */

const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
  console.log("API running");
});
