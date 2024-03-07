const Express = require("express");
const Session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const { checkSession } =require("./src/middleware/checkSession");
const regiterRoute = require("./src/routes/register");
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

app.use("/register", regiterRoute);
app.use("/login", logInRoute);

//dashboard api is just to test the successfully login.
app.get("/dashboard", checkSession, (req, res) => {
  console.log("request", req.sessionID);
  return res.status(200).json({"message": `welcome to dashboard ${req.session.userId}`});
});
app.use("/logout", logoutRoute);

app.listen(port, async () => {
  await sequelize.authenticate();
  console.log(`server is running on port ${port}`);
});