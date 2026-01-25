/* ================================
   Counselor Accounts
================================ */
const counselors = {
  "miap2k10": "1234",
  "kmcconnell": "1234",
  "gsorbi": "1234",
  "apanlilio": "1234",
  "aturner": "1234",
  "cfilson": "1234"
};

/* ================================
   DOM References
================================ */
const loginScreen = document.getElementById("loginScreen");
const dashboardScreen = document.getElementById("dashboardScreen");
const loginForm = document.getElementById("loginForm");
const searchBar = document.getElementById("searchBar");

/* ================================
   Auto-login if already signed in
================================ */
window.onload = () => {
  const savedCounselor = localStorage.getItem("loggedInCounselor");
  if (savedCounselor) {
    showDashboard();
  }
};

/* ================================
   Login Handling
================================ */
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

/* ================================
   Dashboard Controls
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
   Load & Display Messages
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

  // Clear all message containers
  document.querySelectorAll(".messages").forEach(div => {
    div.innerHTML = "";
  });

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
      <strong>${msg.firstName} ${msg.lastName} (Grade ${msg.grade})</strong><br>
      Reason: ${msg.reason}<br>
      Urgency: ${msg.urgency}<br>
      ${msg.notes ? `Notes: ${msg.notes}<br>` : ""}
      Time: ${msg.time}
    `;

    container.appendChild(card);
  });
}

/* ================================
   Search Filter
================================ */
searchBar.addEventListener("input", () => {
  const query = searchBar.value.toLowerCase();

  document.querySelectorAll(".message-card").forEach(card => {
    card.style.display = card.textContent.toLowerCase().includes(query)
      ? "block"
      : "none";
  });
});
