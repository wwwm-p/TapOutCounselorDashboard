const counselors = {
  "miap2k10": "1234",
  "kmcconnell": "1234",
  "gsorbi": "1234",
  "apanlilio": "1234",
  "aturner": "1234",
  "cfilson": "1234"
};

const loginScreen = document.getElementById("loginScreen");
const dashboardScreen = document.getElementById("dashboardScreen");
const loginForm = document.getElementById("loginForm");

window.onload = () => {
  const counselor = localStorage.getItem("loggedInCounselor");
  if (counselor) showDashboard();
};

loginForm.addEventListener("submit", e => {
  e.preventDefault();

  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();

  if (counselors[user] === pass) {
    localStorage.setItem("loggedInCounselor", user);
    showDashboard();
  } else {
    alert("Invalid login");
  }
});

function showDashboard() {
  loginScreen.style.display = "none";
  dashboardScreen.style.display = "block";
  loadMessages();
}

function logout() {
  localStorage.removeItem("loggedInCounselor");
  location.reload();
}

function loadMessages() {
  const counselor = localStorage.getItem("loggedInCounselor");
  const messages = JSON.parse(localStorage.getItem("studentMessages") || "[]");

  document.querySelectorAll(".messages").forEach(m => (m.innerHTML = ""));

  const urgencyMap = {
    "Low": "green-row",
    "Medium Low": "yellow-row",
    "Medium High": "orange-row",
    "Crisis": "red-row"
  };

  messages.forEach(msg => {
    if (msg.counselor !== counselor) return;

    const rowId = urgencyMap[msg.urgency];
    if (!rowId) return;

    const row = document.getElementById(rowId);
    if (!row) return;

    const card = document.createElement("div");
    card.className = "message-card";
    card.innerHTML = `
      <strong>${msg.name} (Grade ${msg.grade})</strong><br>
      ${msg.reason}<br>
      <small>${msg.time}</small>
    `;

    row.querySelector(".messages").appendChild(card);
  });
}
