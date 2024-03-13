/* eslint-disable no-use-before-define */
import mongoose from "mongoose";
import queries from "./queries.js";
import methods from "./methods.js";
import statics from "./statics.js";
import shape from "./shape.js";
import GearPrice from "../../models/GearPrice.js";
import Resource from "../../models/Resource.js";

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

function arraysContainSameElements(a, b) {
  if (a.length !== b.length) return false;

  a = a.map((item) => JSON.stringify(item)).sort();
  b = b.map((item) => JSON.stringify(item)).sort();

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }

  return true;
}

/**
 * After updating a gear's recipe, update its crafting price
 * Update prices history if item has been sold
 *
 * If Price has changed && the gear is a resource, update the resource price
 */
GearSchema.post("findOneAndUpdate", async function (doc) {
  console.time("findOneAndUpdate");
  const previousRecipe = this._update.$set.recipe;
  const currentRecipe = doc.recipe;

  const isPriceChanged = this._update.$set.currentPrice !== doc.currentPrice;

  if (isPriceChanged) {
    console.warn("Price has changed for", doc.name);
    const resource = await Resource.findOne({ name: doc.name });

    if (resource) {
      console.warn("Updating resource price for", doc.name);
      const price =
        doc.currentPrice < doc.craftingPrice
          ? doc.currentPrice
          : doc.craftingPrice;
      await resource.updateOne({
        $set: {
          currentPrice: price,
          lastPriceUpdatedAt: doc.lastPriceUpdatedAt,
        },
      });
    }
  }

  if (!arraysContainSameElements(previousRecipe, currentRecipe)) {
    console.warn("Recipe has changed for", doc.name);
    console.log("Previous recipe", previousRecipe);
    console.log("Current recipe", currentRecipe);
    await doc.onRecipePriceChange();
  }

  if (doc.sold > this._update.$set.sold) {
    console.warn("Item has been sold");
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
    await gearPrice.updateRatio();
  }

  console.timeEnd("findOneAndUpdate");
});

const Gear = model("gear", GearSchema);

export default Gear;
