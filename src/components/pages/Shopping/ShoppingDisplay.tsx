
import React from "react";
import {StyledShopping, Details} from "./styles";
import {ShoppingDisplayProps} from "./types";
import ClickableResource from "../../molecules/ClickableResource/ClickableResource";

export default function ShoppingDisplay(props: ShoppingDisplayProps) {

  const {items, total, onHide, estimatedIncome, benefit, slots, ratio, onCancelActionClick} = props;

  return (
    <div>
      <Details>
        <button onClick={() => onCancelActionClick()}>Wups</button>
        <p>Dépenses : {total} k</p>
        <p>Revenus : {estimatedIncome} k</p>
        <p>Bénéfices : {benefit} k ({ratio}%)</p>
        <p>Slots : {slots}</p>
      </Details>
      <StyledShopping>
        {items.map(({imgUrl, quantity, name, currentPrice, timesRequiredInRecipes}) => (
          <ClickableResource
            imgUrl={imgUrl}
            name={name}
            quantity={quantity}
            isBig
            onHide={onHide}
            price={currentPrice}
            timesRequiredInRecipes={timesRequiredInRecipes}
          />
        ))}
      </StyledShopping>
    </div>
  )
}

