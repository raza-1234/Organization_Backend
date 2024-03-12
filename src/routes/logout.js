const Express = require("express");
const route = Express.Router();
const { logout } = require("../controllers/logout");

route.get("/", logout);

module.exports = route;