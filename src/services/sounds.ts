import successSound from "./success.mp3";
import clickSound from "./click.mp3";

/**
 * I use this file to play a sound to commit various actions
 * Example : When I want to update a product price and I do not want to display it on screen
 */

const success = new Audio(successSound);
const click = new Audio(clickSound);

export function playSuccessSound() {
  success.play();
}

export function playClickSound() {
  click.play();
}
