let students = [
    { name: "Alice Johnson", grade: 12, email: "alice.johnson@school.org" },
    { name: "Michael Smith", grade: 10, email: "michael.smith@school.org" },
    { name: "Brian Lee", grade: 11, email: "brian.lee@school.org" },
    { name: "Sofia Martinez", grade: 9, email: "sofia.martinez@school.org" }
];

let selectedStudent = null;

// Load notes
let notes = JSON.parse(localStorage.getItem("notesData") || "[]");

function toggleStudentsPanel() {
    document.getElementById("studentsPanel").classList.toggle("hidden");
    document.getElementById("notesPanel").classList.add("hidden");
    renderStudentList();
}

function toggleNotesPanel() {
    document.getElementById("notesPanel").classList.toggle("hidden");
    loadNotes();
}

function renderStudentList() {
    let list = document.getElementById("studentList");
    let sort = document.getElementById("sortOption").value;
    let query = document.getElementById("studentSearchHeader").value.toLowerCase();

    let filtered = students.filter(s => s.name.toLowerCase().includes(query));

    if (sort === "alpha") filtered.sort((a, b) => a.name.localeCompare(b.name));
    else filtered.sort((a, b) => a.grade - b.grade);

    list.innerHTML = "";

    filtered.forEach(stu => {
        let li = document.createElement("li");
        li.textContent = `${stu.name} (Grade ${stu.grade})`;
        li.onclick = () => openStudentDetail(stu);
        list.appendChild(li);
    });
}

document.getElementById("studentSearchHeader").addEventListener("input", renderStudentList);

function openStudentDetail(student) {
    selectedStudent = student;

    document.getElementById("studentDetailPanel").classList.remove("hidden");
    document.getElementById("studentsPanel").classList.add("hidden");
    document.getElementById("notesPanel").classList.add("hidden");

    document.getElementById("studentName").textContent = student.name;
    document.getElementById("studentEmail").textContent = student.email;
}

function closeStudentDetail() {
    document.getElementById("studentDetailPanel").classList.add("hidden");
}

// NOTES
function saveNote() {
    let text = document.getElementById("newNote").value.trim();
    if (!text) return;

    notes.push(text);
    document.getElementById("newNote").value = "";

    localStorage.setItem("notesData", JSON.stringify(notes));
    loadNotes();
}

function loadNotes() {
    let list = document.getElementById("notesHistory");
    list.innerHTML = "";

    if (notes.length === 0) {
        list.innerHTML = "<li>No notes yet.</li>";
        return;
    }

    notes.forEach(n => {
        let li = document.createElement("li");
        li.textContent = n;
        list.appendChild(li);
    });
}

function openCalendar() {
    alert("Calendar will open here.");
}
