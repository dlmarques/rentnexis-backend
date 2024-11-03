const Joi = require("joi");

const createPropertyValidation = (data) => {
  const schema = Joi.object({
    property_name: Joi.string().required().max(255),
    address: Joi.string().required().max(255),
    description: Joi.string().required(),
    rooms: Joi.number().required(),
    bathrooms: Joi.number().required(),
    amenities: Joi.array().items(Joi.string()).required(),
    rules: Joi.array().items(Joi.string()).required(),
    owner_id: Joi.string().uuid().required(),
  });
  return schema.validate(data);
};

const updatePropertyValidation = (data) => {
  const schema = Joi.object({
    property_name: Joi.string().required().max(255),
    address: Joi.string().required().max(255),
    description: Joi.string().required(),
    rooms: Joi.number().required(),
    bathrooms: Joi.number().required(),
    amenities: Joi.array().items(Joi.string()).required(),
    rules: Joi.array().items(Joi.string()).required(),
    owner_id: Joi.string().uuid().required(),
  });
  return schema.validate(data);
};

const propertiesValidations = {
  createPropertyValidation,
  updatePropertyValidation,
};

module.exports = propertiesValidations;
