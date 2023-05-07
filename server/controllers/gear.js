// noinspection ES6MissingAwait

import Gear from '../models/Gear/Gear.js';
import axios from "axios";
import GearPrice from "../models/GearPrice.js";

export async function get(request, response) {

  const {
    search,
    limit,
    types,
    isPricelessOnly,
    minLevel,
    maxLevel,
    isInShopHidden,
    isInInventory,
    shouldHideToBeCrafted,
    shouldShowToBeCraftedOnly,
    shouldDisplayWishlist,
    shouldDisplayOldPrices
  } = request.query;
  let remaining = 0;
  const formattedSearch = new RegExp(
      (decodeURIComponent(search)
              .replace(/,*$/, '')
              .replaceAll(', ', ',')
              .replaceAll(',', '|')
              .toLowerCase()
              .trimStart()
      ),
      'i');

  const query = Gear.find({
    // currentPrice: {
    //   $gt: 15000,
    // },
    recipe: {
      $exists: true,
      $ne: [],
    },
    level: {
      $gte: parseInt(minLevel) || 1,
      $lte: parseInt(maxLevel) || 200,
    },

    name: formattedSearch,
  })


  // query.findWithoutTrophies();


  remaining = await Gear.count({
    type: {
      $in: types.split(',')
    },
    currentPrice: 0,

    recipe: {
      $exists: true,
      $ne: [],
    },
    level: {
      $gte: parseInt(minLevel) || 1,
      $lte: parseInt(maxLevel) || 200,
    },
    name: new RegExp(decodeURIComponent(search).toLowerCase(), 'i'),

  })

  /**
   * Disabled for now, we handle it in the front
   */
  // if (shouldDisplayOldPrices === 'true') {
  //   query.findOldPrices();
  // }

  if (shouldHideToBeCrafted === 'true') {
    query.findWithoutToBeCrafted();
  }

  if (isInInventory === 'true') {
    query.inInventory();
    query.sort({
      level: 'desc',
    })

  }

  if (isInShopHidden === 'true') {
    query.withoutShop();
  }

  if (isPricelessOnly === 'true') {
    query.pricesslessOnly();
  }

  if (types) {
    query.findByTypes(types)
  }

  if (shouldDisplayWishlist === 'true') {
    query.findWishList();

    query.sort({
      level: 'desc',
    })
  }

  if (shouldShowToBeCraftedOnly === 'true') {
    query.findToBeCrafted();

    query.sort({
      level: 'desc',
    })
  } else if (shouldDisplayOldPrices === 'false') {
    query.sort({
      ratio: 'desc',
      // name: 'asc',
      // ratio: 'asc',
      // level: 'asc',
    })
    // Shattering values
    // .find({
    //   ratio: {
    //     $gt: 0.30
    //   },
    //   level: {
    //     $gt: 150
    //   }
    // })

  }

  query.sort({
    isInInventory: -1,
  })

  query.limit(limit);
  const gears = await query.exec();

  const formattedGears = await Promise.all(
    gears.map(async gear => {

      const recipe = await gear.formattedRecipe();
      return {
        ...gear._doc,
        recipe,
      }
    })
  )
  response.json({
    gears: formattedGears.filter(({recipe}) => recipe.length > 0),
    remaining,
  });
}

/**
 * Take all the gears
 * For Each
 * Update the crafting price according to the recipe
 * @param request
 * @param response
 * @return {Promise<void>}
 */
export async function updateCraftingPrices(request, response) {
  const gears = await Gear.find({
    recipe: {
      $exists: true,
      $ne: [],
    },
  })

  await Promise.all(gears.map(async gear => {
    const craftingPrice = await gear.calculateCraftingPrice();
    await gear.setCraftingPrice(craftingPrice);
  }))

  response.json({
    messaage: "ok",
  })
}

