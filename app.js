require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encryption = require("mongoose-encryption");

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});


userSchema.plugin(encryption, {
  secret: process.env.SECRET ,
  encryptedFields: ["password"]
});

const User = mongoose.model("User", userSchema);

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", function (req, res) {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });

  newUser.save()
    .then(() => {
      res.send("Secrets");
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ email: username })
    .then((foundUser) => {
      if (foundUser) {
        if (foundUser.password === password) {
          res.send("Secrets");
        } else {
          res.send("Invalid password");
        }
      } else {
        res.send("User not found");
      }
    })
    .catch((err) => {
      console.log(err);
      res.send("An error occurred");
    });
});

app.listen(3000, function () {
  console.log("The server is running on port 3000");
});
