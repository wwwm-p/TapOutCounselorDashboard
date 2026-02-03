document.addEventListener("DOMContentLoaded", () => {

  /* ---------- COUNSELORS ---------- */
  const counselors = {
    miap2k10: "1234",
    kmcconnell: "1234",
    gsorbi: "1234",
    apanlilio: "1234",
    aturner: "1234",
    cfilson: "1234"
  };

  /* ---------- ELEMENTS ---------- */
  const loginScreen = document.getElementById("loginScreen");
  const dashboardScreen = document.getElementById("dashboardScreen");
  const loginForm = document.getElementById("loginForm");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const searchBar = document.getElementById("searchBar");
  const profileBubble = document.getElementById("profileBubble");

  if (!loginForm || !usernameInput || !passwordInput) {
    alert("Login form elements not found. Check IDs.");
    return;
  }

  /* ---------- AUTO LOGIN ---------- */
  const savedUser = localStorage.getItem("loggedInCounselor");
  if (savedUser && counselors[savedUser]) {
    showDashboard(savedUser);
  }

  /* ---------- LOGIN ---------- */
  loginForm.addEventListener("submit", e => {
    e.preventDefault();

    const user = usernameInput.value.trim().toLowerCase();
    const pass = passwordInput.value.trim();

    console.log("Attempt login:", user, pass);

    if (counselors[user] === pass) {
      localStorage.setItem("loggedInCounselor", user);
      showDashboard(user);
    } else {
      alert("Invalid username or password");
    }
  });

  /* ---------- DASHBOARD ---------- */
  function showDashboard(user) {
    loginScreen.style.display = "none";
    dashboardScreen.style.display = "block";

    if (profileBubble) {
      profileBubble.textContent = user.slice(0, 2).toUpperCase();
    }

    loadMessages();
  }

  /* ---------- LOGOUT ---------- */
  window.logout = function () {
    localStorage.removeItem("loggedInCounselor");
    location.reload();
  };

  /* ---------- LOAD MESSAGES ---------- */
  function loadMessages() {
    const counselor = localStorage.getItem("loggedInCounselor");
    if (!counselor) return;

    const messages = JSON.parse(
      localStorage.getItem("studentMessages") || "[]"
    );

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

      const card = document.createElement("div");
      card.className = "message-card";

      card.innerHTML = `
        <strong>${msg.firstName || msg.name || "Student"} ${msg.lastName || ""}</strong><br>
        Grade: ${msg.grade || "N/A"}<br>
        ${msg.reason || ""}<br>
        ${msg.dateTime || ""}
      `;

      container.appendChild(card);
    });
  }

  /* ---------- SEARCH ---------- */
  if (searchBar) {
    searchBar.addEventListener("input", () => {
      const q = searchBar.value.toLowerCase();
      document.querySelectorAll(".message-card").forEach(card => {
        card.style.display = card.textContent.toLowerCase().includes(q)
          ? "block"
          : "none";
      });
    });
  }

});




