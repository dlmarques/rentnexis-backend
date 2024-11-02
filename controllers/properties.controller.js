const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const INSERT_PROPERTY_QUERY = require("../utils/queries/InsertProperty");
const errorResponse = require("../utils/responses/error");
const successResponse = require("../utils/responses/success");
const {
  PROPERTY_CREATED_SUCCESSFULLY,
  UNEXPECTED,
  DUPLICATED_PROPERTY,
  SUCCESS,
  NO_PROPERTY_FOUND,
  NO_PROPERTIES_FOUND,
} = require("../utils/constants/responses");
const SELECT_PROPERTY_BY_NAME_AND_USER_ID_QUERY = require("../utils/queries/SelectPropertiesByUserId");
const DELETE_PROPERTY_BY_ID_QUERY = require("../utils/queries/DeletePropertyById");
const UPDATE_PROPERTY_BY_ID_QUERY = require("../utils/queries/UpdatePropertyById");
const propertiesValidations = require("../validations/propertiesValidations");
const SELECT_PROPERTY_BY_ID_AND_USER_ID_QUERY = require("../utils/queries/SelectPropertyByIdAndUserId");
const SELECT_ALL_PROPERTIES_BY_ID_QUERY = require("../utils/queries/SelectAllPropertiesById");

exports.create = async (req, res) => {
  const _token = req.headers["x-access-token"];

  //get id from token
  const id = jwt.decode(_token).id;

  //get data from request body
  const {
    property_name,
    address,
    description,
    rooms,
    bathrooms,
    amenities,
    rules,
  } = req.body;

  //validate data model
  const { error } = propertiesValidations.createPropertyValidation({
    property_name,
    address,
    description,
    rooms,
    bathrooms,
    amenities,
    rules,
    owner_id: id,
  });

  if (error) return res.status(500).send(errorResponse(error));

  // select property by property_name and owner_id
  const selectResult = await pool.query(
    SELECT_PROPERTY_BY_NAME_AND_USER_ID_QUERY,
    [property_name, id]
  );

  // if any property was returned throw an error
  if (selectResult.rowCount > 0)
    return res.status(409).send(errorResponse(DUPLICATED_PROPERTY));

  //insert property
  const insertResult = await pool.query(INSERT_PROPERTY_QUERY, [
    property_name,
    address,
    description,
    rooms,
    bathrooms,
    amenities,
    rules,
    id,
  ]);

  if (insertResult.rowCount > 0)
    return res.status(200).send(successResponse(PROPERTY_CREATED_SUCCESSFULLY));

  return res.status(500).send(errorResponse(UNEXPECTED));
};

exports.getAllProperties = async (req, res) => {
  const _token = req.headers["x-access-token"];

  const id = jwt.decode(_token).id;
  try {
    const result = await pool.query(SELECT_ALL_PROPERTIES_BY_ID_QUERY, [id]);

    if (result.rowCount > 0)
      return res.status(200).send(successResponse(SUCCESS, result.rows));

    return res.status(200).send(errorResponse(NO_PROPERTIES_FOUND));
  } catch (error) {
    res.status(500).send(errorResponse(UNEXPECTED));
  }
};

exports.getPropertyById = async (req, res) => {
  const _token = req.headers["x-access-token"];

  const id = jwt.decode(_token).id;

  const { property_id } = req.body;

  try {
    const result = await pool.query(SELECT_PROPERTY_BY_ID_AND_USER_ID_QUERY, [
      property_id,
      id,
    ]);

    if (result.rowCount > 0)
      return res.status(200).send(successResponse(SUCCESS, result.rows[0]));

    return res.status(200).send(errorResponse(NO_PROPERTY_FOUND));
  } catch (error) {
    res.status(500).send(errorResponse(UNEXPECTED));
  }
};

exports.deleteProperty = async (req, res) => {
  const _token = req.headers["x-access-token"];

  const id = jwt.decode(_token).id;

  const { property_id } = req.body;

  try {
    const result = await pool.query(DELETE_PROPERTY_BY_ID_QUERY, [
      property_id,
      id,
    ]);

    if (result.rowCount > 0)
      return res.status(200).send(successResponse(SUCCESS, result.rows[0]));

    return res.status(200).send(errorResponse(NO_PROPERTY_FOUND));
  } catch (error) {
    res.status(500).send(errorResponse(UNEXPECTED));
  }
};

exports.updateProperty = async (req, res) => {
  const _token = req.headers["x-access-token"];

  //get id from token
  const id = jwt.decode(_token).id;

  //get data from request body
  const {
    property_name,
    address,
    description,
    rooms,
    bathrooms,
    amenities,
    rules,
  } = req.body;

  //validate data model
  const { error } = propertiesValidations.updatePropertyValidation({
    property_name,
    address,
    description,
    rooms,
    bathrooms,
    amenities,
    rules,
    owner_id: id,
  });

  if (error) return res.status(500).send(errorResponse(error));

  //update property
  const updateResult = await pool.query(UPDATE_PROPERTY_BY_ID_QUERY, [
    property_name,
    address,
    description,
    rooms,
    bathrooms,
    amenities,
    rules,
    id,
  ]);

  if (updateResult.rowCount > 0)
    return res.status(200).send(successResponse(PROPERTY_CREATED_SUCCESSFULLY));

  return res.status(500).send(errorResponse(UNEXPECTED));
};
