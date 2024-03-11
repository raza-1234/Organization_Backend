const bcrypt = require("bcrypt");
const { User } = require("../sequelized/models");
const { findUserByEmail } = require("../utils/findUser");

const registerSuperAdmin = async (req, res) => {
  try {
    const { userName, email, role, password, confirmPassword } = req.body;
    
    if (!(userName?.trim() && email?.trim() && password?.trim() && role?.trim() && confirmPassword?.trim())){
      return res.status(400).json({"message": "All fields are required."});
    }

    if (password !== confirmPassword){
      return res.status(400).json({"message": "passoword and confirm-password should be same."});
    }
  
    const userExist = await findUserByEmail(email);

    if (userExist){
      return res.status(409).json({"message": `${userExist.email} is already registered.`});
    }
  
    const encryptedPassword = await bcrypt.hash(password, 10);
  
    const newUser = {
      userName,
      email,
      password: encryptedPassword,
      role: role.toLowerCase(),
      rights: "administration",
    }
  
    const registerUser = await User.create(newUser);
    return res.status(200).json({"message": "supoer admin registered successfully", registerUser});
  }
  catch (err){
    console.log("error at register super admin", err);
    res.status(500).json(err);
  }  
}

module.exports = { registerSuperAdmin };