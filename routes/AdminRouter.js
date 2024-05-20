const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../db/userModel");
const router = express.Router();

const JWT_SECRET = 'hocdot123';
const SALT_ROUNDS = 10; 

// router.post("/login", async (req, res) => {
//   const { login_name, password } = req.body;

//   try {
//     const user = await User.findOne({ login_name });
//     if (!user || !(await bcrypt.compare(password, user.password))) {
//       return res.status(400).send({ error: "Invalid login name or password" });
//     }

//     const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

//     res.send({ token, user: { _id: user._id, first_name: user.first_name } });
//   } catch (err) {
//     res.status(500).send({ error: "Internal server error" });
//   }
// });
router.post("/login", async (req, res) => {
  const { login_name, password } = req.body;

  try {
    const user = await User.findOne({ login_name });
    if (!user) {
      return res.status(400).send({ error: "Invalid login name or password" });
    }

    // Check hashed password
    if (await bcrypt.compare(password, user.password)) {
      // Password matches hashed password
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
      return res.send({ token, user: { _id: user._id, first_name: user.first_name } });
    }

    // //ONLY FOR TESTING PURPOSE
    // if (password === user.password) {
    //   // Password matches plaintext password
    //   const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    //   return res.send({ token, user: { _id: user._id, first_name: user.first_name } });
    // }

    return res.status(400).send({ error: "Invalid login name or password" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Internal server error" });
  }
});


router.post("/register", async (req, res) => {
  const { login_name, password, first_name, last_name, location, description, occupation } = req.body;

  try {
    const existingUser = await User.findOne({ login_name });
    if (existingUser) {
      return res.status(400).send({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = new User({
      login_name,
      password: hashedPassword,
      first_name,
      last_name,
      location,
      description,
      occupation
    });
    await newUser.save();

    res.status(201).send({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).send({ error: "Internal server error" });
  }
});


router.post("/logout", (req, res) => {
  res.send({ message: "Successfully logged out" });
});

module.exports = router;