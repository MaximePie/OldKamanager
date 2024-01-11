import Gear from "./Gear.js";

const statics = {
  async updateCraftingPricesAfterResourceUpdate(resourceName) {
    const gears = await Gear.find({
      "recipe.name": resourceName,
    });

    console.log(resourceName, gears.length);

    gears.map(async (gear) => {
      gear.onRecipePriceChange();
    });
  },
};

export default statics;
