const Joi = require("joi");

// SignUp Validation
const signUpValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().required().max(255),
    email: Joi.string().required().max(255),
    password: Joi.string().required().min(6).max(255),
    role: Joi.string().required().max(20),
  });
  return schema.validate(data);
};

// SignIn Validation
const signInValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().required().max(255),
    password: Joi.string().required().min(6).max(255),
  });
  return schema.validate(data);
};

const authValidations = {
  signUpValidation: signUpValidation,
  signInValidation: signInValidation,
};

module.exports = authValidations;
