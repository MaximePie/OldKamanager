import React from "react";
import {StyledClickableResource, Image, Quantity, Container, StyledButton as Button, Price} from "./styles";

import {ClickableResourceDisplayProps} from "./types";
import {StyledChart as Chart} from "../Gear/styles";

export default function ClickableResourceDisplay(props: ClickableResourceDisplayProps) {

  const {
    name,
    quantity,
    imgUrl,
    isBig,
    onRightClick,
    onLeftClick,
    onQuantityChange,
    price,
    totalPrice,
    onMouseEnter,
    onMouseLeave,
    shouldPricesBeDisplayed,
    resourcePrices,
    backgroundIntensity,
  } = props;

  return (
    <Container>
      {onQuantityChange && quantity && (
        <Button onClick={() => onQuantityChange(quantity - 1)}>-</Button>
      )}
      <StyledClickableResource
        title={`${name} (${totalPrice}k)`}
        onClick={onLeftClick}
        onContextMenu={onRightClick}
        isBig={isBig}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <Image src={imgUrl} referrerPolicy="no-referrer" backgroundIntensity={backgroundIntensity}/>
        <Quantity>{quantity}</Quantity>
        <Price>{price}</Price>
        {shouldPricesBeDisplayed && (
          <Chart
            options={resourcePrices!.options}
            series={resourcePrices!.series}
            width="300"
            type="line"
          />
        )}
      </StyledClickableResource>
      {onQuantityChange && (
        <Button onClick={() => onQuantityChange((quantity || 0) + 1)}>+</Button>
      )}
    </Container>
  )
}

