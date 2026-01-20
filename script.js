// Counselor accounts (username: password)
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

// Auto-login if already signed in
window.onload = () => {
  const savedCounselor = localStorage.getItem("loggedInCounselor");
  if (savedCounselor) {
    showDashboard();
  }
};

// LOGIN HANDLER
loginForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (counselors[username] && counselors[username] === password) {
    localStorage.setItem("loggedInCounselor", username);
    showDashboard();
  } else {
    alert("Invalid username or password");
  }
});

// SHOW DASHBOARD
function showDashboard() {
  loginScreen.style.display = "none";
  dashboardScreen.style.display = "block";
  loadMessages();
}

// LOGOUT
function logout() {
  localStorage.removeItem("loggedInCounselor");
  location.reload();
}

// LOAD STUDENT MESSAGES
function loadMessages() {
  const counselor = localStorage.getItem("loggedInCounselor");
  const allMessages = JSON.parse(localStorage.getItem("studentMessages") || "[]");

  const urgencyMap = {
    "I’m in Crisis": "red-row",
    "I’m Not Coping Well": "orange-row",
    "Feeling a Little Off": "yellow-row",
    "I’m Doing Fine – Just Curious": "green-row"
  };

  // Clear old messages
  document.querySelectorAll(".messages").forEach(div => div.innerHTML = "");

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
      Time: ${msg.time}
    `;

    container.appendChild(card);
  });
}

// SEARCH FUNCTION
searchBar.addEventListener("input", function () {
  const searchText = searchBar.value.toLowerCase();
  const cards = document.querySelectorAll(".message-card");

  cards.forEach(card => {
    const text = card.textContent.toLowerCase();
    card.style.display = text.includes(searchText) ? "block" : "none";
  });
});









