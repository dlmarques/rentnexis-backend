const authValidations = require("../validations/authValidations");

const verifySignUpDataModel = async (req, res, next) => {
  const { error } = authValidations.signUpValidation(req.body);
  if (error) return res.json(400).send(error.details[0].message);

  next();
};

const verifySignInDataModel = async (req, res, next) => {
  const { error } = authValidations.signInValidation(req.body);
  if (error) return res.json(400).send(error.details[0].message);

  next();
};

const verifyDataModel = {
  verifySignUpDataModel: verifySignUpDataModel,
  verifySignInDataModel: verifySignInDataModel,
};

module.exports = verifyDataModel;
