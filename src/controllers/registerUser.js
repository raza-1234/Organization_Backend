const bcrypt = require("bcrypt");
const { User, Organization } = require("../sequelized/models");
const { findUserByEmail } = require("../utils/findUser");

const registerUser = async (req, res) => {
  try {
    const { userName, email, role, password, confirmPassword, organizationName } = req.body;
    
    if (!(userName?.trim() && email?.trim() && password?.trim() && role?.trim() && confirmPassword?.trim() && organizationName?.trim())){
      return res.status(400).json(
        {"message": "All fields are required."}
      );
    }

    if (password !== confirmPassword){
      return res.status(400).json(
        {"message": "passoword and confirm-password should be same."}
      );
    }
  
    const userExist = await findUserByEmail(email);

    if (userExist){
      return res.status(409).json(
        {"message": `${userExist.email} is already registered.`}
      );
    }
  
    const encryptedPassword = await bcrypt.hash(password, 10);
  
    const newUser = {
      userName,
      email,
      password: encryptedPassword,
      role: role.toLowerCase(),
      rights: `${organizationName} organization`
    }

    const organizationExist = await Organization.findOne({
      where: { 
        organizationName 
      }
    });

    if (organizationExist && newUser.role === "user"){
      const registerUser = await User.create({ 
        ...newUser,
        organizationId: organizationExist.id,
        rights: "read only"
      });

      return res.status(200).json(
      {
        "message": "User Registered Sucessfully.", 
        registerUser
      });
    } else if (!organizationExist && newUser.role === "user"){
      return res.status(404).json(
        {"message": `${organizationName} organization not exist.`}
      );
    } else if (organizationExist && newUser.role !== "user"){
      return res.status(409).json(
        {"message": `${organizationName} organization is already created.`}
      );
    }

    const newOrganization = await Organization.create({ organizationName });

    if (newOrganization){
      const registerUser = await User.create(
      { 
        ...newUser, 
        organizationId: newOrganization.id 
      });
      return res.status(200).json(
      {
        "messager": "user created successfully", 
        registerUser
      });
    }
  }
  catch (err){
    console.log("Register: Internal server error.", err); 
    res.status(500).json(err);
  }  
}

module.exports = { registerUser };
