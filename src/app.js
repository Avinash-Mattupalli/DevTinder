const express = require("express");
const { admin_auth } = require("./middlewares/auth");
const User = require("./models/user");
const connectDB = require("./config/database");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");
const app = express();

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");

connectDB()
  .then(() => {
    console.log("Database connection successful!");
    app.listen(7777, () => {
      console.log("Server Running Successfully On Port 7777");
    });
  })
  .catch(() => {
    console.error("Failed to connect to database");
  });

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

// get user

app.get("/user", async (req, res) => {
  const email = req.body.email;

  try {
    const users = await User.find({ email });

    // findOne() will return the old or first entry if we have multiple entries for the given filters
    // const oneUser = await User.findOne({ email });

    if (users.length === 0) {
      res.status(404).send("User Not Found");
    } else {
      res.send(users);
    }
  } catch {
    res.status(400).send("something went wrong");
  }
});

// get all users

app.get("/feed", async (req, res) => {
  try {
    //here if we send empty object (filter) in find method it will return all the available records.
    const allUsers = await User.find({});

    if (allUsers.length === 0) {
      res.status(400).send("No users found. Create new users");
    } else {
      res.send(allUsers);
    }
  } catch {
    res.status(400).send("Something went wrong while fetching all users");
  }
});

// add a user

app.post("/signup", async (req, res, next) => {
  try {
    //Validation of the data
    validateSignUpData(req);
    const { firstName, lastName, email, password } = req.body;
    //Encrypt passowrd
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await user.save();
    res.send("User Added Successfully");
  } catch (err) {
    res.status(400).send("Error saving data: " + err.message);
  }
});

// login

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!validator.isEmail(email)) {
      throw new Error("Invalid Email Format");
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid user credentials");
    }
    // const isValidPassword = await bcrypt.compare(password, user.password);

    // validation of password using handler function from schema
    const isValidPassword = await user.validatePassword(password);

    if (isValidPassword) {
      // const token = await jwt.sign({ _id: user?._id }, "dev@tinder@token", {
      //   // expiration of jwt token
      //   expiresIn: "7d",
      // });

      //using handler function defined in schema

      const token = await user.getJWT();

      res.cookie("token", token, {
        // cookie expires in 24 hrs- expiration of cookie
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        //Works only in http not in https
        // httpOnly: true,
      });
      res.send("Login Successfull");
    } else {
      throw new Error("Invalid user credentials");
    }
  } catch (error) {
    res.status(400).send("Error:" + error.message);
  }
});

// Profile

app.get("/profile", userAuth, async (req, res) => {
  try {
    // const cookies = req.cookies;
    // const { token } = cookies;
    // if (!token) {
    //   throw new Error("Invalid token");
    // }
    // const decodedMessage = await jwt.verify(token, "dev@tinder@token");
    // const { _id } = decodedMessage;
    // const user = await User.findById(_id);
    const user = req.user;
    if (!user) {
      throw new Error("Invalid request: Login again");
    }
    res.send(user);
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

// delete user

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    // const deleteUser = User.findByIdAndDelete({_id:userId});
    // below is shorthand of above both works the same
    const deleteUser = await User.findByIdAndDelete(userId);
    res.send("User Deleted Successfully");
  } catch {
    res.status(400).send("Failed to delete the user");
  }
});

// update user

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = ["profileUrl", "age", "skills", "about", "gender"];
    const isUpdateAllowed = Objec.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k),
    );
    if (data?.skills.length > 10) {
      throw new Error("Max 10 skills are allowed");
    }

    if (!isUpdateAllowed) {
      throw new Error("Update Not Allowed");
    }
    // here the third parameter in findByIdAndUpdate is options which will have specific use cases here retrunDocument:"before"(default value) will return object before update
    const oldUserRecord = await User.findByIdAndUpdate(userId, data, {
      returnDocument: "before",
      runValidators: true,
    });
    res.send("User Updated Successfully");
  } catch {
    res.status(400).send("Failed to update the user" + err.message);
  }
});

// app.get("/user/:userId/:name/:pwd", (req, res) => {
//   console.log(req.query);
//   res.send({ firstname: "Avinash", lastname: "Mattupalli" });
// });
// app.get("/user/:userId/:name/:pwd", (req, res) => {
//   console.log(req.params);
//   res.send({ firstname: "Avinash", lastname: "Mattupalli" });
// });
// app.get("/user", (req, res) => {
//   res.send({ firstname: "Avinash", lastname: "Mattupalli" });
// });
// app.post("/user", (req, res) => {
//   res.send("Data successfully stored in DB");
// });
// app.delete("/user", (req, res) => {
//   res.send("Data deleted in DB");
// });
// app.use("/login", (req, res) => {
//   res.send("DevTinder Login Page");
// });
// app.use("/requests", (req, res) => {
//   res.send("DevTinder Requests Page");
// });
// app.use("/profile", (req, res) => {
//   res.send("DevTinder Profile Page");
// });
// app.use("/", (req, res) => {
//   res.send("DevTinder Home Page");
// });

// //Example of next to call the next available handler
// app.use(
//   "/user",
//   (req, res, next) => {
//     console.log("Handler 1");
//     res.send("Handler 1 executed");
//     next();
//   },
//   (req, res) => {
//     console.log("Handler 2");
//     res.send("Handler 2 executed");
//   },
// );
// // even handlers are wrapped in an array it behaves same as above. all or some handlers can be wrapped in an array. can be used in any CURD methods
// app.use("/user", [
//   (req, res, next) => {
//     console.log("Handler 1");
//     res.send("Handler 1 executed");
//     next();
//   },
//   (req, res) => {
//     console.log("Handler 2");
//     res.send("Handler 2 executed");
//   },
// ]);

// // auth example

// app.get("/admin/getall", admin_auth);

// // error handling
// app.use("/", (err, req, res, next) => {
//   if (err) {
//     res.status(500).send("Something went wrong");
//   }
// });
// // error handling using try catch
// app.get("/userdata", (req, res, next) => {
//   try {
//     throw new Error("Error Test");
//   } catch (err) {
//     res.status(500).send("error occured");
//   }
// });
