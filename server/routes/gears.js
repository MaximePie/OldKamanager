import express from "express";
import Gear from "../models/Gear/Gear.js";
import {
  get,
  fill,
  deleteGear,
  update,
  swapComponents,
  updateCraftingPrices,
  getPricesHistory,
  failAtSelling,
  deletePrice,
  updateMany,
  sellMany,
  fillImages,
  create,
} from "../controllers/gear.js";

const router = express.Router();

router.get("/", get);
router.post("/", create);
router.post("/delete/:_id", deleteGear);
router.get("/swapComponents", swapComponents);
router.get("/updateCraftingPrices", updateCraftingPrices);
router.post("/bulkUpdate", updateMany);
router.post("/sellMany", sellMany);
router.post("/update/:_id", update);
router.get("/fill/images", fillImages);
router.put("/fail/:_id", failAtSelling);
router.get("/prices/:_id", getPricesHistory);
router.delete("/prices/:_id", deletePrice);

router.get("/setInMarketSince", async (request, response) => {
  const gears = await Gear.find({
    isInMarket: true,
  });

  await Promise.all(
    gears.map(async (gear) => {
      gear.inMarketSince = new Date();
      await gear.save();
    })
  );

  response.json({
    message: "ok",
  });
});

// DANGER ZONE
router.get("/fill", fill);
export default router;
