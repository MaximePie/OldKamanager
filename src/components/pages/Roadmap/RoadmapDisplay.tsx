
import React from "react";
import {StyledRoadmap} from "./styles";
import {RoadmapDisplayProps} from "./types";

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
    </StyledRoadmap>
  )
}

