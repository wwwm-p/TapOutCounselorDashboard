// Example counselor accounts
const counselors = {
  "miap2k10": { password: "1234", email: "miap2k10@gmail.com" },
  "kmcconnell": { password: "1234", email: "kmcconnell@smpanthers.org" },
  "gsorbi": { password: "1234", email: "gsorbi@smpanthers.org" }
};

// Auto-login if already signed in
window.onload = () => {
  const saved = localStorage.getItem("counselorEmail");
  if (saved) showDashboard();
};

function login() {
  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();

  if (!counselors[user] || counselors[user].password !== pass) {
    alert("Invalid username or password");
    return;
  }

  localStorage.setItem("counselorEmail", counselors[user].email);
  showDashboard();
}

function logout() {
  localStorage.removeItem("counselorEmail");
  location.reload();
}

function showDashboard() {
  document.getElementById("loginScreen").style.display = "none";
  document.getElementById("dashboardScreen").style.display = "block";
  loadRequests();
}

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

function openCalendar() {
  alert("Calendar coming soon.");
}



