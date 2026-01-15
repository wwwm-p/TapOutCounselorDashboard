const counselorEmail = "miap2k10@gmail.com"; 
// Change this per counselor

function loadRequests() {
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
  alert("Calendar will open here.");
}

function toggleStudentsPanel() {
  alert("Students panel placeholder.");
}

function toggleNotesPanel() {
  alert("Notes panel placeholder.");
}

loadRequests();
