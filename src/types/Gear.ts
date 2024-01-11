import { Resource } from "./Resource";
import { ObjectId } from "bson";

type Component = Resource & {
  name: string;
  quantity: number;
  _id: number;
  imgUrl: string;
  isEmpty: boolean;
};

type Gear = {
  _id: ObjectId;
  name: string;
  level: number;
  type: string;
  imgUrl: string;
  description: string;

  sold: number;

  currentPrice: number;
  craftingPrice: number;
  ratio: number;

  isInInventory: boolean;
  isWanted: boolean;
  isInMarket: boolean;
  toBeCrafted: number;
  onWishList: number;

  recipe: Component[];
  lastPriceUpdatedAt: Date;
  brisage: {
    ratio: number;
    lastModifiedDate: Date;
  };
};

export type { Gear, Component };
