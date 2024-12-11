const router = require("express").Router();
const controller = require("../controllers/auth.controller");

router.post("/IsFirstLogin", controller.isFirstLogin);
router.post("/SaveUser", controller.saveUser);

module.exports = router;
