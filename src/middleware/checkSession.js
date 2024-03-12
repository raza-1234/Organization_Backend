const checkSession = (req, res, next) => {
  const user = req.session?.passport?.user;
  
  if (!user){
    return res.status(401).json(
      {"message": "You are not logged in"}
    );
  }
  next();
}

module.exports = { checkSession };