import React from "react";
import {StyledStatsDetails, Price} from "./styles";
import {StatsDetailsDisplayProps} from "./types";

export default function StatsDetailsDisplay(props: StatsDetailsDisplayProps) {
  const {gear: {name}, prices, onDelete} = props;

  return (
    <StyledStatsDetails>
      <h2>{name}</h2>
      {prices.map(
        ({
           _id,
           price,
           craftingPrice,
           sellingSuccessRate,
         }) => (
          <Price key={_id.toString()}>
            <span>{price}</span>
            <span>{craftingPrice}</span>
            <span>{sellingSuccessRate}</span>
            <button onClick={() => onDelete(_id)}>Delete</button>
          </Price>
        ))}
    </StyledStatsDetails>
  )

}

