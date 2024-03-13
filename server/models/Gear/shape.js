const shape = {
  name: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  level: {
    type: Number,
    required: true,
    index: true,
  },
  type: {
    type: String,
    required: true,
    index: true,
  },
  imgUrl: {
    type: String,
    default: "",
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

  lastPriceUpdatedAt: {
    type: Date,
    index: true,
  },

  inMarketSince: {
    type: Date,
    index: true,
  },

  recipe: [
    {
      name: String,
      quantity: Number,
    },
  ],
  brisage: {
    type: {
      lastModifiedDate: Date,
      ratio: Number,
    },
    default: {
      lastModifiedDate: Date.now(),
      ratio: 0,
    },
  },
};

export default shape;
