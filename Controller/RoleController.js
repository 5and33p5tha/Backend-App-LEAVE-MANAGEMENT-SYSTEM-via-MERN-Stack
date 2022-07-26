//THIRD PARTY
const Joi = require("joi");
const _ = require("lodash");

//ROLE MODULE
const Role = require("../model/Role");

//TO GET ALL ROLES
module.exports.getAll = async (req, res) => {
  const roles = await Role.find();
  if (roles.length > 0) {
    //If Roles Exists
    return res.json({ status: true, roles }); //i.e Return the role
  }
  //If no role found
  return res.status(404).json({ status: false, msg: "Role not found" });
};

//TO GET ROLES BY ID
module.exports.getOne = async (req, res) => {
  const role = await Role.findById(req.params.id);
  if (role) {
    //If Role found
    return res.json({ status: true, role });
  }
  //If role not found
  return res.status(404).json({ status: false, msg: "Role not found" });
};

//TO ADD NEW ROLE
module.exports.addNew = async (req, res) => {
  const { error } = addRoleDataValidation(req.body);
  const role = await Role.create(_.pick(req.body, ["role"])); //_.pick is a function via lodash
  //_.pick mechanism?
  //Filter from req.body (Object) and returns only selected field i.e "role" as an object
  return res.json({
    status: true,
    msg: "New Role Created Successfully",
    role: _.pick(role, ["role"]),
  });
};

//TO UPDATE ROLE VIA ROLE-ID
module.exports.updateExisting = async (req, res) => {
  const role = await Role.findByIdAndUpdate(req.params.id, req.body);
  if (!role)
    //Single Line so no need to use {}
    return res.status(404).json({ status: false, msg: "Role not found" });
  return res.json({ status: true, msg: "Role Updated Successfully", role });
};

//TO DELETE ROLE BY ID
module.exports.deleteExisting = async (req, res) => {
  const role = await Role.findByIdAndDelete(req.params.id);
  if (!role)
    return res.status(404).json({ status: false, msg: "Role not found" });
  return res.json({ status: true, msg: "Role Deleted Successfully", role });
};

//JOI VALIDATION FOR ADD NEW ROLE
const addRoleDataValidation = (datas) => {
  const schema = Joi.object({
    role: Joi.string().required(),
  });

  return schema.validate(datas);
};
