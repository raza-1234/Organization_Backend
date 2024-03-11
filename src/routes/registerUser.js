const Express = require("express");
const route = Express.Router();
const { registerUser } = require("../controllers/registerUser");

route.post("/", registerUser);

module.exports = route;