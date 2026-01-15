// ----------------------
// FIREBASE CONFIG
// ----------------------
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ----------------------
// COUNSELOR EMAIL (this dashboard only shows requests for this counselor)
// Replace with the logged-in counselor's email
const counselorEmail = "miap2k10@gmail.com";

// ----------------------
// GET ROW ELEMENTS
// ----------------------
const rows = {
  "I’m in Crisis": document.querySelector("#red-row .requests-list"),
  "I’m Not Coping Well": document.querySelector("#orange-row .requests-list"),
  "Feeling a Little Off": document.querySelector("#yellow-row .requests-list"),
  "I’m Doing Fine – Just Curious": document.querySelector("#green-row .requests-list")
};

// ----------------------
// LISTEN TO REQUESTS IN REAL-TIME
// ----------------------
db.collection("requests")
  .where("counselor", "==", counselorEmail)
  .orderBy("time", "desc")
  .onSnapshot(snapshot => {
    // Clear all rows
    Object.values(rows).forEach(ul => ul.innerHTML = "");

    snapshot.forEach(doc => {
      const data = doc.data();
      const { student, grade, reason, urgency, time } = data;

      const li = document.createElement("li");
      li.style.border = "1px solid #ccc";
      li.style.padding = "8px";
      li.style.margin = "6px 0";
      li.style.borderRadius = "6px";
      li.innerHTML = `
        <strong>${student} (Grade ${grade})</strong><br>
        <em>Reason:</em> ${reason}<br>
        <em>Urgency:</em> ${urgency}<br>
        <em>Submitted:</em> ${time?.toDate().toLocaleString() || ""}
      `;

      // Add to the correct row based on urgency
      if(rows[urgency]) rows[urgency].appendChild(li);
    });
  });
