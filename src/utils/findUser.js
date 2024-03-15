const { User } = require("../sequelized/models");

const findUserByEmail = async (email) => {
  try {
    const userExist = await User.findOne({ 
      where: { 
        email
      } 
    });
    
    if (!userExist){
      return false;
    }
    return userExist;
  } catch (err){
    throw new Error("Find User: Something went wrong.", err);
  }
}

module.exports = { findUserByEmail };