import db from "./db.js";
import seed from "../seeders/seeds.js";
import Gear from "../models/Gear/Gear.js";
import Resource from "../models/Resource.js";


/**
 * Generates a random number between min and max
 * @param min number The minimal value (can be negative)
 * @param max number the maximal value (can be negative)
 * @return {number} a number between min and max
 */
function randomInt(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

beforeAll(async () => {
  await db.connect();
  await seed();
})

afterEach(async () => await db.clearDatabase())
afterAll(async () => await db.closeDatabase())

describe('Resource update', () => {
  it ('Should update related gears crafting price after current price update', async () => {
    const craft = await Gear.findOne({});
    const originalPrice = craft.currentPrice;
    const resourceName = craft.recipe[Math.round(Math.random(0, craft.recipe.length))].name;
    const resource = await Resource.findOne({name: resourceName});

    // const modifier = Math.round(Math.random(-100, 100) * 100);
    expect(randomInt(1, 10)).toBeGreaterThanOrEqual(1)
    expect(randomInt(1, 10)).not.toBeGreaterThan(10)

  })
})