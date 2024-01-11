import express from "express";
import {
  get,
  fill,
  update,
  getPricesHistory,
  create,
} from "../controllers/resources.js";
import Resource from "../models/Resource.js";
import Gear from "../models/Gear/Gear.js";

const router = express.Router();

router.get("/", get);
router.get("/fill", fill);
router.get("/required/fill/", async (request, response) => {
  const resources = await Resource.find({
    timesRequiredInRecipes: 1,
  });

  await Promise.all(
    resources.map(async (resource) => {
      const { name } = resource;
      const gearsWhereTheResourceIsNeeded = await Gear.find({
        recipe: {
          $elemMatch: {
            name,
          },
        },
      });

      if (gearsWhereTheResourceIsNeeded.length === 0) {
        return 0;
      }

      const totalQuantity = gearsWhereTheResourceIsNeeded.reduce(
        (accumulator, currentValue) =>
          accumulator +
          currentValue.recipe.find(
            ({ name: recipeResourceName }) => recipeResourceName === name
          )?.quantity,
        0
      );

      if (totalQuantity) {
        resource.timesRequiredInRecipes = totalQuantity;
        await resource.save();
      }

      return totalQuantity;
    })
  );

  const updatedResources = await Resource.find({
    timesRequiredInRecipes: 1,
  });

  response.json({
    updatedResources,
    quantities: updatedResources?.map(({ name, timesRequiredInRecipes }) => ({
      name,
      timesRequiredInRecipes,
    })),
    resource: await Resource.find({
      timesRequiredInRecipes: 1,
    }).limit(2),
  });
});
router.get("/prices/:name", getPricesHistory);
router.post("/update/:_id", update);
router.post("/", create);

export default router;
