require("dotenv").config();

const UPDATE_PROPERTY_BY_ID_QUERY =
  "UPDATE Properties SET property_name = $1, address = $2, description = $3, rooms = $4, bathrooms = $5, amenities = $6, rules = $7 WHERE property_id = $8 RETURNING *";

module.exports = UPDATE_PROPERTY_BY_ID_QUERY;
