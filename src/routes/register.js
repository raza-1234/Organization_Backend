const Express = require("express");
const route = Express.Router();
const { register } = require("../controllers/register");

route.post("/", register);

module.exports = route;