import React, {useEffect} from "react";
import {StyledClickableResource, Image, Quantity, Container, StyledButton as Button, Price} from "./styles";
import Trend from "../../atoms/Trend/Trend";
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
    trend,
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
        {trend && (
          <Trend value={trend}/>
        )}
      </StyledClickableResource>
      {onQuantityChange && (
        <Button onClick={() => onQuantityChange((quantity || 0) + 1)}>+</Button>
      )}
    </Container>
  )

  /**
   * Compare last and pre-last elements prices of the ressourcePrices
   * If the last price is 20% higher, return "ascending"
   */
  function calculateTrend() {

  }
}

