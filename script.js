const counselorEmail = "miap2k10@gmail.com";

const rows = {
  "I’m in Crisis": document.querySelector("#red-row ul"),
  "I’m Not Coping Well": document.querySelector("#orange-row ul"),
  "Feeling a Little Off": document.querySelector("#yellow-row ul"),
  "I’m Doing Fine – Just Curious": document.querySelector("#green-row ul")
};

function loadRequests() {
  Object.values(rows).forEach(row => row.innerHTML = "");

  const requests = JSON.parse(localStorage.getItem("requests") || "[]");

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
      rows[r.urgency]?.appendChild(li);
    });
}

loadRequests();

function openCalendar() {
  alert("Calendar feature coming soon.");
}

function toggleNotes() {
  alert("Notes feature coming soon.");
}
