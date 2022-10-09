import {Gear} from "../../../types/Gear";
import {GearPrice} from "../../../types/GearPrice";
import {ObjectId} from "bson";

type StatsDetailsProps = {
  gear: Gear

}

type StatsDetailsDisplayProps = StatsDetailsProps & {
  prices: GearPrice[],
  onDelete: (_id: ObjectId) => void,
}

export type {StatsDetailsDisplayProps, StatsDetailsProps}

