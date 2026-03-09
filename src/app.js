const express = require("express");
const { admin_auth } = require("./middlewares/adminAuth");
const app = express();

app.listen(7777, () => {
  console.log("Server Running Successfully On Port 7777");
});

app.get("/user/:userId/:name/:pwd", (req, res) => {
  console.log(req.query);
  res.send({ firstname: "Avinash", lastname: "Mattupalli" });
});
app.get("/user/:userId/:name/:pwd", (req, res) => {
  console.log(req.params);
  res.send({ firstname: "Avinash", lastname: "Mattupalli" });
});
app.get("/user", (req, res) => {
  res.send({ firstname: "Avinash", lastname: "Mattupalli" });
});
app.post("/user", (req, res) => {
  res.send("Data successfully stored in DB");
});
app.delete("/user", (req, res) => {
  res.send("Data deleted in DB");
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

//Example of next to call the next available handler
app.use(
  "/user",
  (req, res, next) => {
    console.log("Handler 1");
    res.send("Handler 1 executed");
    next();
  },
  (req, res) => {
    console.log("Handler 2");
    res.send("Handler 2 executed");
  },
);
// even handlers are wrapped in an array it behaves same as above. all or some handlers can be wrapped in an array. can be used in any CURD methods
app.use("/user", [
  (req, res, next) => {
    console.log("Handler 1");
    res.send("Handler 1 executed");
    next();
  },
  (req, res) => {
    console.log("Handler 2");
    res.send("Handler 2 executed");
  },
]);

// auth example

app.get("/admin/getall", admin_auth);
