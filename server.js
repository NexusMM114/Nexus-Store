const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const { sendAdminAlert, sendOTP } = require("./bot");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const upload = multer({ dest: "uploads/" });

let otpStore = {};
let orders = [];
let comments = [];

app.post("/request-otp", (req, res) => {
  const user = req.body.username.replace("@","").toLowerCase();
  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStore[user] = otp;
  sendOTP(user, otp);
  res.json({ success: true });
});

app.post("/verify-otp", (req, res) => {
  const user = req.body.username.replace("@","").toLowerCase();
  if (otpStore[user] == req.body.otp) {
    delete otpStore[user];
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

app.post("/submit-order", upload.single("proof"), (req, res) => {
  const order = {
    id: "ORD" + Date.now(),
    user: req.body.username,
    logo: req.body.logo,
    upi: req.body.upi,
    status: "PENDING"
  };
  orders.push(order);
  sendAdminAlert("New Order\nUser: " + order.user + "\nLogo: " + order.logo);
  res.send("Order submitted successfully.");
});

app.get("/admin-data", (req, res) => {
  res.json({ orders, comments });
});

app.listen(3000, () => console.log("Server running on port 3000"));