export async function fill(request, response) {

  const targetItem = "Bouclier Aerdala";
  await Gear.deleteMany({
    name: targetItem,
  })

  const createdItems = [];
  const {data: gears} = await axios.get('https://fr.dofus.dofapi.fr/equipments').then(response => response);
  await Promise.all(gears.map(async gear => {
    const {name, level, imgUrl, type, description, _id, recipe} = gear;
    const createdItem = await Gear.create({
      name,
      level,
      imgUrl,
      type,
      description,
      recipe: recipe.map((object) => Object.entries(object).map(([name, values]) => {
          return {name, quantity: values.quantity}
        })
      )
    })

    createdItems.push(createdItem.name)
  }))

  response.json({
    createdItems,
  })
}

export async function update(request, response) {

  const {_id} = request.params;
  if (_id) {
    const {
      currentPrice,
      sold,
      isInInventory,
      toBeCrafted,
      recipe,
      isInMarket,
      craftingPrice,
      onWishList
    } = request.fields.product;
    const parsedCurrentPrice = parseInt(currentPrice);
    const ratio = currentPrice / craftingPrice;
    const gear = await Gear.findById(_id)
    if (sold > gear.sold) {
      let gearPrice = await GearPrice.findOneAndUpdate({
        GearId: request.params._id,
        price: currentPrice,
        craftingPrice
      }, {
        $inc: {
          numberOfSuccess: true,
        },
      }, {
        returnDocument: "after",
      })
      if (!gearPrice) {
        gearPrice = await GearPrice.create({
          GearId: request.params._id,
          price: currentPrice,
          craftingPrice,
          recordDate: Date.now(),
          numberOfFailures: 0,
          numberOfSuccess: 1,
        })
      }
      gearPrice.updateRatio();
    }


    const updatedGear = await Gear.findByIdAndUpdate(_id, {
      currentPrice: parsedCurrentPrice || 0,
      sold,
      isWanted: false,
      isInInventory,
      toBeCrafted,
      onWishList,
      recipe,
      isInMarket,
      craftingPrice,
      ratio,
    }).catch((e) => {
      response.json({e})
    })


    if (parseInt(currentPrice) !== gear.currentPrice) {
      await gear.updatePricesHistory();
      await gear.updateLastPriceDate();
    }

    response.json({
      gear: updatedGear,
    })
  } else {
    response.json({
      message: "Pas de changement, ID n'est pas défini",
    })
  }
}

/**
 * Update some gears according to their gearIds and parameters filters
 * @param request
 * @param response
 * @returns {Promise<void>}
 */
export async function updateMany(request, response) {
    const {gearIds, parameters} = request.fields;
    const updatedGears = await Gear.updateMany({
        _id: {
            $in: gearIds
        }
    }, parameters)
    response.json({
        gearIds,
        parameters,
        updatedGears,
    })
}

export async function getPricesHistory(request, response) {
  response.json({
    prices: await GearPrice.find({GearId: request.params._id})
  })
}

export async function failAtSelling(request, response) {
  const gear = await Gear.findById(request.params._id);
  const {currentPrice} = gear;
  const gearPrice = await GearPrice.findOneAndUpdate({
    GearId: request.params._id,
    price: currentPrice,
  }, {
    $inc: {
      numberOfFailures: true,
    },
  }, {
    returnDocument: "after",
  })

  if (gearPrice) {
    gearPrice.updateRatio();
    response.json({
      message: "ok",
      gearPrice,
    })
  } else {
    const gearPrice = await gear.updatePricesHistory();
    gearPrice.numberOfFailures = 1;
    await gearPrice.save();
    gearPrice.updateRatio();

    response.json({
      message: "ok",
      gearPrice,
    })
  }
}

export async function deletePrice(request, response) {
  await GearPrice.findByIdAndDelete(request.params._id);

  response.status(200).json({message: "ok"})
}

export async function swapComponents(request, response) {

  // const sourceName = "Peau de Gobelin";
  const sourceName = "Étoffe de Fantôme Pandore";
  const targetName = "Sabot de Gliglicérin";

  const gears = await Gear.find({
    recipe: {
      $elemMatch: {
        name: sourceName
      }
    }
  })

  await Promise.all(gears.map(async gear => {

    gear.recipe = gear.recipe.map(element => {
      const {name} = element;
      return name !== sourceName ? element : {
        ...element,
        name: targetName,
      };
    })

    await gear.save();
  }))

  response.json(gears.map(({name, recipe}) => ({name, recipe})));
}
