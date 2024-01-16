/* eslint-disable no-use-before-define */
import mongoose from "mongoose";
import queries from "./queries.js";
import methods from "./methods.js";
import statics from "./statics.js";
import shape from "./shape.js";
import GearPrice from "../../models/GearPrice.js";

const { Schema, model } = mongoose;

const GearSchema = new Schema(shape, {
  strictQuery: "throw",
});

GearSchema.query = queries;
GearSchema.methods = methods;
GearSchema.statics = statics;

/**
 * Creating new price entries
 */
GearSchema.pre("save", function (next) {
  const shouldCreateNewHistoryEntry =
    this.modifiedPaths().includes("craftingPrice") &&
    this.modifiedPaths().includes("lastPriceUpdatedAt");

  if (shouldCreateNewHistoryEntry) {
    this.updatePricesHistory();
  }

  next();
});

/**
 * After updating a gear's recipe, update its crafting price
 * Update prices history if item has been sold
 */
GearSchema.post("findOneAndUpdate", async function (doc) {
  const previousRecipe = JSON.stringify(this._update.$set.recipe);
  const currentRecipe = JSON.stringify(doc.recipe);

  if (previousRecipe !== currentRecipe) {
    await doc.onRecipePriceChange();
  }

  if (doc.sold > this._update.$set.sold) {
    const { currentPrice, craftingPrice } = doc;
    let gearPrice = await GearPrice.findOneAndUpdate(
      {
        GearId: request.params._id,
        price: currentPrice,
        craftingPrice,
      },
      {
        $inc: {
          numberOfSuccess: true,
        },
      },
      {
        returnDocument: "after",
      }
    );
    if (!gearPrice) {
      gearPrice = await GearPrice.create({
        GearId: request.params._id,
        price: currentPrice,
        craftingPrice,
        recordDate: Date.now(),
        numberOfFailures: 0,
        numberOfSuccess: 1,
      });
    }
    gearPrice.updateRatio();
  }
});

const Gear = model("gear", GearSchema);

export default Gear;
