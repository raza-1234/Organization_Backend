const logIn = (req, res) => {
  const { sessionID, user } = req;

  return res.status(200).json({"message": "successfully login", user, sessionId: sessionID});
}

module.exports = { logIn };