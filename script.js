const counselors = {
  "miap2k10": "1234",
  "kmcconnell": "1234",
  "gsorbi": "1234",
  "apanlilio": "1234",
  "aturner": "1234",
  "cfilson": "1234"
};

document.getElementById("loginBtn").addEventListener("click", () => {
  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();

  if (counselors[user] === pass) {
    localStorage.setItem("loggedInCounselor", user);
    window.location.href = "counselor-dashboard.html";
  } else {
    alert("Invalid login");
  }
});






