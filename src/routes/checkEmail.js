const Express = require("express");
const route = Express.Router();
const { checkEmail } = require("../controllers/checkEmail");
const passport = require("passport");

route.post("/", (req, res, next) => {
  const authenticateMiddleware = passport.authenticate('emailStrategy', (err, {}, info) => {
    if (err){
      return res.status(500).json({ message: 'Internal server error' });
    }
    if (info.message === "Email does not exist."){
      return res.status(401).json({ message: info.message });
    }
    if (info.message === "Email found successfully."){
      checkEmail(req, res);
    }
  });
  authenticateMiddleware(req, res, next);
});

module.exports = route;