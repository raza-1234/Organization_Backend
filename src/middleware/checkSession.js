const checkSession = (req, res, next) => {
  const { userId }  = req.session;
  if (!userId) {
    return res.status(401).json({"message": "You are not logged in"});
  }
  next();
}

module.exports = { checkSession }