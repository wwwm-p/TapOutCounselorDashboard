// Counselor login accounts
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
const loginBtn = document.getElementById("loginBtn");
const searchBar = document.getElementById("searchBar");

// Auto login
window.onload = () => {
  const saved = localStorage.getItem("loggedInCounselor");
  if (saved) showDashboard();
};

// Login
loginBtn.addEventListener("click", () => {
  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();

  if (counselors[user] === pass) {
    localStorage.setItem("loggedInCounselor", user);
    showDashboard();
  } else {
    alert("Invalid login");
  }
});

// Show dashboard
function showDashboard() {
  loginScreen.style.display = "none";
  dashboardScreen.style.display = "block";
  loadMessages();
}

// Logout
function logout() {
  localStorage.removeItem("loggedInCounselor");
  location.reload();
}

// Load student messages
function loadMessages() {
  const counselor = localStorage.getItem("loggedInCounselor");
  const allMessages = JSON.parse(localStorage.getItem("studentMessages") || "[]");

  const urgencyMap = {
    "I’m in Crisis": "red-row",
    "I’m Not Coping Well": "orange-row",
    "Feeling a Little Off": "yellow-row",
    "I’m Doing Fine – Just Curious": "green-row"
  };

  document.querySelectorAll(".messages").forEach(m => m.innerHTML = "");

  allMessages.forEach(msg => {
    if (msg.counselor !== counselor) return;

    const rowId = urgencyMap[msg.urgency] || "green-row";
    const container = document.getElementById(rowId).querySelector(".messages");

    const card = document.createElement("div");
    card.className = "message-card";
    card.innerHTML = `
      <strong>${msg.name} (Grade ${msg.grade})</strong><br>
      Reason: ${msg.reason}<br>
      Urgency: ${msg.urgency}<br>
      <small>${msg.time}</small>
    `;

    container.appendChild(card);
  });
}

// Search bar
searchBar.addEventListener("input", () => {
  const text = searchBar.value.toLowerCase();
  document.querySelectorAll(".message-card").forEach(card => {
    card.style.display = card.textContent.toLowerCase().includes(text)
      ? "block"
      : "none";
  });
});

// Placeholder buttons
function openCalendar() {
  alert("Calendar coming soon!");
}

function openNotes() {
  alert("Notes coming soon!");
}









