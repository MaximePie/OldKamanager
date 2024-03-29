import { Component } from "../types/Gear";

// Basic items like Laine de Bouftou, Fer, should go first because it's a pain to scroll to them
const sheitanItems = [
  "Laine de Bouftou",
  "Fleur de Blop Griotte",
  "Fer",
  "Défense du Sanglier",
  "Bourgeon d'Abraknyde",
  "Fleur de Blop Indigo",
  "Patte d'Arakne",
  "Or",
  "Fraise",
  "Diamant",
  "Fleur de blop Reinette",
  "Fleur de Blop Coco",
  "Kole",
  "Pierre du Craqueleur Légendaire",
  "Gelée à la Fraise",
  "Peau de Bworkette",
  "Gelée Bleutée",
  "Écorce d'Abraknyde",
  "Bois de Bambou",
  "Gelée à la Menthe",
  "Aile de Dragodinde",
  "Sable Fin",
  "Ambre",
  "Œil d'Abrakne",
  "Pierre du Craqueleur",
  "Bronze",
  "Champignon",
  "Lamelle de Champa Vert",
  "Lamelle de Champa Marron",
  "Racine d'Abraknyde",
  "Fleur de Blop Reinette",
  "Cuir de Porkass",
  "Charbon",
  "Groin de Sanglier",
  "Émeraude",
  "Gelée Citron",
  "Pic de Dragodinde",
  "Queue de Dragodinde",
  "Méga Pierre du Craqueleur",
  "Cagoule du Kanniboul Ebil",
];
export const isSheitan = (item: Component) => sheitanItems.includes(item.name);
