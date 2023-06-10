type Resource = {
  _id: number,
  name: string,
  level: number,
  type: string,
  imgUrl: string,
  description: string,
  soldByTen: number,
  soldByHundred: number,
  currentPrice: number,
  timesRequiredInRecipes: number,
  isWantedForTen: boolean,
  isWantedForHundred: boolean,

  priceUpdatedAt: Date,
}

export type {
  Resource
};