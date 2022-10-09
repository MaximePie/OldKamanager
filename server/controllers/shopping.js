import Gear from "../models/Gear/Gear.js";
import Resource from "../models/Resource.js";

export async function get(request, response) {
  const craftTargetQuery = Gear.find({toBeCrafted: {
    $gt: 0,
  }})
    .sort({
      currentPrice: "desc",
    })
  ;

  const list = [];
  let estimatedIncome = 0;
  const clonedQuery = craftTargetQuery.clone()
  const slots = await clonedQuery.count();
  const craftTarget = await craftTargetQuery.exec();

  await Promise.all(
    craftTarget.map(async ({recipe, toBeCrafted, currentPrice}) => {
      estimatedIncome += currentPrice * toBeCrafted

      await Promise.all(
        recipe.map(async ({name, quantity}) => {
          const resource = await Resource.findOne({name})
          if (resource) {
            const addedQuantity = quantity  * toBeCrafted

            const existingItemIndex = list.findIndex(item => item.name === name)
            if (existingItemIndex !== -1) {
              list[existingItemIndex].quantity += addedQuantity
            }
            else {
              list.push({
                ...resource._doc,
                quantity: addedQuantity,
              });
            }
          }
        })
      )
    })
  )

  response.json({
    list: list.sort(({_id: id1}, {_id: id2}) => id1 > id2 ? 1 : -1),
    estimatedIncome,
    slots,
  });
}
