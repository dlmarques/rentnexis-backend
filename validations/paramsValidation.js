const Joi = require("joi");

const paramsValidation = Joi.object({
  id: Joi.string().uuid().required(),
  token: Joi.string().required(),
});

module.exports = paramsValidation;
