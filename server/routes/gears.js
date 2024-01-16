import express from "express";
import {
  get,
  fill,
  update,
  swapComponents,
  updateCraftingPrices,
  getPricesHistory,
  failAtSelling,
  deletePrice,
  updateMany,
  sellMany,
  fillImages,
} from "../controllers/gear.js";

const router = express.Router();

router.get("/", get);
router.get("/swapComponents", swapComponents);
router.get("/updateCraftingPrices", updateCraftingPrices);
router.post("/bulkUpdate", updateMany);
router.post("/sellMany", sellMany);
router.post("/update/:_id", update);
router.get("/fill/images", fillImages);
router.put("/fail/:_id", failAtSelling);
router.get("/prices/:_id", getPricesHistory);
router.delete("/prices/:_id", deletePrice);

// DANGER ZONE
router.get("/fill", fill);
export default router;
