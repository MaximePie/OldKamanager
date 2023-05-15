import GearPrice from "../GearPrice.js";
import Resource from "../Resource.js";

const methods = {

  /**
   * Set the last price updated date to today
   * @return {Promise<void>}
   * @memberOf Gear#
   */
  async updateLastPriceDate() {
    this.lastPriceUpdatedAt = Date.now();
    await this.save();
  },

  async updatePricesHistory() {
    return GearPrice.create({
      GearId: this._id,
      price: this.currentPrice,
      craftingPrice: this.craftingPrice,
      recordDate: Date.now(),
    })
  },

  formattedRecipe: async function() {
    return await Promise.all(this.recipe.map(async ({name, quantity}) => {
      const resource = await Resource.findOne({name})

      if (resource) {
        return {
          ...resource?._doc,
          quantity,
          isEmpty: resource?.currentPrice === 0
        };
      }
      else {
        const newResource = await Resource.create({
          name: name || 'REMPLISSEZ çA DITES-DONC !',
          currentPrice: 0,
          description: "Inconnue",
          imgUrl: "haha",
          type: "haha",
          level: 10
        })

        return {
          ...newResource._doc,
          quantity,
        }
      }
    }));
  },

  /**
   * Update the gear info based on the new recipe price
   * Crafting price, ratio, history, and last changed values
   * @return {Promise<void>}
   */
  async onRecipePriceChange() {
    this.craftingPrice = await this.calculateCraftingPrice();
    this.ratio = this.currentPrice / this.craftingPrice;
    this.save();
  },

  setCraftingPrice: async function (price) {
    this.craftingPrice = price;
    await this.save();
  },

  calculateCraftingPrice: async function () {
    const recipe = await this.formattedRecipe();
    return recipe.reduce((accumulator, resource) => {
      return accumulator + resource?.currentPrice * resource.quantity || 0
    }, 0);
  },
  updateRatio: async function () {
    this.ratio = this.currentPrice / this.craftingPrice;
    this.save();
  }
}

export default methods;