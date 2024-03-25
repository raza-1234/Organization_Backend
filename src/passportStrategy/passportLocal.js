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

    return done(null, {...userExist?.dataValues, password: undefined, createdAt: undefined, updatedAt: undefined});
  } catch (err){
    throw new Error("PassportLocal: Something Went Wrong", err)
  }
}
const userVerificationStrategy = new LocalStrategy({usernameField: "email"}, authenticateUser);

const authenticateEmail = async (email, password, done) => {
  try {
    const userExist = await findUserByEmail(email);
    if (!userExist){
      return done(null, false, { "message": "Email does not exist."});
    }
    return done(null, false, { "message": "Email found successfully."});
  } catch (err){
    throw new Error("PassportLocal: Something went wrong while verifing email.");
  }
}
const emailVerificationStrategy = new LocalStrategy({usernameField: "email", passwordField: "email"}, authenticateEmail);

module.exports = { userVerificationStrategy, emailVerificationStrategy };
