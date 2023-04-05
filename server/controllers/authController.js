// const { response } = require('express');
const express = require('express');
const User = require('../models/userModel');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const cookie = require('cookie');

// 1. REGISTER endpoint
const signup = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    let user = await User.findOne({
      email,
    });
    if (user) {
      return res.status(400).json({
        message: "User already exists",
      });
    }
    user = new User({
      username,
      email,
      password,
      following: [],
      donations: [],
      attended: [],
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      "randomString",
      {
        expiresIn: 10000,
      },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({
          token, user,
        });
      }
    );
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Error in saving");
  }
};

// 2. LOGIN endpoint
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({
      email,
    });
    if (!user)
      return res.status(400).json({
        message: "User does not exist",
      });

    // const isMatch = await bcrypt.compare(password, user.password);
    // if (!isMatch) {
    //   return res.status(400).json({
    //     message: "Incorrect email or password",
    //   });
    // }
    const payload = {
      user: {
        id: user.id,
      },
    };

    const token = jwt.sign(payload, "randomString", { expiresIn: "1h" });
    res.cookie("token", token, {
      httpOnly: true,
    });
    res.status(200).send({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// 3. GETME endpoint
const getMe = async (req, res) => {
  try {
    // request.user is getting fetched from middleware after token authentication
    const user = await User.findById(req.user.id).populate("boards");
    res.json({
      username: user.username,
      boards: user.boards,
    });
  } catch (error) {
    console.log(error);
    res.send({ message: "Error in fetching user" });
  }
};

// 4. LOGOUT endpoint
const logout = ( req, res ) => {
  try {
    // send JWT and then remove 
    res.clearCookie('jwt');
    res.json({ message: 'Logout successful'});  
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Logout failed', err})
  }
}

module.exports = { signup, login, logout, getMe };