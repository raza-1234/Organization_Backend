const Express = require("express");
const Session = require("express-session");

const regiterRoute = require("./src/routes/register");
const logInRoute = require("./src/routes/login");

const { sequelize } = require("./src/sequelized/models");

require("dotenv").config();

const app = Express();
const port = process.env.PORT;
const secret = process.env.SESSION_SECRET_KEY;
const session_life = 1000 * 60 * 60 * 24;

app.use(Express.json());

app.use(Session({
  name: "session_id",
  resave: false,
  saveUninitialized: false,
  secret: secret,
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

app.listen(port, async () => {
  await sequelize.authenticate();
  console.log(`server is running on port ${port}`);
});