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
const SELECT_LEASE_BY_PROPERTY_ID_QUERY = require("../utils/queries/SelectLeaseByPropertyId");
const LEASE_STATUS = require("../utils/constants/leaseStatus");

exports.create = async (req, res) => {
  console.log("body", req.body);
  const _token = req.headers["authorization"]?.replace("Bearer ", "");

  //get id from token
  const id = jwt.decode(_token).sub;

  //get data from request body
  const {
    propertyName,
    address,
    description,
    rooms,
    bathrooms,
    amenities,
    rules,
  } = req.body;

  //validate data model
  const { error } = propertiesValidations.createPropertyValidation({
    propertyName,
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
    [propertyName, id]
  );

  // if any property was returned throw an error
  if (selectResult.rowCount > 0)
    return res.status(409).send(errorResponse(DUPLICATED_PROPERTY));

  //insert property
  const insertResult = await pool.query(INSERT_PROPERTY_QUERY, [
    propertyName,
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
  const _token = req.headers["authorization"]?.replace("Bearer ", "");
  const id = jwt.decode(_token).sub;
  try {
    const result = await pool.query(SELECT_ALL_PROPERTIES_BY_ID_QUERY, [id]);

    const allProperties = result.rows.map(async (property) => {
      const leaseResult = await pool.query(SELECT_LEASE_BY_PROPERTY_ID_QUERY, [
        property.property_id,
      ]);
      if (leaseResult.rowCount < 1)
        return {
          propertyId: property.property_id,
          propertyName: property.property_name,
          status: {
            type: LEASE_STATUS.LEASE_STATUS_TYPE.false,
            key: LEASE_STATUS.LEASE_STATUS_KEY.false,
          },
          address: property.address,
          description: property.description,
          rooms: property.rooms,
          bathrooms: property.bathrooms,
          ameneties: property.ameneties,
          rules: property.rules,
          ownerId: property.owner_id,
        };

      return {
        propertyId: property.property_id,
        propertyName: property.property_name,
        status: {
          type: LEASE_STATUS.LEASE_STATUS_TYPE[leaseResult.rows[0].is_active],
          key: LEASE_STATUS.LEASE_STATUS_KEY[leaseResult.rows[0].is_active],
        },
        address: property.address,
        description: property.description,
        rooms: property.rooms,
        bathrooms: property.bathrooms,
        ameneties: property.ameneties,
        rules: property.rules,
        ownerId: property.owner_id,
      };
    });

    if (result.rowCount > 0)
      return res.status(200).send(successResponse(SUCCESS, allProperties));

    return res.status(200).send(errorResponse(NO_PROPERTIES_FOUND));
  } catch (error) {
    res.status(500).send(errorResponse(UNEXPECTED));
  }
};

exports.getPropertyById = async (req, res) => {
  const _token = req.headers["authorization"]?.replace("Bearer ", "");

  const id = jwt.decode(_token).sub;

  const { propertyId } = req.body;

  try {
    const result = await pool.query(SELECT_PROPERTY_BY_ID_AND_USER_ID_QUERY, [
      propertyId,
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
  const _token = req.headers["authorization"]?.replace("Bearer ", "");

  const id = jwt.decode(_token).sub;

  const { propertyId } = req.body;

  try {
    const result = await pool.query(DELETE_PROPERTY_BY_ID_QUERY, [
      propertyId,
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
  const _token = req.headers["authorization"]?.replace("Bearer ", "");

  //get id from token
  const id = jwt.decode(_token).sub;

  //get data from request body
  const {
    propertyName,
    address,
    description,
    rooms,
    bathrooms,
    amenities,
    rules,
  } = req.body;

  //validate data model
  const { error } = propertiesValidations.updatePropertyValidation({
    propertyName,
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
    propertyName,
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
