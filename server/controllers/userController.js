import User from "../models/userModel.js";
import mongoose from "mongoose";

// GET user by Id
const getUser = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ err: "No such user with this id" });
  }
  const user = await User.findById(id)
    .populate("attending")
    .populate("donations");
  if (!user) {
    return res.status(404).json({ err: "User doesn't exist" });
  }
  res.status(200).json(user);
};

// GET all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    if (!users) {
      res.status(401).send("Users not found");
    }
    res.status(200).send(users);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
};

// DELETE user
const deleteProfile = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ err: "No such user with this id" });
  }
  const user = await User.findOneAndDelete({ _id: id });
  if (!user) {
    return res.status(404).json({ err: "User doesn't exist" });
  }
  res.status(200).json({ message: "User deleted" });
};

// UPDATE user
const editProfile = async (req, res) => {
  try {
    const { firstname, lastname } = req.body;
    console.log(firstname, lastname, req.params);
    const user = await User.findById({ _id: req.params.id });
    user.firstname = firstname;
    user.lastname = lastname;
    await user.save();
    return res.status(200).send({ message: "Profile updated", user });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Error occurred while updating" });
  }
};

// ADD donation
const addDonation = async (req, res) => {
  try {
    const ngo = req.body.name;
    const ngoId = req.body.id;
    const donation = req.body.donation;
    const user = await User.findById(req.params.id);
    user.donations.push(donation);
    user.ngos.push(ngo);
    await user.save();
    res.status(200).send({ results: user.donations });
  } catch (err) {
    console.log(err);
  }
};

// JOIN event
const addEvent = async (req, res) => {
  try {
    const ngoId = req.body.id;
    const user = await User.findByIdAndUpdate(req.params.id, {
      $addToSet: { attending: ngoId },
    });
    await user.save();
    res.status(200).send({ results: user, message: user.attending });
  } catch (err) {
    console.log("Already registered");
  }
};

// FOLLOW NGO
const follow = async (req, res) => {
  try {
    const newFollow = req.body.follow;
    console.log("New:", newFollow);
    const user = await User.findOne({ _id: req.params.id });
    const ngoExists = user.following.find((ngo) => ngo === newFollow);
    console.log("Exist:", ngoExists);
    if (ngoExists) {
      return res.status(400).send("Already following");
    }
    user.following.push(newFollow);
    await user.save();
    console.log("Followed Orgs: ", user.following);
    return res.status(200).send({ results: user, message: user.following });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Already following" });
  }
};

// UNFOLLOW NGO
const unfollow = async (req, res) => {
  try {
    const remove = req.body.remove;
    const user = await User.findOne({ _id: req.params.id });
    let following = [...user.following];
    console.log(following, user);
    let updatedFollowing = following.filter((ngo) => ngo !== remove);
    console.log(updatedFollowing, remove);
    user.following = updatedFollowing;
    await user.save();
    return res.status(200).send({ message: user });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: err.message });
  }
};

// EDIT goal
const editGoal = async (req, res) => {
  try {
    const goalAmount = req.body.goalAmount;
    const user = await User.findById({ _id: req.params.id });
    user.goalAmount = goalAmount;
    await user.save(); // need token
    return res.status(200).send({ message: "Goal amount updated", goalAmount });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Error occurred while updating" });
  }
};

export {
  getUser,
  getUsers,
  addEvent,
  follow,
  unfollow,
  deleteProfile,
  editProfile,
  editGoal,
  addDonation,
};
