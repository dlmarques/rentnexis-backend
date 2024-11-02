const router = require("express").Router();
const { verifyToken } = require("../middleware");
const controller = require("../controllers/leases.controller");
const verifyRole = require("../middleware/verifyRole");

router.post(
  "/CreateLease",
  [verifyToken, verifyRole.isLandlord],
  controller.create
);

router.post("/StartLease", [verifyToken], controller.start);
router.post(
  "/RenewLease",
  [verifyToken, verifyRole.isLandlord],
  controller.renew
);
router.patch(
  "/UpdateRentAmount",
  [verifyToken, verifyRole.isLandlord],
  controller.updateRentAmount
);

router.post(
  "/StopLease",
  [verifyToken, verifyRole.isLandlord],
  controller.stop
);

module.exports = router;
