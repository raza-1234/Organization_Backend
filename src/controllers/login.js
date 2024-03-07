const bcrypt = require("bcrypt");

const { findUserByEmail } = require("../utils/findUser");

const logIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!(email?.trim() && password?.trim())){
      return res.status(400).json({"message": "All fields are required."});
    }
  
    const userExist = await findUserByEmail(email);

    if (!userExist){
      return res.status(404).json({"message": "user does not exist"});
    }
  
    const isMatch = await bcrypt.compare(password, userExist.password);

    if (!isMatch){
      return res.status(404).json({"message": "wrong password"});
    };

    req.session.userId = userExist.id;
    return res.status(200).json({"message": "successfully login", userExist, sessionId: req.sessionID});
  }
  catch (err){
    console.log("error at register api", err);
    res.status(500).json(err);
  }  
}

module.exports = { logIn };