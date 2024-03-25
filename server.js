const Express = require("express");
const Session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const passport = require("passport");

const { checkSession } =require("./src/middleware/checkSession");
const registerRoute = require("./src/routes/registerUser");
const registerSuperAdminRoute = require("./src/routes/superAdminRegister");
const logInRoute = require("./src/routes/login");
const logoutRoute = require("./src/routes/logout");
const documentRoute = require("./src/routes/document");
const assetRoute = require("./src/routes/assets");
const checkEmailRoute = require("./src/routes/checkEmail");
const userDetailRoute = require("./src/routes/userDetails");
const { userVerificationStrategy, emailVerificationStrategy } = require("./src/passportStrategy/passportLocal");

const { sequelize, User } = require("./src/sequelized/models");

require("dotenv").config();

const app = Express();
const port = process.env.PORT;
const secret_key = process.env.SESSION_SECRET_KEY;
const session_life = 1000 * 60 * 60 * 24;

app.use(Express.json());
app.use(cookieParser());
app.use(cors({credentials: true, origin: "http://localhost:3000"}));

app.use(Session({
  name: "session_id",
  resave: false,
  saveUninitialized: false,
  secret: secret_key,
  cookie: {
    path: "/",
    domain: "localhost",
    httpOnly: false,
    secure: false,
    originalMaxAge: session_life
  }
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(userVerificationStrategy);
passport.use("emailStrategy", emailVerificationStrategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findOne({
      where: {
        id
      }
    });
    done(null, {...user.dataValues, password: undefined, createdAt: undefined, updatedAt: undefined});
  } catch (err){
    console.log("DeserializeUser: Some Error Occured.", err);
    throw new Error("Some Error Occured.")
  } 
});

app.use("/check-email", checkEmailRoute);
app.use("/user", userDetailRoute);
app.use("/register-super-admin", registerSuperAdminRoute);
app.use("/register", registerRoute);
app.use("/login", logInRoute);
app.use("/logout", logoutRoute);
app.use("/document", checkSession, documentRoute);
app.use("/assets", checkSession, assetRoute);

app.listen(port, async () => {
  await sequelize.authenticate();
  console.log(`server is running on port ${port}`);
});