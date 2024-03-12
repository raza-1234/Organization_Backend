const logIn = (req, res) => {
  const { user } = req;

  return res.status(200).json(
  {
    "message": "successfully login", 
    user
  });
}

module.exports = { logIn };