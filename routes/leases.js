const router = require("express").Router();
const controller = require("../controllers/leases.controller");
const verifyRole = require("../middleware/verifyRole");
const { verifyToken } = require("../middleware/verifyToken");

/**
 * @swagger
 * tags:
 *   name: Leases
 *   description: Lease management
 */

/**
 * @swagger
 * /CreateLease:
 *   post:
 *     summary: Create a new lease
 *     tags: [Leases]
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
 *               lease_start_date:
 *                 type: string
 *                 format: date-time
 *               lease_end_date:
 *                 type: string
 *                 format: date-time
 *               rent_amount:
 *                 type: number
 *               first_payment_amount:
 *                 type: number
 *               guarantee_amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Lease created successfully
 *       409:
 *         description: Property already has an active lease or pending lease
 *       500:
 *         description: Unexpected error
 */
router.post(
  "/CreateLease",
  [verifyToken, verifyRole.isLandlord],
  controller.create
);

/**
 * @swagger
 * /StartLease:
 *   post:
 *     summary: Start a lease
 *     tags: [Leases]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               access_code:
 *                 type: string
 *     responses:
 *       200:
 *         description: Lease successfully started
 *       409:
 *         description: No lease found or lease already started
 *       500:
 *         description: Unexpected error
 */
router.post("/StartLease", [verifyToken], controller.start);

/**
 * @swagger
 * /RenewLease:
 *   post:
 *     summary: Renew an existing lease
 *     tags: [Leases]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lease_id:
 *                 type: integer
 *               lease_start_date:
 *                 type: string
 *                 format: date-time
 *               lease_end_date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Lease successfully renewed
 *       404:
 *         description: No lease found
 *       409:
 *         description: Invalid start or end date
 *       500:
 *         description: Unexpected error
 */
router.post(
  "/RenewLease",
  [verifyToken, verifyRole.isLandlord],
  controller.renew
);

/**
 * @swagger
 * /UpdateRentAmount:
 *   patch:
 *     summary: Update the rent amount for a lease
 *     tags: [Leases]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lease_id:
 *                 type: integer
 *               rent_amount:
 *                 type: number
 *               start_date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Rent amount updated successfully
 *       409:
 *         description: No lease found or unexpected error
 *       500:
 *         description: Unexpected error
 */
router.patch(
  "/UpdateRentAmount",
  [verifyToken, verifyRole.isLandlord],
  controller.updateRentAmount
);

/**
 * @swagger
 * /StopLease:
 *   post:
 *     summary: Stop an active lease
 *     tags: [Leases]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lease_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Lease stopped successfully
 *       401:
 *         description: Unauthorized action
 *       409:
 *         description: Lease not found or unexpected error
 */
router.post(
  "/StopLease",
  [verifyToken, verifyRole.isLandlord],
  controller.stop
);

module.exports = router;
