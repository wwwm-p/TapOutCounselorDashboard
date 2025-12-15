let students = [
    { name: "Alice Johnson", grade: 12, email: "alice.johnson@school.org" },
    { name: "Michael Smith", grade: 10, email: "michael.smith@school.org" },
    { name: "Brian Lee", grade: 11, email: "brian.lee@school.org" },
    { name: "Sofia Martinez", grade: 9, email: "sofia.martinez@school.org" }
];

let notes = JSON.parse(localStorage.getItem("notesData") || "[]");
let selectedStudent = null;

// STUDENTS PANEL
function toggleStudentsPanel() {
    closeAllPanels();
    document.getElementById("studentsPanel").classList.toggle("hidden");
    renderStudentList();
}

function renderStudentList() {
    let list = document.getElementById("studentList");
    let sort = document.getElementById("sortOption").value;
    let query = document.getElementById("studentSearchHeader").value.toLowerCase();

    let filtered = students.filter(s =>
        s.name.toLowerCase().includes(query)
    );

    if (sort === "alpha") {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else {
        filtered.sort((a, b) => a.grade - b.grade);
    }

    list.innerHTML = "";
    filtered.forEach(stu => {
        let li = document.createElement("li");
        li.textContent = `${stu.name} (Grade ${stu.grade})`;
        li.onclick = () => openStudentDetail(stu);
        list.appendChild(li);
    });
}

document.getElementById("studentSearchHeader")
    .addEventListener("input", renderStudentList);

// STUDENT DETAIL
function openStudentDetail(student) {
    closeAllPanels();
    selectedStudent = student;

    document.getElementById("studentName").textContent = student.name;
    document.getElementById("studentEmail").textContent = student.email;
    document.getElementById("studentDetailPanel").classList.remove("hidden");
}

function closeStudentDetail() {
    document.getElementById("studentDetailPanel").classList.add("hidden");
}

// NOTES
function toggleNotesPanel() {
    closeAllPanels();
    document.getElementById("notesPanel").classList.toggle("hidden");
    loadNotes();
}

function saveNote() {
    let text = document.getElementById("newNote").value.trim();
    if (!text) return;

    notes.push(text);
    localStorage.setItem("notesData", JSON.stringify(notes));
    document.getElementById("newNote").value = "";
    loadNotes();
}

function loadNotes() {
    let list = document.getElementById("notesHistory");
    list.innerHTML = "";

    if (notes.length === 0) {
        list.innerHTML = "<li>No notes saved.</li>";
        return;
    }

    notes.forEach(note => {
        let li = document.createElement("li");
        li.textContent = note;
        list.appendChild(li);
    });
}

// UTIL
function closeAllPanels() {
    document.getElementById("studentsPanel").classList.add("hidden");
    document.getElementById("studentDetailPanel").classList.add("hidden");
    document.getElementById("notesPanel").classList.add("hidden");
}

function openCalendar() {
    alert("Calendar feature goes here.");
}
