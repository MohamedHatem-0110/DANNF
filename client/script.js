const firstCard = document.getElementById("firstCard");
const secondCard = document.getElementById("secondCard");
const thirdCard = document.getElementById("thirdCard");

const baseURL = "http://localhost:3000";

const emailInput = document.getElementById("emailInput");
const sendCodeButton = document.getElementById("sendCodeButton");
const spinner = document.getElementById("spinner");

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
      alert("Server error. Please try again later.");
    }

    spinner.style.display = "none";

    alert("A verification code was sent to your email.");

    firstCard.style.display = "none";
    secondCard.style.display = "flex";
  } catch (error) {
    console.error("Fetch error:", error);
    spinner.style.display = "none";
    alert("Failed to register user.");
  }
});

const verifyButton = document.getElementById("verifyButton");
const secondEmailInput = secondCard.querySelector("#emailInput");
const verificationCodeInput = document.getElementById("verificationCodeInput");

let userEmail = "";

verifyButton.addEventListener("click", async function (e) {
  e.preventDefault();
  userEmail = secondEmailInput.value;
  const verificationCode = verificationCodeInput.value;
  console.log(secondEmailInput.value);
  if (userEmail === "" || verificationCode === "") {
    alert("Please enter your information.");
    return;
  }
  try {
    spinner.style.display = "block";
    const response = await fetch(baseURL + "/verify", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: userEmail, verificationCode }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      alert(responseData.message);
      return;
    }

    if (responseData.verified) {
      secondCard.style.display = "none";
      thirdCard.style.display = "flex";
    }
  } catch (error) {
    alert("Verification Error.");
  } finally {
    spinner.style.display = "none";
  }
});

const goToVerify = document.getElementById("goToVerify");

goToVerify.addEventListener("click", function (e) {
  e.preventDefault();
  firstCard.style.display = "none";
  secondCard.style.display = "flex";
});

const submit = document.getElementById("submit");

submit.addEventListener("click", async function (e) {
  const inputFields = thirdCard.getElementsByTagName("input");
  const mobileNumber = inputFields[0].value;
  const fullName = inputFields[1].value;
  const nationalID = inputFields[2].value;
  const motorcycleNumber = inputFields[3].value;
  try {
    spinner.style.display = "block";
    const response = await fetch(baseURL + "/complete-registration", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: userEmail,
        mobileNumber,
        fullName,
        nationalID,
        motorcycleNumber,
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      alert("Server error. Please try again later.");
    }

    alert(responseData.message);
  } catch (error) {
    alert("Input data was not saved.");
  } finally {
    spinner.style.display = "none";
  }
});
