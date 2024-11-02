const router = require("express").Router();
const { verifyToken } = require("../middleware");
const controller = require("../controllers/payments.controller");

router.post("/PayRent", [verifyToken], controller.pay);

module.exports = router;
