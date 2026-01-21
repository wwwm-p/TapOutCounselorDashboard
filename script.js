let counselorEmail = "";

function login() {
  counselorEmail = loginEmail.value;
  if (!counselorEmail) return alert("Enter email");

  loginScreen.style.display = "none";
  dashboard.style.display = "block";

  loadRequests();
}

function logout() {
  location.reload();
}

function loadRequests() {
  const requests = JSON.parse(localStorage.getItem("requests") || "[]");

  requests
    .filter(r => r.counselor === counselorEmail)
    .forEach(addNotification);
}

function addNotification(data) {
  const card = document.createElement("div");
  card.className = "request-card";
  card.innerHTML = `
    <strong>${data.student}</strong> (Grade ${data.grade})<br>
    Reason: ${data.reason}<br>
    Urgency: ${data.urgency}<br>
    <p>${data.message}</p>
  `;

  if (data.urgency === "Crisis") crisisList.append(card);
  else if (data.urgency === "Medium High") highList.append(card);
  else if (data.urgency === "Medium Low") mediumList.append(card);
  else lowList.append(card);
}

function openCalendar() {
  alert("Calendar coming soon");
}

function toggleNotes() {
  notesPanel.style.display =
    notesPanel.style.display === "none" ? "block" : "none";
}

function saveNote() {
  const notes = JSON.parse(localStorage.getItem("notes") || "[]");
  notes.push(newNote.value);
  localStorage.setItem("notes", JSON.stringify(notes));
  loadNotes();
}

function loadNotes() {
  notesHistory.innerHTML = "";
  const notes = JSON.parse(localStorage.getItem("notes") || "[]");
  notes.forEach(n => {
    const li = document.createElement("li");
    li.textContent = n;
    notesHistory.append(li);
  });
}











