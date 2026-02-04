/* ---------- LOGIN ---------- */
const counselors = { miap2k10:"1234", kmcconnell:"1234", gsorbi:"1234", apanlilio:"1234", aturner:"1234", cfilson:"1234" };

loginForm.onsubmit = e => {
  e.preventDefault();
  if(counselors[username.value]===password.value){
    localStorage.setItem("loggedInCounselor", username.value);
    showDashboard();
  } else alert("Invalid login");
};

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
const calendarOverlay = document.getElementById("calendarOverlay");
const calendarGrid = document.getElementById("calendarGrid");
const monthLabel = document.getElementById("monthLabel");

function openCalendar(){ 
  calendarOverlay.style.display="flex"; 
  renderCalendar(); 
}
function closeCalendar(){ calendarOverlay.style.display="none"; }

function renderCalendar(){
  calendarGrid.innerHTML="";
  const y=today.getFullYear(), m=today.getMonth();
  monthLabel.textContent = today.toLocaleString("default",{month:"long",year:"numeric"});
  const appts = JSON.parse(localStorage.getItem("appointments")||"[]");

  for(let d=1; d<=new Date(y,m+1,0).getDate(); d++){
    const key=`${y}-${m}-${d}`;
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

function addAppt(date){
  const urgency = prompt("Urgency (red/orange/yellow/green)");
  if(!urgency) return;
  const appts = JSON.parse(localStorage.getItem("appointments")||"[]");
  appts.push({date,urgency});
  localStorage.setItem("appointments",JSON.stringify(appts));
  renderCalendar();
  checkNotifications();
}

/* ---------- MESSAGES ---------- */
function loadMessages(){
  document.querySelectorAll(".messages").forEach(m=>m.innerHTML="");
  const counselor = localStorage.getItem("loggedInCounselor");
  const data = JSON.parse(localStorage.getItem("studentMessages")||"[]");
  const map = {"I’m in Crisis":"red-row","I’m Not Coping Well":"orange-row","Feeling a Little Off":"yellow-row","I’m Doing Fine – Just Curious":"green-row"};

  data.forEach(m=>{
    if(m.counselor!==counselor) return;

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
  document.querySelectorAll(".message-card").forEach(c => c.style.display = c.textContent.toLowerCase().includes(q)?"block":"none");
};

/* ---------- TOGGLE ---------- */
function toggleMessages(id){
  const box=document.querySelector(`#${id} .messages`);
  const btn=document.querySelector(`#${id} .toggle-btn`);
  const hide = box.style.display!=="none";
  box.style.display = hide?"none":"flex";
  btn.textContent = hide?"Show Messages":"Hide Messages";
}

/* ---------- NOTIFICATIONS BELL ---------- */
const bellDot = document.getElementById("bellDot");
const bellDropdown = document.getElementById("bellDropdown");
const notifBell = document.getElementById("notifBell");

function checkNotifications(){
  const counselor = localStorage.getItem("loggedInCounselor");
  const students = JSON.parse(localStorage.getItem("studentMessages")||"[]");
  const appointments = JSON.parse(localStorage.getItem("appointments")||"[]");

  const crisisStudents = students.filter(s=>s.counselor===counselor && s.urgency==="I’m in Crisis");
  const todayDate = new Date();
  const todayKey = `${todayDate.getFullYear()}-${todayDate.getMonth()}-${todayDate.getDate()}`;
  const apptToday = appointments.filter(a=>a.date===todayKey);

  bellDot.style.display = (crisisStudents.length || apptToday.length) ? "block" : "none";

  bellDropdown.innerHTML = "";
  if(crisisStudents.length===0 && apptToday.length===0){
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

setInterval(checkNotifications,5000);

/* ---------- INITIAL ---------- */
window.onload = ()=>{ if(localStorage.getItem("loggedInCounselor")) showDashboard(); }









