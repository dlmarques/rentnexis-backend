require("dotenv").config();

const INSERT_PROPERTY_QUERY =
  "INSERT INTO Properties (property_name, address, description, rooms, bathrooms, amenities, rules, owner_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *";

module.exports = INSERT_PROPERTY_QUERY;
