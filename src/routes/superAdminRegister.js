const Express = require("express");
const route = Express.Router();
const { registerSuperAdmin } = require("../controllers/registerSuperAdmin");

route.post("/", registerSuperAdmin);

module.exports = route;