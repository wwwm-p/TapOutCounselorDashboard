/* ================================
   Counselor Accounts
================================ */
const counselors = {
  miap2k10: "1234",
  kmcconnell: "1234",
  gsorbi: "1234",
  apanlilio: "1234",
  aturner: "1234",
  cfilson: "1234"
};

/* ================================
   DOM References
================================ */
const loginScreen = document.getElementById("loginScreen");
const dashboardScreen = document.getElementById("dashboardScreen");
const loginForm = document.getElementById("loginForm");
const searchBar = document.getElementById("searchBar");

/* ================================
   Auto Login
================================ */
window.onload = () => {
  const saved = localStorage.getItem("loggedInCounselor");
  if (saved) showDashboard();
};

/* ================================
   Login
================================ */
loginForm.addEventListener("submit", e => {
  e.preventDefault();

  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();

  if (counselors[user] === pass) {
    localStorage.setItem("loggedInCounselor", user);
    showDashboard();
  } else {
    alert("Invalid username or password");
  }
});

/* ================================
   Dashboard
================================ */
function showDashboard() {
  loginScreen.style.display = "none";
  dashboardScreen.style.display = "block";
  loadMessages();
}

function logout() {
  localStorage.removeItem("loggedInCounselor");
  location.reload();
}

/* ================================
   Load Messages
================================ */
function loadMessages() {
  const counselor = localStorage.getItem("loggedInCounselor");
  const messages = JSON.parse(localStorage.getItem("studentMessages") || "[]");

  const urgencyMap = {
    "I’m in Crisis": "red-row",
    "I’m Not Coping Well": "orange-row",
    "Feeling a Little Off": "yellow-row",
    "I’m Doing Fine – Just Curious": "green-row"
  };

  document.querySelectorAll(".messages").forEach(m => (m.innerHTML = ""));

  messages.forEach(msg => {
    if (msg.counselor !== counselor) return;

    const rowId = urgencyMap[msg.urgency];
    if (!rowId) return;

    const container = document
      .getElementById(rowId)
      .querySelector(".messages");

    // ✅ SAFE NAME RESOLUTION
    const fullName =
      msg.firstName && msg.lastName
        ? `${msg.firstName} ${msg.lastName}`
        : msg.name
        ? msg.name
        : "Name Not Provided";

    const card = document.createElement("div");
    card.className = "message-card";

    card.innerHTML = `
      <strong>${fullName} (Grade ${msg.grade || "N/A"})</strong><br>
      Reason: ${msg.reason}<br>
      Urgency: ${msg.urgency}<br>
      ${msg.notes ? `Notes: ${msg.notes}<br>` : ""}
      Time: ${msg.time}
    `;

    container.appendChild(card);
  });
}

/* ================================
   Search
================================ */
searchBar.addEventListener("input", () => {
  const q = searchBar.value.toLowerCase();
  document.querySelectorAll(".message-card").forEach(card => {
    card.style.display = card.textContent.toLowerCase().includes(q)
      ? "block"
      : "none";
  });
});

