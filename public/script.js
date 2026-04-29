const API_BASE = "https://tap-out-counseor-dashboard.vercel.app/index.html";

/* ---------- ELEMENTS ---------- */
const loginForm = document.getElementById("loginForm");
const username = document.getElementById("username");
const password = document.getElementById("password");
const loginScreen = document.getElementById("loginScreen");
const dashboardScreen = document.getElementById("dashboardScreen");
const profileBubble = document.getElementById("profileBubble");
const bellDot = document.getElementById("bellDot");
const bellDropdown = document.getElementById("bellDropdown");
const notifBell = document.getElementById("notifBell");

/* ---------- LOGIN (REAL) ---------- */
loginForm.onsubmit = e => {
  e.preventDefault();
  sisLogin(username.value, password.value);
};

async function sisLogin(email, pass) {
  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password: pass })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Login failed");
      return;
    }

    // store real user
    localStorage.setItem("user", JSON.stringify(data.user));

    showDashboard();

  } catch (err) {
    console.error(err);
    alert("Login failed");
  }
}

function showDashboard() {
  loginScreen.style.display = "none";
  dashboardScreen.style.display = "block";

  const user = JSON.parse(localStorage.getItem("user"));

  profileBubble.textContent = user.name?.slice(0,2).toUpperCase() || "C";

  loadMessages();
  checkNotifications();
}

function logout() {
  localStorage.removeItem("user");
  location.reload();
}

/* ---------- FETCH ASSESSMENTS (REAL) ---------- */
async function fetchAssessments() {
  const user = JSON.parse(localStorage.getItem("user"));

  try {
    const res = await fetch(
      `${API_BASE}/api/counselor/get-assessments?counselor_id=${user.id}`
    );

    return await res.json();

  } catch (err) {
    console.error(err);
    return [];
  }
}

/* ---------- LOAD MESSAGES ---------- */
async function loadMessages() {
  const data = await fetchAssessments();

  const map = {
    "I’m in Crisis": "red-row",
    "I’m Not Coping Well": "orange-row",
    "Feeling a Little Off": "yellow-row",
    "I’m Doing Fine – Just Curious": "green-row"
  };

  document.querySelectorAll(".messages").forEach(m => m.innerHTML = "");

  data.forEach(m => {
    const answers = m.answers || {};

    const card = document.createElement("div");
    card.className = "message-card";

    card.innerHTML = `
      <strong>${m.first_name} ${m.last_name}</strong><br>
      ID: ${m.student_id}<br>
      ${answers.reason || ""}<br>
      ${answers.notes ? "<em>Notes:</em> " + answers.notes + "<br>" : ""}
      <small>Sent: ${new Date(m.created_at).toLocaleString()}</small>
    `;

    const urgency = answers.urgency || "Feeling a Little Off";
    const container = document.querySelector(`#${map[urgency]} .messages`);

    if (container) container.appendChild(card);
  });
}

/* ---------- NOTIFICATIONS ---------- */
async function checkNotifications() {
  const data = await fetchAssessments();

  const crisis = data.filter(d => d.answers?.urgency === "I’m in Crisis");

  bellDot.style.display = crisis.length ? "block" : "none";

  bellDropdown.innerHTML = "";

  if (!crisis.length) {
    const div = document.createElement("div");
    div.textContent = "No notifications";
    bellDropdown.appendChild(div);
  }

  crisis.forEach(s => {
    const div = document.createElement("div");
    div.textContent = `🚨 Crisis: ${s.first_name} ${s.last_name}`;
    bellDropdown.appendChild(div);
  });
}

notifBell.onclick = () => {
  bellDropdown.style.display =
    bellDropdown.style.display === "flex" ? "none" : "flex";
  bellDot.style.display = "none";
};

setInterval(checkNotifications, 5000);

/* ---------- INITIAL ---------- */
window.onload = () => {
  const user = localStorage.getItem("user");
  if (user) showDashboard();
};
