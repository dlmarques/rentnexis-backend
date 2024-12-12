const router = require("express").Router();
const controller = require("../controllers/auth.controller");
const { verifyTokenMiddleware } = require("../middleware/index");

router.post("/IsFirstLogin", controller.isFirstLogin);
router.post("/SaveUser", [verifyTokenMiddleware], controller.saveUser);

module.exports = router;
