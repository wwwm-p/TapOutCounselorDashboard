// ===============================
// CONFIG - Set the counselor email
// ===============================
const counselorEmail = "mr.smith@school.org"; // Change per dashboard

// ===============================
// DATA STORAGE
// ===============================
let requests = [];
let selectedStudent = null;
let notes = JSON.parse(localStorage.getItem("notesData") || "[]");

// ===============================
// PANEL TOGGLING
// ===============================
function toggleStudentsPanel() {
  document.getElementById("studentsPanel").classList.toggle("hidden");
  document.getElementById("notesPanel").classList.add("hidden");
  renderStudentList();
}

function toggleNotesPanel() {
  document.getElementById("notesPanel").classList.toggle("hidden");
  loadNotes();
}

function closeStudentDetail() {
  document.getElementById("studentDetailPanel").classList.add("hidden");
}

// ===============================
// LOAD STUDENT REQUESTS
// ===============================
async function loadRequests() {
  try {
    // Replace this URL with your backend or Firebase API
    const res = await fetch(`https://your-api.com/requests?counselor=${encodeURIComponent(counselorEmail)}`);
    requests = await res.json();
    renderStudentList();
    renderDashboard();
  } catch (err) {
    console.error("Failed to load requests:", err);
  }
}

// ===============================
// STUDENT LIST
// ===============================
function renderStudentList() {
  const list = document.getElementById("studentList");
  const sort = document.getElementById("sortOption").value;
  const query = document.getElementById("studentSearchHeader").value.toLowerCase();

  let filtered = requests.filter(r => r.student.toLowerCase().includes(query));

  if (sort === "alpha") filtered.sort((a, b) => a.student.localeCompare(b.student));
  else filtered.sort((a, b) => a.grade - b.grade);

  list.innerHTML = "";

  filtered.forEach(req => {
    const li = document.createElement("li");
    li.textContent = `${req.student} (Grade ${req.grade})`;
    li.onclick = () => openStudentDetail(req);
    list.appendChild(li);
  });
}

// ===============================
// STUDENT DETAIL PANEL
// ===============================
function openStudentDetail(request) {
  selectedStudent = request;

  document.getElementById("studentDetailPanel").classList.remove("hidden");
  document.getElementById("studentsPanel").classList.add("hidden");
  document.getElementById("notesPanel").classList.add("hidden");

  document.getElementById("studentName").textContent = request.student;
  document.getElementById("studentEmail").textContent = request.email || "N/A";

  const history = document.getElementById("appointmentHistory");
  history.innerHTML = `
    <li>Reason: ${request.reason}</li>
    <li>Urgency: ${request.urgency}</li>
    <li>Submitted: ${new Date(request.time).toLocaleString()}</li>
  `;
}

// ===============================
// NOTES SYSTEM
// ===============================
function saveNote() {
  const text = document.getElementById("newNote").value.trim();
  if (!text) return;

  notes.push(text);
  document.getElementById("newNote").value = "";

  localStorage.setItem("notesData", JSON.stringify(notes));
  loadNotes();
}

function loadNotes() {
  const list = document.getElementById("notesHistory");
  list.innerHTML = "";

  if (notes.length === 0) {
    list.innerHTML = "<li>No notes yet.</li>";
    return;
  }

  notes.forEach(note => {
    const li = document.createElement("li");
    li.textContent = note;
    list.appendChild(li);
  });
}

// ===============================
// DASHBOARD RENDERING BY URGENCY
// ===============================
function renderDashboard() {
  const crisisList = document.getElementById("crisisList");
  const urgentList = document.getElementById("urgentList");
  const normalList = document.getElementById("normalList");

  crisisList.innerHTML = "";
  urgentList.innerHTML = "";
  normalList.innerHTML = "";

  const priority = ["Crisis", "Urgent", "Normal"];

  requests.forEach(req => {
    const card = document.createElement("div");
    card.className = "request-card";
    card.innerHTML = `
      <strong>${req.student} (Grade ${req.grade})</strong>
      <p>Reason: ${req.reason}</p>
      <p>Urgency: ${req.urgency}</p>
      <p>Email: ${req.email || "N/A"}</p>
    `;

    if (req.urgency === "Crisis") crisisList.appendChild(card);
    else if (req.urgency === "Urgent") urgentList.appendChild(card);
    else normalList.appendChild(card);
  });
}

// ===============================
// CALENDAR PLACEHOLDER
// ===============================
function openCalendar() {
  alert("Calendar integration coming soon.");
}

// ===============================
// INIT
// ===============================
loadRequests();
