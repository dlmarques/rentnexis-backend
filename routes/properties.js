const router = require("express").Router();
const { verifyToken } = require("../middleware");
const controller = require("../controllers/properties.controller");
const verifyRole = require("../middleware/verifyRole");

/**
 * @swagger
 * tags:
 *   name: Properties
 *   description: Property management for landlords
 */

/**
 * @swagger
 * /CreateProperty:
 *   post:
 *     summary: Create a new property
 *     tags: [Properties]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               property_name:
 *                 type: string
 *               address:
 *                 type: string
 *               description:
 *                 type: string
 *               rooms:
 *                 type: integer
 *               bathrooms:
 *                 type: integer
 *               amenities:
 *                 type: array
 *                 items:
 *                   type: string
 *               rules:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Property created successfully
 *       409:
 *         description: Duplicate property
 *       500:
 *         description: Unexpected error
 */
router.post(
  "/CreateProperty",
  [verifyToken, verifyRole.isLandlord],
  controller.create
);

/**
 * @swagger
 * /GetAllProperties:
 *   get:
 *     summary: Retrieve all properties of the landlord
 *     tags: [Properties]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all properties retrieved successfully
 *       500:
 *         description: Unexpected error
 */
router.get(
  "/GetAllProperties",
  [verifyToken, verifyRole.isLandlord],
  controller.getAllProperties
);

/**
 * @swagger
 * /GetPropertyById:
 *   post:
 *     summary: Get details of a specific property by ID
 *     tags: [Properties]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               property_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Property details retrieved successfully
 *       404:
 *         description: Property not found
 *       500:
 *         description: Unexpected error
 */
router.post(
  "/GetPropertyById",
  [verifyToken, verifyRole.isLandlord],
  controller.getPropertyById
);

/**
 * @swagger
 * /DeleteProperty:
 *   delete:
 *     summary: Delete a specific property
 *     tags: [Properties]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               property_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Property deleted successfully
 *       404:
 *         description: Property not found
 *       500:
 *         description: Unexpected error
 */
router.delete(
  "/DeleteProperty",
  [verifyToken, verifyRole.isLandlord],
  controller.deleteProperty
);

/**
 * @swagger
 * /UpdateProperty:
 *   patch:
 *     summary: Update details of an existing property
 *     tags: [Properties]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               property_name:
 *                 type: string
 *               address:
 *                 type: string
 *               description:
 *                 type: string
 *               rooms:
 *                 type: integer
 *               bathrooms:
 *                 type: integer
 *               amenities:
 *                 type: array
 *                 items:
 *                   type: string
 *               rules:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Property updated successfully
 *       500:
 *         description: Unexpected error
 */
router.patch(
  "/UpdateProperty",
  [verifyToken, verifyRole.isLandlord],
  controller.updateProperty
);

module.exports = router;
