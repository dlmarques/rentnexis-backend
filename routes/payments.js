const router = require("express").Router();
const controller = require("../controllers/payments.controller");

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment management for leases
 */

/**
 * @swagger
 * /PayRent:
 *   post:
 *     summary: Pay rent for a specific payment
 *     tags: [Payments]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentId:
 *                 type: integer
 *               amount:
 *                 type: number
 *               paymentMethod:
 *                 type: string
 *     responses:
 *       200:
 *         description: Rent paid successfully
 *       409:
 *         description: Unexpected error or payment mismatch
 *       500:
 *         description: No payment found or incorrect amount
 */
router.post("/PayRent", controller.pay);

/**
 * @swagger
 * /GetAllPaymentsByLeaseId:
 *   post:
 *     summary: Get all payments for a specific lease
 *     tags: [Payments]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               leaseId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: List of all payments retrieved successfully
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: No lease or payments found
 */
router.post("/GetAllPaymentsByLeaseId", controller.getAllPaymentsByLease);

/**
 * @swagger
 * /GetUnpaidPaymentsByLeaseId:
 *   post:
 *     summary: Get all unpaid payments for a specific lease
 *     tags: [Payments]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               leaseId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: List of unpaid payments retrieved successfully
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: No lease or unpaid payments found
 */
router.post("/GetUnpaidPaymentsByLeaseId", controller.getUnpaidPaymentsByLease);

/**
 * @swagger
 * /GetPaidPaymentsByLeaseId:
 *   post:
 *     summary: Get all paid payments for a specific lease
 *     tags: [Payments]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               leaseId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: List of paid payments retrieved successfully
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: No lease or paid payments found
 */
router.post("/GetPaidPaymentsByLeaseId", controller.getPaidPaymentsByLease);

/**
 * @swagger
 * /getNextPaymentByLeaseId:
 *   post:
 *     summary: Get the next unpaid payment for a specific lease
 *     tags: [Payments]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               leaseId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Next unpaid payment retrieved successfully
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: No lease or unpaid payments found
 */
router.post("/GetNextPaymentByLeaseId", controller.getNextPaymentByLease);

module.exports = router;
