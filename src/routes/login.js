const Express = require("express");
const route = Express.Router();
const { logIn } = require("../controllers/login");

route.post("/", logIn);

module.exports = route;