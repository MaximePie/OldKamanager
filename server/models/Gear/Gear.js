/* eslint-disable no-use-before-define */
import mongoose from 'mongoose';
import queries from "./queries.js";
import methods from "./methods.js";
import statics from "./statics.js";
import shape from "./shape.js";

const {Schema, model} = mongoose;

const GearSchema = new Schema(shape, {
  strictQuery: 'throw',
});

GearSchema.query = queries;
GearSchema.methods = methods;
GearSchema.statics = statics;

/**
 * Creating new price entries
 */
GearSchema.pre('save', function (next) {
  const shouldCreateNewHistoryEntry = (
    this.modifiedPaths().includes('craftingPrice')
    && this.modifiedPaths().includes('lastPriceUpdatedAt')
  )

  if (shouldCreateNewHistoryEntry) {
    this.updatePricesHistory();
  }

  next();
})

const Gear = model('gear', GearSchema);

export default Gear;
