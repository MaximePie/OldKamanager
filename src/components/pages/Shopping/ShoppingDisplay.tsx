
import React from "react";
import {StyledShopping, Details} from "./styles";
import {ShoppingDisplayProps} from "./types";
import ClickableResource from "../../molecules/ClickableResource/ClickableResource";

export default function ShoppingDisplay(props: ShoppingDisplayProps) {

  const {items, total, onHide, estimatedIncome, benefit, slots, ratio, onCancelActionClick, softHide, showSoftHiddenItems, savedAmount} = props;

  return (
    <div>
      <Details>
        <button
          title="cache l'objet, mais peut le remontrer après"
          onClick={() => softHide()}
        >
          soft hide
        </button>
        <button
          title="Montre les objets cachés"
          onClick={() => showSoftHiddenItems()}
        >
          Reset
        </button>
        <button onClick={() => onCancelActionClick()}>Wups</button>
        <p>Dépenses : {total} k (-{savedAmount})</p>
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

