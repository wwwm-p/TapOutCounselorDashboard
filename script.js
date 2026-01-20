function loadStudentMessages() {
  const messages = JSON.parse(localStorage.getItem("studentMessages") || "[]");

  const rows = {
    "I’m in Crisis": document.querySelector(".red-face"),
    "I’m Not Coping Well": document.querySelector(".orange-face"),
    "Feeling a Little Off": document.querySelector(".yellow-face"),
    "I’m Doing Fine – Just Curious": document.querySelector(".green-face")
  };

  // Clear old messages
  Object.values(rows).forEach(row => {
    row.querySelectorAll(".message-card").forEach(card => card.remove());
  });

  messages.forEach(msg => {
    const row = rows[msg.urgency];
    if (!row) return;

    const card = document.createElement("div");
    card.className = "message-card";
    card.innerHTML = `
      <strong>${msg.name}</strong><br>
      Grade: ${msg.grade}<br>
      Reason: ${msg.reason}<br>
      <small>${msg.time}</small>
    `;

    row.appendChild(card);
  });
}

// Load automatically
window.onload = loadStudentMessages;










