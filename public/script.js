const API_BASE = "https://tap-out-counselor-dashboard.vercel.app";

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

/* ---------- LOGIN ---------- */
loginForm.onsubmit = e => {
  e.preventDefault();
  sisLogin(username.value, password.value);
};

async function sisLogin(email, pass) {
  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: pass })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Login failed");
      return;
    }

    localStorage.setItem("user", JSON.stringify(data.user));
    showDashboard();

  } catch (err) {
    console.error("Login error:", err);
    alert("Login failed");
  }
}

/* ---------- DASHBOARD ---------- */
function showDashboard() {
  loginScreen.style.display = "none";
  dashboardScreen.style.display = "block";

  const user = safeGetUser();
  if (!user) return;

  profileBubble.textContent =
    user.name?.slice(0, 2).toUpperCase() || "C";

  loadMessages();
  checkNotifications();
}

function logout() {
  localStorage.removeItem("user");
  location.reload();
}

/* ---------- SAFE USER ---------- */
function safeGetUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}

/* ---------- FETCH ASSESSMENTS ---------- */
async function fetchAssessments() {
  const user = safeGetUser();
  if (!user?.id) return [];

  try {
    const res = await fetch(
      `${API_BASE}/api/counselor/get-assessments?counselor_id=${user.id}`
    );

    const data = await res.json();

    // supports either raw array OR {data: []}
    return Array.isArray(data) ? data : (data.data || []);

  } catch (err) {
    console.error("Fetch assessments error:", err);
    return [];
  }
}

/* ---------- LOAD MESSAGES ---------- */
async function loadMessages() {
  const data = await fetchAssessments();

  document.querySelectorAll(".messages").forEach(m => m.innerHTML = "");

  data.forEach(m => {
    const answers = m.answers || {};

    const urgency = answers.urgency || "Feeling a Little Off";

    const map = {
      "I’m in Crisis": "red-row",
      "I’m Not Coping Well": "orange-row",
      "Feeling a Little Off": "yellow-row",
      "I’m Doing Fine – Just Curious": "green-row"
    };

    const card = document.createElement("div");
    card.className = "message-card";

    card.innerHTML = `
      <strong>${m.first_name || ""} ${m.last_name || ""}</strong><br>
      ID: ${m.student_id || ""}<br>
      <div>${answers.reason || ""}</div>
      ${answers.notes ? `<em>Notes:</em> ${answers.notes}<br>` : ""}
      <small>${new Date(m.created_at).toLocaleString()}</small>
    `;

    const container = document.querySelector(`#${map[urgency]} .messages`);
    if (container) container.appendChild(card);
  });
}

/* ---------- NOTIFICATIONS ---------- */
async function checkNotifications() {
  const data = await fetchAssessments();

  const crisis = data.filter(
    d => d.answers?.urgency === "I’m in Crisis"
  );

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

/* ---------- UI EVENTS ---------- */
notifBell.onclick = () => {
  bellDropdown.style.display =
    bellDropdown.style.display === "flex" ? "none" : "flex";
  bellDot.style.display = "none";
};

setInterval(checkNotifications, 5000);

/* ---------- INIT ---------- */
window.onload = () => {
  if (safeGetUser()) showDashboard();
};
