const router = require("express").Router();
const {
  checkDuplicateUsernameOrEmail,
  verifyDataModel,
} = require("../middleware");
const controller = require("../controllers/auth.controller");

router.post(
  "/Signup",
  [checkDuplicateUsernameOrEmail, verifyDataModel.verifySignUpDataModel],
  controller.signup
);

router.post(
  "/Signin",
  [verifyDataModel.verifySignInDataModel],
  controller.signin
);

router.post("/RefreshToken", controller.refreshToken);

router.get("/verify/:id/:token", controller.verifyUser);

router.post("/RecoveryPassword", controller.recoveryPassword);

router.post("/VerifyRecoveryPassword", controller.verifyRecoveryPassword);
router.post("/ChangePassword", controller.changePassword);

module.exports = router;
