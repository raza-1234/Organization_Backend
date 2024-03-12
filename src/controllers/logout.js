const logout = (req, res) => {
  if (req.session?.passport?.user){
    req.session.destroy();
    res.clearCookie("session_id", { path: "/"});
    return res.status(200).json(
      {"message": "successfully  logout"}
    );
  }
  return res.status(200).json(
    {"message": "no session exist."}
  );
}

module.exports = { logout };