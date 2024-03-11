const Express = require("express");
const passport = require("passport");
const route = Express.Router();

const { logIn } = require("../controllers/login");

route.post("/", passport.authenticate('local'), logIn);

module.exports = route;