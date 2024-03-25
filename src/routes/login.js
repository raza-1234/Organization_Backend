const Express = require("express");
const passport = require("passport");
const route = Express.Router();

const { logIn } = require("../controllers/login");

route.post("/", (req, res, next) => {
  const authenticateMiddleware = passport.authenticate('local', (err, user, info) => {
    if (err){
      return res.status(500).json({ message: 'Internal server error' });
    }
    if (!user){
      return res.status(401).json({ message: info.message });
    }
    req.logIn(user, (err) => {
      if (err){
        return res.status(500).json({ message: 'Internal server error' });
      }
      return logIn(req, res);
    });
  });
  authenticateMiddleware(req, res, next);
});

module.exports = route;