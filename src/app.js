const express = require("express");
const app = express();

app.listen(7777, () => {
  console.log("Server Running Successfully On Port 7777");
});

app.use("/login", (req, res) => {
  res.send("DevTinder Login Page");
});
app.use("/requests", (req, res) => {
  res.send("DevTinder Requests Page");
});
app.use("/profile", (req, res) => {
  res.send("DevTinder Profile Page");
});
app.use("/", (req, res) => {
  res.send("DevTinder Home Page");
});
