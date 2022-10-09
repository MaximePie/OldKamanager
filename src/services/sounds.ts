import successSound from "./success.mp3";

/**
 * I use this file to play a sound to commit various actions
 * Example : When I want to update a product price and I do not want to display it on screen
 */

const success = new Audio(successSound);

export function playSuccessSound() {
  success.play();
}