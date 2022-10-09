/* eslint-disable no-use-before-define */
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const ResourcePriceSchema = new Schema({
  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'resource',
  },
  price: {
    type: Number,
    required: true,
  },
  recordDate: {
    required: true,
    type: Date,
  }
});

const ResourcePrice = model('resourcePrice', ResourcePriceSchema);

export default ResourcePrice;
