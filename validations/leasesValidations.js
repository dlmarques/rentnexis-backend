const Joi = require("joi");

const createLeaseValidation = (data) => {
  const schema = Joi.object({
    property_id: Joi.number().required(),
    landlord_id: Joi.string().uuid().required(),
    lease_start_date: Joi.number().required(),
    lease_end_date: Joi.number().required(),
    rent_amount: Joi.number().required(),
    first_payment_amount: Joi.number().required(),
    guarantee_amount: Joi.number().required(),
    is_regularized: Joi.boolean().required(),
    is_active: Joi.boolean().required(),
    access_code: Joi.string().max(6).required(),
  });
  return schema.validate(data);
};

module.exports = createLeaseValidation;
