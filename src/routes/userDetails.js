const Express = require("express");
const route = Express.Router();
const { checkSession } = require("../middleware/checkSession");
const { userDetail } = require("../controllers/userDetail");

route.get("/", checkSession, userDetail);

module.exports = route;