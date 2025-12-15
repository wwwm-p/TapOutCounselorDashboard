const students = [
  { name: "Alice Johnson", grade: 12, email: "alice@school.org" },
  { name: "Brian Lee", grade: 11, email: "brian@school.org" },
  { name: "Michael Smith", grade: 10, email: "michael@school.org" }
];

let notes = JSON.parse(localStorage.getItem("notes") || "[]");

function toggleStudents() {
  document.getElementById("studentsPanel").classList.toggle("hidden");
  renderStudents();
}

function toggleNotes() {
  document.getElementById("notesPanel").classList.toggle("hidden");
  loadNotes();
}

function renderStudents() {
  const list = document.getElementById("studentsList");
  const search = document.getElementById("studentSearch").value.toLowerCase();
  const sort = document.getElementById("sortStudents").value;

  let filtered = students.filter(s =>
    s.name.toLowerCase().includes(search)
  );

  if (sort === "alpha") filtered.sort((a,b)=>a.name.localeCompare(b.name));
  else filtered.sort((a,b)=>a.grade-b.grade);

  list.innerHTML = "";
  filtered.forEach(s => {
    const li = document.createElement("li");
    li.textContent = `${s.name} — Grade ${s.grade}`;
    li.onclick = () => openStudent(s);
    list.appendChild(li);
  });
}

document.getElementById("studentSearch").addEventListener("input", renderStudents);

function openStudent(student) {
  document.getElementById("studentDetail").classList.remove("hidden");
  document.getElementById("studentsPanel").classList.add("hidden");

  document.getElementById("detailName").textContent = student.name;
  document.getElementById("detailEmail").textContent = student.email;
}

function closeStudent() {
  document.getElementById("studentDetail").classList.add("hidden");
}

function saveNote() {
  const text = document.getElementById("noteInput").value.trim();
  if (!text) return;

  notes.push(text);
  localStorage.setItem("notes", JSON.stringify(notes));
  document.getElementById("noteInput").value = "";
  loadNotes();
}

function loadNotes() {
  const list = document.getElementById("notesList");
  list.innerHTML = "";

  notes.forEach(n => {
    const li = document.createElement("li");
    li.textContent = n;
    list.appendChild(li);
  });
}

function openCalendar() {
  alert("Calendar integration coming next.");
}
