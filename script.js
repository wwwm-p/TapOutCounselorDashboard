// Check login on load
window.onload = () => {
  const savedEmail = localStorage.getItem("counselorEmail");
  if (savedEmail) showDashboard();
};

// LOGIN
function login() {
  const email = document.getElementById("loginEmail").value.trim();
  if (!email) {
    alert("Enter your counselor email.");
    return;
  }

  localStorage.setItem("counselorEmail", email);
  showDashboard();
}

// LOGOUT
function logout() {
  localStorage.removeItem("counselorEmail");
  location.reload();
}

// SHOW DASHBOARD
function showDashboard() {
  document.getElementById("loginScreen").style.display = "none";
  document.getElementById("dashboardScreen").style.display = "block";
  loadRequests();
}

// LOAD REQUESTS
function loadRequests() {
  const counselorEmail = localStorage.getItem("counselorEmail");
  const requests = JSON.parse(localStorage.getItem("requests") || "[]");

  document.querySelectorAll(".requests").forEach(list => list.innerHTML = "");

  requests
    .filter(r => r.counselor === counselorEmail)
    .forEach(r => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${r.name} (Grade ${r.grade})</strong><br>
        Reason: ${r.reason}<br>
        Urgency: ${r.urgency}<br>
        Time: ${r.time}
      `;

      if (r.urgency === "I’m in Crisis")
        document.querySelector("#red-row .requests").appendChild(li);
      else if (r.urgency === "I’m Not Coping Well")
        document.querySelector("#orange-row .requests").appendChild(li);
      else if (r.urgency === "Feeling a Little Off")
        document.querySelector("#yellow-row .requests").appendChild(li);
      else
        document.querySelector("#green-row .requests").appendChild(li);
    });
}

// PLACEHOLDER BUTTONS
function openCalendar() {
  alert("Calendar feature coming soon.");
}
function toggleStudentsPanel() {
  alert("Students panel coming soon.");
}
function toggleNotesPanel() {
  alert("Notes panel coming soon.");
}

