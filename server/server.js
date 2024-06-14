const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

require("dotenv").config();

const app = express();

app.use(express.json());

app.use(cors());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

function generateVerificationCode() {
  return crypto.randomBytes(3).toString("hex");
}

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: "june.cummerata@ethereal.email",
    pass: "3gdTzSeAVNGMQKX3qT",
  },
});

// Register API
app.post("/register", async (req, res) => {
  const { email } = req.body;

  const verificationCode = generateVerificationCode();
  try {
    const newUser = await new User({ email, verificationCode });
    console.log(newUser);
    await newUser.save();

    const emailInfo = await transporter.sendMail({
      from: "june.cummerata@ethereal.email",
      to: email,
      subject: "DANNF: Your Verification Code",
      text: `Your verification code is: ${verificationCode}`,
    });

    console.log(emailInfo);

    res.status(201).json({
      message: "User registered! Verification code sent.",
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to register" });
  }
});

app.patch("/verify", async (req, res) => {
  const { inputCode, email } = req.body;

  try {
    const user = await User.findOne({ email });
    console.log(inputCode === user.verificationCode);
    if (inputCode === user.verificationCode) {
      await User.findOneAndUpdate({ email }, { isVerified: true });
      res.status(200).json({ verified: true });
    } else {
      res.status(400).json({ message: "Incorrect verification code" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to verify" });
  }
});

app.patch("/complete-registration", async (req, res) => {
  try {
    const { email, mobileNumber, fullName, nationalID, motorcycleNumber } =
      req.body;

    const user = await User.findOneAndUpdate(
      { email },
      { mobileNumber, fullName, nationalID, motorcycleNumber }
    );
    console.log(req.body);

    res.status(200).json({ message: "Information added successfully!", user });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
