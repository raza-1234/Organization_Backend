const checkEmail = (req, res) => {

  return res.status(200).json(
    {
      "message": " Email found successfully."
    }
  );
  
}

module.exports = { checkEmail };