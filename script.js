/* COUNSELOR ACCOUNTS */
const counselors = {
  "miap2k10": "1234",
  "kmcconnell": "1234",
  "gsorbi": "1234",
  "apanlilio": "1234",
  "aturner": "1234",
  "cfilson": "1234"
};

/* LOGIN */
document.getElementById("loginForm").addEventListener("submit", e => {
  e.preventDefault();

  const u = username.value.trim();
  const p = password.value.trim();

  if (counselors[u] === p) {
    localStorage.setItem("loggedInCounselor", u);
    loginScreen.style.display = "none";
    loadMessages();
  } else {
    alert("Invalid login");
  }
});

/* LOGOUT */
function logout() {
  localStorage.removeItem("loggedInCounselor");
  location.reload();
}

/* LOAD STUDENT MESSAGES */
function loadMessages() {
  const counselor = localStorage.getItem("loggedInCounselor");
  const messages = JSON.parse(localStorage.getItem("studentMessages") || "[]");

  redRow.innerHTML = "";
  orangeRow.innerHTML = "";
  yellowRow.innerHTML = "";
  greenRow.innerHTML = "";

  messages.forEach(m => {
    if (m.counselor !== counselor) return;

    const card = document.createElement("div");
    card.style.background = "#fff";
    card.style.padding = "10px";
    card.style.margin = "10px";
    card.style.border = "1px solid #ccc";
    card.style.borderRadius = "8px";

    card.innerHTML = `
      <strong>${m.name} (Grade ${m.grade})</strong><br>
      ${m.reason}<br>
      <em>${m.urgency}</em><br>
      <small>${m.time}</small>
    `;

    if (m.urgency === "I’m in Crisis") redRow.appendChild(card);
    else if (m.urgency === "I’m Not Coping Well") orangeRow.appendChild(card);
    else if (m.urgency === "Feeling a Little Off") yellowRow.appendChild(card);
    else greenRow.appendChild(card);
  });
}

/* AUTO LOGIN */
if (localStorage.getItem("loggedInCounselor")) {
  loginScreen.style.display = "none";
  loadMessages();
}

/* STUB FUNCTIONS (KEEP BUTTONS WORKING) */
function openCalendar() { alert("Calendar coming soon"); }
function toggleStudentsPanel() { studentsPanel.classList.toggle("hidden"); }
function toggleNotesPanel() { notesPanel.classList.toggle("hidden"); }
function saveNote() {}
function closeStudentDetail() {}




