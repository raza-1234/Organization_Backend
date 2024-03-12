const logIn = (req, res) => {
  const { sessionID, user } = req;

  console.log("sesssionnnnn", req.session);

  return res.status(200).json({"message": "successfully login", user, sessionId: sessionID});
}

module.exports = { logIn };