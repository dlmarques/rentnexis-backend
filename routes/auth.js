const router = require("express").Router();
const {
  checkDuplicateUsernameOrEmail,
  verifyDataModel,
} = require("../middleware");
const controller = require("../controllers/auth.controller");

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Authentication and authorization
 */

/**
 * @swagger
 * /Signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
router.post(
  "/Signup",
  [checkDuplicateUsernameOrEmail, verifyDataModel.verifySignUpDataModel],
  controller.signup
);

/**
 * @swagger
 * /Signin:
 *   post:
 *     summary: Log in an existing user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/Signin",
  [verifyDataModel.verifySignInDataModel],
  controller.signin
);

/**
 * @swagger
 * /RefreshToken:
 *   post:
 *     summary: Refresh access token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: The refresh token
 *     responses:
 *       200:
 *         description: Access token refreshed
 *       403:
 *         description: Refresh token is missing or expired
 */
router.post("/RefreshToken", controller.refreshToken);

/**
 * @swagger
 * /verify/{id}/{token}:
 *   get:
 *     summary: Verify a user's email
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Verification token
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid link or token
 */
router.get("/verify/:id/:token", controller.verifyUser);

/**
 * @swagger
 * /RecoveryPassword:
 *   post:
 *     summary: Request a password recovery email
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email
 *     responses:
 *       200:
 *         description: Password recovery email sent if user exists
 *       500:
 *         description: Internal server error
 */
router.post("/RecoveryPassword", controller.recoveryPassword);

/**
 * @swagger
 * /VerifyRecoveryPassword:
 *   post:
 *     summary: Verify the recovery token for password reset
 *     tags: [Authentication]
 *     parameters:
 *       - in: header
 *         name: recovery-token
 *         schema:
 *           type: string
 *         required: true
 *         description: Token to verify recovery password
 *     responses:
 *       200:
 *         description: Recovery token verified successfully
 *       404:
 *         description: User does not exist
 *       401:
 *         description: Unauthorized or invalid token
 */
router.post("/VerifyRecoveryPassword", controller.verifyRecoveryPassword);

/**
 * @swagger
 * /ChangePassword:
 *   post:
 *     summary: Change a user's password
 *     tags: [Authentication]
 *     parameters:
 *       - in: header
 *         name: recovery-token
 *         schema:
 *           type: string
 *         required: false
 *         description: Token to authorize password change
 *       - in: header
 *         name: x-access-token
 *         schema:
 *           type: string
 *         required: false
 *         description: Access token for logged-in user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 description: User's old password (required if x-access-token is provided)
 *               newPassword:
 *                 type: string
 *                 description: New password
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       401:
 *         description: Incorrect password or unauthorized
 *       500:
 *         description: Unexpected error
 */
router.post("/ChangePassword", controller.changePassword);

module.exports = router;
