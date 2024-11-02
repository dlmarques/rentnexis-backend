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

module.exports = router;
