import {ObjectId} from "bson";

type GearPrice = {
  _id: ObjectId
  price: number,
  craftingPrice: number,
  currentPrice: number,
  sellingSuccessRate: number,
  recordDate: Date,
}


export type {GearPrice}