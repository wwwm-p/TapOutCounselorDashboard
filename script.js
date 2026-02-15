/* ---------- ELEMENTS ---------- */
const loginForm = document.getElementById("loginForm");
const username = document.getElementById("username");
const password = document.getElementById("password");
const loginScreen = document.getElementById("loginScreen");
const dashboardScreen = document.getElementById("dashboardScreen");
const profileBubble = document.getElementById("profileBubble");
const searchBar = document.getElementById("searchBar");
const bellDot = document.getElementById("bellDot");
const bellDropdown = document.getElementById("bellDropdown");
const notifBell = document.getElementById("notifBell");
const calendarOverlay = document.getElementById("calendarOverlay");
const calendarGrid = document.getElementById("calendarGrid");
const monthLabel = document.getElementById("monthLabel");

/* ---------- LOGIN ---------- */
loginForm.onsubmit = e => {
  e.preventDefault();
  sisLogin(username.value, password.value);
};

async function sisLogin(user, pass){
  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({username:user, password:pass})
    });
    const data = await res.json();
    if(data.success){
      localStorage.setItem("loggedInCounselor", user);
      showDashboard();
    } else {
      alert("Invalid login");
    }
  } catch(err){
    console.error(err);
    alert("Login failed. Check your network.");
  }
}

function showDashboard(){
  loginScreen.style.display="none";
  dashboardScreen.style.display="block";
  profileBubble.textContent = localStorage.getItem("loggedInCounselor").slice(0,2).toUpperCase();
  loadMessages();
  checkNotifications();
}

function logout(){ 
  localStorage.removeItem("loggedInCounselor"); 
  location.reload(); 
}

/* ---------- CALENDAR ---------- */
const today = new Date();

function openCalendar(){ 
  calendarOverlay.style.display="flex"; 
  renderCalendar(); 
}
function closeCalendar(){ 
  calendarOverlay.style.display="none"; 
}

async function fetchAppointmentsFromSIS(){
  try {
    const res = await fetch("/api/appointments");
    return await res.json();
  } catch(err){
    console.error(err);
    return [];
  }
}

async function renderCalendar(){
  calendarGrid.innerHTML="";
  const y = today.getFullYear(), m = today.getMonth();
  monthLabel.textContent = today.toLocaleString("default",{month:"long",year:"numeric"});

  const appts = await fetchAppointmentsFromSIS();

  for(let d=1; d<=new Date(y,m+1,0).getDate(); d++){
    const key = `${y}-${m}-${d}`;
    const cell = document.createElement("div");
    cell.className="calendar-day";
    cell.innerHTML=`<strong>${d}</strong>`;
    appts.filter(a=>a.date===key).forEach(a=>{
      const dot = document.createElement("div");
      dot.className = `dot ${a.urgency}`;
      cell.appendChild(dot);
    });
    cell.onclick = () => addAppt(key);
    calendarGrid.appendChild(cell);
  }
}

async function addAppt(date){
  const urgency = prompt("Urgency (red/orange/yellow/green)");
  if(!urgency) return;

  try {
    await fetch("/api/appointments", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({date, urgency})
    });
    await renderCalendar();
    await checkNotifications();
  } catch(err){
    console.error(err);
    alert("Failed to add appointment");
  }
}

/* ---------- MESSAGES ---------- */
async function fetchMessagesFromSIS(counselorId){
  try {
    const res = await fetch(`/api/messages?counselor=${counselorId}`);
    return await res.json();
  } catch(err){
    console.error(err);
    return [];
  }
}

async function loadMessages(){
  document.querySelectorAll(".messages").forEach(m=>m.innerHTML="");
  const counselor = localStorage.getItem("loggedInCounselor");
  const data = await fetchMessagesFromSIS(counselor);
  const map = {
    "I’m in Crisis":"red-row",
    "I’m Not Coping Well":"orange-row",
    "Feeling a Little Off":"yellow-row",
    "I’m Doing Fine – Just Curious":"green-row"
  };

  data.forEach(m=>{
    const card = document.createElement("div");
    card.className="message-card";

    const sentAt = m.dateTime || "Unknown time";

    card.innerHTML = `
      <strong>${m.firstName} ${m.lastName || ""}</strong><br>
      Grade ${m.grade}<br>
      ${m.reason}<br>
      ${m.notes ? "<em>Notes:</em> " + m.notes + "<br>" : ""}
      <small>Sent: ${sentAt}</small>
    `;
    document.querySelector(`#${map[m.urgency]} .messages`).appendChild(card);
  });
}

/* ---------- SEARCH ---------- */
searchBar.oninput = () => {
  const q = searchBar.value.toLowerCase();
  document.querySelectorAll(".message-card").forEach(c => 
    c.style.display = c.textContent.toLowerCase().includes(q)?"block":"none"
  );
};

/* ---------- TOGGLE ---------- */
function toggleMessages(id){
  const box = document.querySelector(`#${id} .messages`);
  const btn = document.querySelector(`#${id} .toggle-btn`);
  const hide = box.style.display!=="none";
  box.style.display = hide?"none":"flex";
  btn.textContent = hide?"Show Messages":"Hide Messages";
}

/* ---------- NOTIFICATIONS ---------- */
async function checkNotifications(){
  const counselor = localStorage.getItem("loggedInCounselor");
  const students = await fetchMessagesFromSIS(counselor);
  const appointments = await fetchAppointmentsFromSIS();

  const crisisStudents = students.filter(s => s.urgency==="I’m in Crisis");
  const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  const apptToday = appointments.filter(a => a.date===todayKey);

  bellDot.style.display = (crisisStudents.length || apptToday.length) ? "block" : "none";

  bellDropdown.innerHTML = "";
  if(!crisisStudents.length && !apptToday.length){
    const div = document.createElement("div");
    div.textContent = "No notifications";
    bellDropdown.appendChild(div);
  }

  crisisStudents.forEach(s=>{
    const div = document.createElement("div");
    div.textContent = `🚨 Student in Crisis: ${s.firstName} ${s.lastName || ""}`;
    bellDropdown.appendChild(div);
  });

  apptToday.forEach(a=>{
    const div = document.createElement("div");
    div.textContent = `📅 Appointment today`;
    bellDropdown.appendChild(div);
  });
}

notifBell.onclick = () => {
  bellDropdown.style.display = bellDropdown.style.display==="flex" ? "none" : "flex";
  bellDot.style.display="none";
}

setInterval(async()=>{ await checkNotifications(); }, 5000);

/* ---------- INITIAL ---------- */
window.onload = async ()=>{
  if(localStorage.getItem("loggedInCounselor")){
    showDashboard();
  }
};










