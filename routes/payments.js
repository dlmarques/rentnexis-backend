const router = require("express").Router();
const { verifyToken } = require("../middleware");
const controller = require("../controllers/payments.controller");

router.post("/PayRent", [verifyToken], controller.pay);

router.post(
  "/GetAllPaymentsByLeaseId",
  [verifyToken],
  controller.getAllPaymentsByLease
);

module.exports = router;
