/* eslint-disable no-use-before-define */
import mongoose from "mongoose";
import ResourcePrice from "./ResourcePrice.js";
import Gear from "./Gear/Gear.js";

const { Schema, model } = mongoose;

const ResourceSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  level: {
    type: Number,
    default: 1,
  },
  type: {
    type: String,
    default: "",
  },
  imgUrl: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },

  soldByTen: {
    type: Number,
    default: 0,
  },
  soldByHundred: {
    type: Number,
    default: 0,
  },
  currentPrice: {
    type: Number,
    default: 0,
  },
  isWantedForTen: {
    type: Boolean,
    default: false,
  },
  isWantedForHundred: {
    type: Boolean,
    default: false,
  },
  priceUpdatedAt: {
    type: Date,
    default: Date.now,
  },
  timesRequiredInRecipes: {
    default: 1,
    type: Number,
  },
});

ResourceSchema.methods = {
  async updatePricesHistory() {
    await ResourcePrice.create({
      resourceId: this._id,
      price: this.currentPrice || 0,
      recordDate: Date.now(),
    });
  },
};

ResourceSchema.post("save", async function (document, next) {
  await document.updatePricesHistory();
  console.log("Updating crafting prices after resource update");
  await Gear.updateCraftingPricesAfterResourceUpdate(document.name);
  await document.updateOne({ priceUpdatedAt: Date.now() });
  return next();
});

const Resource = model("resource", ResourceSchema);

export default Resource;
