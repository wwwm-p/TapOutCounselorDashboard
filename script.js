/* ---------- ELEMENTS ---------- */
const loginForm = document.getElementById("loginForm");
const username = document.getElementById("username");
const password = document.getElementById("password");
const loginScreen = document.getElementById("loginScreen");
const dashboardScreen = document.getElementById("dashboardScreen");
const profileBubble = document.getElementById("profileBubble");
const searchBar = document.getElementById("searchBar");
const bellDot = document.getElementById("bellDot");
const bellDropdown = document.getElementById("bellDropdown");
const notifBell = document.getElementById("notifBell");
const calendarOverlay = document.getElementById("calendarOverlay");
const calendarGrid = document.getElementById("calendarGrid");
const monthLabel = document.getElementById("monthLabel");

/* ---------- LOGIN ---------- */
loginForm.onsubmit = e => {
  e.preventDefault();
  sisLogin(username.value, password.value);
};

async function sisLogin(user, pass) {
  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: user, password: pass })
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem("loggedInCounselor", user);
      showDashboard();
    } else {
      alert("Invalid login");
    }
  } catch (err) {
    console.error(err);
    alert("Login failed. Check your network.");
  }
}

function showDashboard() {
  loginScreen.style.display = "none";
  dashboardScreen.style.display = "block";
  profileBubble.textContent = localStorage.getItem("loggedInCounselor")?.slice(0, 2).toUpperCase();
  loadMessages();
  checkNotifications();
}

function logout() {
  localStorage.removeItem("loggedInCounselor");
  location.reload();
}

/* ---------- MESSAGES ---------- */
async function fetchMessagesFromSIS(counselorId) {
  try {
    const res = await fetch(`/api/messages?counselor=${counselorId}`);
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function loadMessages() {
  const counselor = localStorage.getItem("loggedInCounselor");
  const data = await fetchMessagesFromSIS(counselor);

  const map = {
    "I’m in Crisis": "red-row",
    "I’m Not Coping Well": "orange-row",
    "Feeling a Little Off": "yellow-row",
    "I’m Doing Fine – Just Curious": "green-row"
  };

  document.querySelectorAll(".messages").forEach(m => m.innerHTML = ""); // clear

  data.forEach(m => {
    const card = document.createElement("div");
    card.className = "message-card";
    card.innerHTML = `
      <strong>${m.firstName} ${m.lastName || ""}</strong><br>
      Grade ${m.grade}<br>
      ${m.reason}<br>
      ${m.notes ? "<em>Notes:</em> " + m.notes + "<br>" : ""}
      <small>Sent: ${new Date(m.dateTime).toLocaleString()}</small>
    `;
    const container = document.querySelector(`#${map[m.urgency]} .messages`);
    if (container) container.appendChild(card);
  });
}

/* ---------- NOTIFICATIONS ---------- */
async function fetchAppointmentsFromSIS() {
  try {
    const res = await fetch("/api/appointments");
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function checkNotifications() {
  const counselor = localStorage.getItem("loggedInCounselor");
  const messages = await fetchMessagesFromSIS(counselor);
  const appointments = await fetchAppointmentsFromSIS();

  const crisisStudents = messages.filter(s => s.urgency === "I’m in Crisis");
  const todayKey = new Date().toISOString().slice(0, 10);
  const apptToday = appointments.filter(a => a.date === todayKey);

  bellDot.style.display = (crisisStudents.length || apptToday.length) ? "block" : "none";

  bellDropdown.innerHTML = "";
  if (!crisisStudents.length && !apptToday.length) {
    const div = document.createElement("div");
    div.textContent = "No notifications";
    bellDropdown.appendChild(div);
  }

  crisisStudents.forEach(s => {
    const div = document.createElement("div");
    div.textContent = `🚨 Student in Crisis: ${s.firstName} ${s.lastName || ""}`;
    bellDropdown.appendChild(div);
  });

  apptToday.forEach(a => {
    const div = document.createElement("div");
    div.textContent = `📅 Appointment today`;
    bellDropdown.appendChild(div);
  });
}

notifBell.onclick = () => {
  bellDropdown.style.display = bellDropdown.style.display === "flex" ? "none" : "flex";
  bellDot.style.display = "none";
};

setInterval(checkNotifications, 5000);

/* ---------- INITIAL ---------- */
window.onload = () => {
  if (localStorage.getItem("loggedInCounselor")) showDashboard();
};
