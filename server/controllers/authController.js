const express = require("express");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

// 1. REGISTER endpoint
const signup = async (req, res) => {
  try {
    const { email, password, firstname, lastname } = req.body;
    if (!(email && password && firstname && lastname)) {
      res.status(400).send("Fill in all required fields");
    }
    const isUser = await User.findOne({
      email,
    });
    if (isUser) {
      return res.status(400).send("User already exists");
    }

    // const salt = await bcrypt.genSalt(10);
    // const newPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      firstname,
      lastname,
      email,
      password,
      // password: newPassword,
      following: [],
      donations: [],
      attending: [],
    });

    // console.log("Salt is:", user.password);
    await user.save();

    // Generate and send token to user
    const token = jwt.sign(
      {
        id: user._id,
        email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "3d",
      }
    );
    res.status(201).json({ user, token });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Error in saving");
  }
};

// 2. LOGIN endpoint
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // const salt = await bcrypt.genSalt(10);
    // const newPassword = await bcrypt.hash(password, salt);
    // console.log(email, password, newPassword);
    if (!(email && password)) {
      res.status(400).send("Email and password are required");
    }
    let user = await User.findOne({ email, password })
      .populate("attending")
      .populate("donations");
    console.log(user.password);
    // const isValid = await bcrypt.compare(password, user.password);
    // console.log(isValid);
    // if (!isValid) {
    //   res.status(400).json({ msg: "Invalid password" });
    //   return;
    // }
    if (!user)
      return res.status(400).json({
        message: "User does not exist. Email or password incorrect",
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// 3. LOGOUT endpoint
const logout = (req, res) => {
  try {
    res.clearCookie("jwt");
    res.json({ message: "Logout successful" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Logout failed", err });
  }
};

module.exports = { signup, login, logout };
