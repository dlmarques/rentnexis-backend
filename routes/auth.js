const router = require("express").Router();
const controller = require("../controllers/auth.controller");
const { verifyToken } = require("../middleware/verifyToken");

router.post("/IsFirstLogin", controller.isFirstLogin);
router.post("/SaveUser", [verifyToken], controller.saveUser);

module.exports = router;
