const counselor = localStorage.getItem("loggedInCounselor");

if (!counselor) {
  window.location.href = "counselor-login.html";
}

const messages = JSON.parse(localStorage.getItem("studentMessages")) || [];

const board = document.getElementById("messageBoard");

const urgencyOrder = ["High", "Medium", "Low"];

urgencyOrder.forEach(level => {
  const section = document.createElement("div");
  section.innerHTML = `<h2>${level} Urgency</h2>`;

  messages
    .filter(msg => msg.urgency === level && msg.counselor === counselor)
    .forEach(msg => {
      const card = document.createElement("div");
      card.className = "message-card";
      card.innerHTML = `
        <strong>Reason:</strong> ${msg.reason}<br>
        <strong>Message:</strong> ${msg.message}
      `;
      section.appendChild(card);
    });

  board.appendChild(section);
});

function logout() {
  localStorage.removeItem("loggedInCounselor");
  window.location.href = "counselor-login.html";
}







