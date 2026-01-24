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
const searchBar = document.getElementById("searchBar");

window.onload = () => {
  const saved = localStorage.getItem("loggedInCounselor");
  if (saved) showDashboard();
};

loginForm.addEventListener("submit", function (e) {
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

  const urgencyMap = {
    "I’m in Crisis": "red-row",
    "I’m Not Coping Well": "orange-row",
    "Feeling a Little Off": "yellow-row",
    "I’m Doing Fine – Just Curious": "green-row"
  };

  document.querySelectorAll(".messages").forEach(m => m.innerHTML = "");

  messages.forEach(msg => {
    if (msg.counselor !== counselor) return;

    const rowId = urgencyMap[msg.urgency];
    if (!rowId) return;

    const container = document
      .getElementById(rowId)
      .querySelector(".messages");

    const card = document.createElement("div");
    card.className = "message-card";
    card.innerHTML = `
      <strong>${msg.name} (Grade ${msg.grade})</strong><br>
      Reason: ${msg.reason}<br>
      Urgency: ${msg.urgency}<br>
      Time: ${msg.time}
    `;

    container.appendChild(card);
  });
}

searchBar.addEventListener("input", () => {
  const q = searchBar.value.toLowerCase();
  document.querySelectorAll(".message-card").forEach(card => {
    card.style.display = card.textContent.toLowerCase().includes(q)
      ? "block"
      : "none";
  });
});

