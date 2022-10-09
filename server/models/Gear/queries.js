import moment from "moment";

const queries = {
  pricesslessOnly() {
    return this.where({
      currentPrice: 0,
    })
  },

  withoutShop() {
    return this.where({
      isInMarket: {
        $eq: false,
      },
    })
  },

  /**
   * Trouver des items à crafter
   * @memberOf Gear
   */
  findWithoutToBeCrafted() {
    return this.where({

      // craftingPrice: {
      //   $gt: 30000,
      // },

      level : {
        $gt: 60
      },

      toBeCrafted: {
        $eq: 0,
        // $exists: false,
      },
      onWishList: {
        $lte: 0,
      },

      isInMarket: {
        $eq: false,
      },
      isInInventory: {
        $eq: false,
      },

      currentPrice: {
        $gt: 20000,
      },
    })
  },

  findWithoutTrophies() {
    return this.where({
      type: {
        $ne: "Trophée"
      }
    })
  },

  findToBeCrafted() {
    return this.where({
      toBeCrafted: {
        $gt: 0,
      }
    })
  },

  /**
   * Return only the gears with a positive wishlist value
   * @return {queries}
   * @memberOf Gear
   */
  findWishList() {
    return this.where({
      onWishList: {
        $gt: 0,
      },

    })
  },

  findOldPrices() {
    return this.where({

      // craftingPrice: {
      //   $gt: 50000
      // },

      lastPriceUpdatedAt: {
        $lt: moment().subtract(7, 'day'),
      }
    })
    .sort({
      ratio: 'asc'
    })
  },

  inInventory() {
    return this.where({
      isInInventory: true,
    })
  },

  findByTypes(types) {
    return this.where({
      type: {
        $in: types.split(',')
      }
    })
  },
}

export default queries;