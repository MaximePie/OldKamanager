/* eslint-disable no-use-before-define */
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const GearPriceSchema = new Schema({
  GearId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gear',
  },
  price: {
    type: Number,
    required: true,
  },
  craftingPrice: {
    type: Number,
    required: true,
  },
  recordDate: {
    required: true,
    type: Date,
  },

  numberOfSuccess: {
    type: Number,
    default: 0,
  },
  numberOfFailures: {
    type: Number,
    default: 0,
  },

  sellingSuccessRate: {
    type: Number,
    default: 0,
  }
});

GearPriceSchema.methods = {
  async updateRatio() {
    this.sellingSuccessRate = Math.round(this.numberOfFailures / (this.numberOfSuccess || 1));
    await this.save();
  }
}

const GearPrice = model('GearPrice', GearPriceSchema);

export default GearPrice;
