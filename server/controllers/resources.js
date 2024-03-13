// noinspection ES6MissingAwait

import Resource from "../models/Resource.js";
import ResourcePrice from "../models/ResourcePrice.js";
import axios from "axios";
import { exec } from "child_process";
import fs from "fs";
import path from "path";

export async function get(request, response) {
  const { shouldDisplayOldPrices } = request.query;

  // const formattedSearch = new RegExp(
  //     (decodeURIComponent(search)
  //             .replace(/,*$/, '')
  //             .replaceAll(', ', ',')
  //             .replaceAll(',', '|')
  //             .toLowerCase()
  //             .trimStart()
  //     ),
  //     'i');
  const query = Resource.find().sort({
    timesRequiredInRecipes: "desc",
  });

  if (shouldDisplayOldPrices === "true") {
    query.find({
      priceUpdatedAt: {
        $lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    });
  }

  const resources = await query.exec();

  response.json(resources);
}

export async function fill(request, response) {
  const { data: resources } = await axios
    .get("https://fr.dofus.dofapi.fr/resources")
    .then((response) => response);
  await Promise.all(
    resources.map(async (resource) => {
      const { name, level, type, imgUrl, description } = resource;
      await Resource.create({
        name,
        level,
        type,
        imgUrl,
        description,
      });
    })
  );
  response.json({
    message: "Challah comme on dit.",
  });
}

export async function update(request, response) {
  const { _id } = request.params;
  const {
    currentPrice,
    soldByTen,
    soldByHundred,
    isWantedForTen,
    isWantedForHundred,
    name,
  } = request.fields;

  const resource = await Resource.findById(_id);
  resource.currentPrice = currentPrice;
  resource.soldByTen = soldByTen;
  resource.soldByHundred = soldByHundred;
  resource.isWantedForTen = isWantedForTen;
  resource.isWantedForHundred = isWantedForHundred;
  if (name) {
    resource.name = name;
  }

  await resource.save();

  response.json({
    updatedResource: resource,
  });
}

export async function create(request, response) {
  const { name, level, type, imgUrl, description } = request.fields;
  const resource = await Resource.create({
    name,
    level,
    type,
    imgUrl,
    description,
  });

  response.json({
    resource,
  });
}

export async function getPricesHistory(request, response) {
  const name = new RegExp(
    decodeURIComponent(request.params.name).toLowerCase(),
    "i"
  );
  const resource = await Resource.findOne({ name });

  if (resource) {
    response.json({
      prices: await ResourcePrice.find({ resourceId: resource._id }),
    });
  }
}

/**
 * This method is only supposed to run once, to fill the images folder
 * @param {*} request
 * @param {*} response
 */
export async function fillImages(request, response) {
  const resources = await Resource.find().sort({ level: 1 });
  const images = resources
    .map(({ imgUrl }) => imgUrl)
    .filter((image) => image !== "haha");
  const newUrlList = images.map((url, index) => {
    const resourceDetails = url.split("items/")[1];
    if (!resourceDetails) {
      console.log("Undefined", url, "for imgage", images[index]);
      return;
    }
    return `https://static.ankama.com/dofus/www/game/items/${resourceDetails}`;
  });

  let itemAdded = 0;

  newUrlList.slice(2000, 2500).map((url, index) => {
    const resourceDetails = url.split("items/")[1];
    const destination = `../src/images/resources/${resourceDetails}`;

    if (resourceDetails.includes("undefined")) {
      console.log("Undefined", url, "for imgage", images[index]);
      return;
    }

    // Create the directory if it doesn't exist
    const dir = path.dirname(destination);
    fs.mkdirSync(dir, { recursive: true });

    // File exists -> skip
    if (fs.existsSync(destination)) {
      console.log("File exists", destination);
      return;
    }

    console.log("Downloading", url, "to", destination);

    exec(`curl -k -o ${destination} ${url}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    });

    itemAdded++;
  });

  response.json({
    message: "Challah comme on dit.",
    count: images.length,
    example: images[0],
    newUrlList,
    itemAdded,
  });

  return;
}
