import Gear from "../models/Gear/Gear.js";
import {resources} from "./resources.js";
import {gears} from "./gears.js";
import Resource from "../models/Resource.js";

/**
 * Fill the DB with the data located in ./
 */
export default async function seed() {
  await Resource.insertMany(resources);
  await Gear.insertMany(gears);
}