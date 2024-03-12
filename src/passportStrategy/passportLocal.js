const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");

const { findUserByEmail } = require("../utils/findUser");

const authenticateUser = async (email, password, done) => {
  try {
    const userExist = await findUserByEmail(email);

    if (!userExist){
      return done(null, false, { "message": "User does not exists."}); 
    }

    const isMatch = await bcrypt.compare(password, userExist.password);

    if (!isMatch){
      return done(null, false, { "message": "Incorrect password"});
    }

    return done(null, {...userExist?.dataValues, password: undefined});
  } catch (err){
    throw new Error("PassportLocal: Something Went Wrong", err)
  }
}

const strategy = new LocalStrategy({usernameField: "email"}, authenticateUser);

module.exports = { strategy };