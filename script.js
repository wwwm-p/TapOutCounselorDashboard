const counselorEmail = "miap2k10@gmail.com"; // CHANGE per counselor

function loadRequests() {
  const search = document.getElementById("searchBar").value.toLowerCase();

  document.querySelectorAll(".urgency-row ul").forEach(ul => ul.innerHTML = "");

  const requests = JSON.parse(localStorage.getItem("requests") || "[]");

  requests
    .filter(r => r.counselor === counselorEmail)
    .filter(r => r.name.toLowerCase().includes(search))
    .forEach(r => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${r.name} (Grade ${r.grade})</strong><br>
        Reason: ${r.reason}<br>
        Time: ${r.time}
      `;
      document.querySelector(`#${r.urgency} ul`).appendChild(li);
    });
}

function openCalendar() {
  alert("Calendar feature coming soon");
}

function toggleNotes() {
  alert("Notes feature coming soon");
}

loadRequests();
