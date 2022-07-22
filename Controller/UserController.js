//THIRD  PARTY
const Joi = require("joi");
const _ = require("lodash");
require("express-async-errors");

//USER MODULE
const User = require("../model/User");

//TO GET ALL USERS
module.exports.getAll = async (req, res) => {
  // console.log("user");
  const users = await User.find();
  if (users.length > 0) return res.json({ status: true, users });
  return res.status(404).json({ status: false, msg: "No Users found" });
};

//TO GET USER BY USER ID
module.exports.getOne = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) return res.json({ status: true, user });
  return res.status(404).json({ status: false, msg: "No such User found" });
};

//TO ADD NEW USER
module.exports.addNew = async (req, res) => {
  // try{
  const { error } = userDataValidation(req.body);
  //JOI VALIDATES ONE AT A TIME
  //HENCE, IF WE DO:
  // return res.status(400).json({ status: false , msg: error.message }); -> ONE ERROR at a time

  if (error) {
    // return res.status(400).json({ status: false , msg: error.message });
    return res.status(400).json({ status: false, msg: error });
  }
  const user = await User.create(
    _.pick(req.body, [
      "fullName",
      "address",
      "phone",
      "email",
      "password",
      "gender",
      "dob",
    ])
  );
  return res.json({ status: true, msg: "New user created successfully", user });
  // }
  // catch(error){
  // res.status(400).json({ status: false, msg: error });
  // }
};

//TO UPDATE USER BY USER_ID
module.exports.updateExisting = async (req, res) => {
  //NOTE, FOR ERROR MESSAGE HANDLING, MUST HAVE TRY CATCH OR CAN USE A PACKAGE CALLED EXPRESS-ASYNC-ERRORS
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ status: false, msg: "No such User found" });
    user.set(req.body);
    await user.save();
    return res.json({ status: true, msg: "User updated successfully", user });
  } catch (error) {
    res.status(400).json({ status: false, msg: error });
  }
};

//TO DELETE USER BY USER_ID
module.exports.deleteExisting = async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);
  if (!user)
    return res.status(400).json({ status: false, msg: "No such User found" });
  return res.json({ status: true, msg: "User deleted successfully" });
};

const userDataValidation = (datas) => {
  const schema = Joi.object({
    fullName: Joi.string().required(),
    address: Joi.string().required(),
    phone: Joi.number().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    gender: Joi.string().required(),
    dob: Joi.string().required(),
  });

  return schema.validate(datas);
};
