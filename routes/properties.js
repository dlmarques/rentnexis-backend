const router = require("express").Router();
const { verifyToken } = require("../middleware");
const controller = require("../controllers/properties.controller");
const verifyRole = require("../middleware/verifyRole");

router.post(
  "/CreateProperty",
  [verifyToken, verifyRole.isLandlord],
  controller.create
);
router.get(
  "/GetAllProperties",
  [verifyToken, verifyRole.isLandlord],
  controller.getAllProperties
);
router.post(
  "/GetPropertyById",
  [verifyToken, verifyRole.isLandlord],
  controller.getPropertyById
);

router.delete(
  "/DeleteProperty",
  [verifyToken, verifyRole.isLandlord],
  controller.deleteProperty
);

router.patch(
  "/UpdateProperty",
  [verifyToken, verifyRole.isLandlord],
  controller.updateProperty
);

module.exports = router;
