// 🔹 Counselor ID (CHANGE THIS PER COUNSELOR)
const counselorId = "smith";

// 🔹 Firebase Config (REPLACE WITH YOUR OWN)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// 🔹 Load Requests
async function loadRequests() {
  const snapshot = await db
    .collection("requests")
    .where("counselor", "==", counselorId)
    .get();

  const crisisList = document.getElementById("crisisList");
  const urgentList = document.getElementById("urgentList");
  const normalList = document.getElementById("normalList");

  crisisList.innerHTML = "";
  urgentList.innerHTML = "";
  normalList.innerHTML = "";

  snapshot.forEach(doc => {
    const r = doc.data();

    const card = document.createElement("div");
    card.className = "request-card";
    card.innerHTML = `
      <strong>${r.student} (Grade ${r.grade})</strong>
      <p>Reason: ${r.reason}</p>
      <p>Urgency: ${r.urgency}</p>
    `;

    if (r.urgency === "Crisis") crisisList.appendChild(card);
    else if (r.urgency === "Urgent") urgentList.appendChild(card);
    else normalList.appendChild(card);
  });
}

// 🔹 Auto Refresh
setInterval(loadRequests, 5000);
loadRequests();
