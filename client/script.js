const emailInput = document.getElementById("emailInput");
const sendCodeButton = document.getElementById("sendCodeButton");
const spinner = document.getElementById("spinner");
const firstCard = document.getElementById("firstCard");
const secondCard = document.getElementById("secondCard");

const baseURL = "http://localhost:3000";

sendCodeButton.addEventListener("click", async function (e) {
  e.preventDefault();

  const email = emailInput.value;

  if (email === "") {
    alert("Please enter your email.");
    return;
  }

  try {
    spinner.style.display = "block";
    const response = await fetch(baseURL + "/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    alert("A verification code was sent to your email.");

    firstCard.style.display = "none";
    secondCard.style.display = "block";
  } catch (error) {
    console.error("Fetch error:", error);
    alert("Failed to register user.");
  } finally {
    spinner.style.display = "none";
  }
});
