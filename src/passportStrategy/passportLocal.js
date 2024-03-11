const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const { findUserByEmail } = require("../utils/findUser");

passport.use(new LocalStrategy(
    {usernameField: "email"},
    async (email, password, done) => {
      const userExist = await findUserByEmail(email);

      if (!userExist){
        return done(null, false, { "message": "Incorrect username"});
      }

      const isMatch = await bcrypt.compare(password, userExist.password);

      if (!isMatch){
        return done(null, false, { "message": "Incorrect password"});
      }

      return done(null, {...userExist.dataValues, password: undefined});
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  done(null, id)
});