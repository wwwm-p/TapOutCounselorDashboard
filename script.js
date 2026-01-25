let selectedReason = "";
let selectedUrgency = "";
let selectedCounselorEmail = "";

/* ================================
   Page Navigation
================================ */
function goToPage(pageId) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");
}

function chooseReason(reason) {
  selectedReason = reason;
  goToPage("page2");
}

function chooseUrgency(urgency) {
  selectedUrgency = urgency;
  goToPage("page3");
}

/* ================================
   Modal Handling
================================ */
function openModal(counselorEmail) {
  selectedCounselorEmail = counselorEmail;
  document.getElementById("modalOverlay").style.display = "flex";

  // Clear previous values
  document.getElementById("firstName").value = "";
  document.getElementById("lastName").value = "";
  document.getElementById("studentGrade").value = "";
  document.getElementById("extraNotes").value = "";
}

function closeModal() {
  document.getElementById("modalOverlay").style.display = "none";
}

/* ================================
   Submit Message
================================ */
function submitMessage() {
  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const grade = document.getElementById("studentGrade").value.trim();
  const notes = document.getElementById("extraNotes").value.trim();

  if (!firstName || !lastName || !grade) {
    alert("Please fill out First Name, Last Name, and Grade.");
    return;
  }

  // Convert email → counselor username
  const counselorUsername = selectedCounselorEmail.split("@")[0];

  // Get existing messages or start fresh
  const messages = JSON.parse(localStorage.getItem("studentMessages") || "[]");

  messages.push({
    firstName,
    lastName,
    grade,
    reason: selectedReason,
    urgency: selectedUrgency,
    counselor: counselorUsername,
    notes,
    time: new Date().toLocaleString()
  });

  localStorage.setItem("studentMessages", JSON.stringify(messages));

  alert("Your message has been sent.");
  closeModal();
  location.reload();
}

