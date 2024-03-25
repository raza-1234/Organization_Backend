const userDetail = (req, res) => {
  const { user } = req;

  return res.status(200).json(
    { user }
  )
}

module.exports = { userDetail };