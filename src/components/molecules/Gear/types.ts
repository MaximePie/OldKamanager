import {Gear} from "../../../types/Gear";
import {GearPrice} from "../../../types/GearPrice";

type GearProps = {
  data: Gear,
  afterUpdate: () => void,
}

type ComponentProps = {
  isEmpty: boolean,
  isTooHigh: boolean,
}

type GearPriceRequest = {
  prices: GearPrice[],
}

export type {GearProps, ComponentProps, GearPriceRequest }