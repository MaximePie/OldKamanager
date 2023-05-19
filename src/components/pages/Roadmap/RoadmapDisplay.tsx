
import React from "react";
import {StyledRoadmap} from "./styles";
import {RoadmapDisplayProps} from "./types";


interface ITimes {
  "Bank": string,
  "Ingredients": string,
  "Crafting Done": string,
  "Sell Done": string,
};
interface IRush {
  "Number of items": number,
  income: number,
  times: ITimes,
}

const rushes: IRush[] = [
  {
    "Number of items": 20,
    income: 700000,
    times: {
    "Bank": "2:06",
    "Ingredients": "4:05",
    "Crafting Done": "7:19",
    "Sell Done": "14:22",
    }
  },
  {
    "Number of items": 14,
    income: 239000,
    times: {
    "Bank": "2:06",
    "Ingredients": "4:05",
    "Crafting Done": "7:19",
    "Sell Done": "14:22",
    }
  }
]


export default function RoadmapDisplay(props: RoadmapDisplayProps) {


  return (
    <StyledRoadmap>
      <p>Eh bien voilou</p>

      <ul>
        <li>Quand je clique sur -20%, envoyer une requête au serveur pour annoncer un échec</li>
        <li>Créer un bouton "-" qui permet d'annoncer un échec</li>
        <li>Afficher les échecs sur le graphique et le pourcentage de réussite</li>
        <li>Ajouter une colonne avec les +2% de taxe de modification de prix</li>
      </ul>

      <ul>
        <li>Mettre à jour les chances de vente une fois que l'on ajoute un success au currentPrice.</li>
      </ul>

      <ul>
        <li>Attribuer des gears à des persos</li>
      </ul>
      <ul>
        <li>Chronométrer pour estimer le temps que ça va prendre</li>
      </ul>

      <h4>Places dispos</h4>
      <p>
        Amulettes : 4
        Anneaux : 3

      </p>

      <h3>Time tracking</h3>
      <div>
        {
          rushes.map(Rush)
        }
      </div>
    </StyledRoadmap>
  )

  function Rush(rush: IRush, index: number) {
    return (
      <div key={index}>
        <h4>Rush {index + 1}</h4>
        <div>
          <span>Number of items: </span>
          <span>{rush["Number of items"]}</span>
        </div>
        <div>
          <span>Income: </span>
          <span>{rush.income}</span>
        </div>
        <div>
          {Object.entries(rush.times).map(ItemTime)}
        </div>
      </div>
    )
  }

  /**
   *
   * @param key - Current step name
   * @param value - Time spent on this step
   * @param index - Index of the current step
   * @constructor
   */
  function ItemTime([key, value]: [string, string | number], index: number) {
    return (
      <div>
        <span>{key + ": "}</span>
        <span>{value}</span>
      </div>
    )
  }
}