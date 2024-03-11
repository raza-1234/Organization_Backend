const Express = require("express");
const Session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const passport = require("passport");

const { checkSession } =require("./src/middleware/checkSession");
const regiterRoute = require("./src/routes/registerUser");
const regiterSuperAdminRoute = require("./src/routes/superAdminRegister");
const logInRoute = require("./src/routes/login");
const logoutRoute = require("./src/routes/logout");

const { sequelize } = require("./src/sequelized/models");

require("dotenv").config();

const app = Express();
const port = process.env.PORT;
const secret_key = process.env.SESSION_SECRET_KEY;
const session_life = 1000 * 60 * 60 * 24;

app.use(Express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: "http://localhost:3000"}));

app.use(Session({
  name: "session_id",
  resave: false,
  saveUninitialized: false,
  secret: secret_key,
  cookie: {
    path: "/",
    domain: "localhost",
    httpOnly: "true",
    secure: false,
    originalMaxAge: session_life
  }
}));

app.use(passport.initialize());
app.use(passport.session());
require("./src/passportStrategy/passportLocal");

app.use("/register-new-user", regiterRoute);
app.use("/register-super-admin", regiterSuperAdminRoute);
app.use("/login", logInRoute);

//dashboard api is just to test the successfully login.
app.get("/dashboard", checkSession, (req, res) => {
  console.log("request", req.sessionID);
  console.log("req.userrrrr>>>>>", req.user);
  return res.status(200).json({"message": `welcome to dashboard ${req.session.passport.user}`});
});
app.use("/logout", logoutRoute);

app.listen(port, async () => {
  await sequelize.authenticate();
  console.log(`server is running on port ${port}`);
});