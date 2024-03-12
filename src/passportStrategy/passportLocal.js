const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");
const { User } = require("../sequelized/models");

const { findUserByEmail } = require("../utils/findUser");

const authenticateUser = async (email, password, done) => {
  try {
    const userExist = await findUserByEmail(email);

    if (!userExist){
      return done(null, false, { "message": "Incorrect username"});
    }

    const isMatch = await bcrypt.compare(password, userExist.password);

    if (!isMatch){
      return done(null, false, { "message": "Incorrect password"});
    }

    return done(null, {...userExist.dataValues, password: undefined});
  } catch (err){
    throw new Error("error occured at passport strategy", err)
  }
}

const strategy = new LocalStrategy({usernameField: "email"}, authenticateUser);

passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser( async (id, done) => { //have to discuss this
  try {
    const user = await User.findOne({where: {id}});
    done(null, user);
  } catch (err){
    throw new Error("error occured at deserializeUser", err);
  }
});