const shape = {
  name: {
    type: String,
    required: true,
  },
  level: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  imgUrl: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },

  sold: {
    type: Number,
    default: 0,
  },

  currentPrice: {
    type: Number,
    default: 0,
  },

  craftingPrice: {
    type: Number,
    default: 0,
  },

  ratio: {
    type: Number,
    default: 0,
  },

  isInInventory: {
    type: Boolean,
    default: false,
  },

  isWanted: {
    type: Boolean,
    default: false,
  },

  toBeCrafted: {
    type: Number,
    default: 0,
  },

  onWishList: {
    type: Number,
    default: 0,
  },

  isInMarket: {
    type: Boolean,
    default: false,
  },

  lastPriceUpdatedAt: Date,

  recipe: [
    {
      name: String,
      quantity: Number,
    },
  ],
}

export default shape;