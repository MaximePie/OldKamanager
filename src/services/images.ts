/**
 * Images are no longer accessible from API, we need to store them locally
 * and use them from there.
 */

/**
 * From https://s.ankama.com/www/static.ankama.com/dofus/www/game/items/200/52251.png
 * To src/images/resources/200/52251.png
 * @param url
 */
export const formattedImageUrl = (url: string, type: "resources" | "gears") => {
  const details = url.split("/items/")[1];

  if (!details || details.includes("undefined")) {
    return "";
  }
  return `src/images/${type}/${details}`;
};
