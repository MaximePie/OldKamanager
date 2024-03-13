import React, { useEffect, useState } from "react";
import {
  StyledClickableResource,
  Image,
  Quantity,
  Container,
  StyledButton as Button,
  Price,
} from "./styles";
import Trend from "../../atoms/Trend/Trend";
import { ClickableResourceDisplayProps } from "./types";
import { StyledChart as Chart } from "../Gear/styles";
import { formattedImageUrl } from "../../../services/images";
import styles from "./styles.module.scss";
import { useResourcesContext } from "../../../contexts/RessourcesContext";

type MagicInputProps = {
  defaultValue: number;
  className?: string;
  onBlur: (newValue: number) => void;
};

const MagicInput = ({ defaultValue, onBlur, className }: MagicInputProps) => {
  const [draftPrice, setDraftPrice] = useState(defaultValue);

  /**
   * If the user press a specific key, append some '0' to the price
   * If key = W, append 00 to the price
   * If key = X, append 000 to the price
   * If key = C, append 0000 to the price
   * If key = V, append 00000 to the price
   * @param event
   */
  const appendDigits = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "w") {
      setDraftPrice(draftPrice * 100);
    } else if (event.key === "x") {
      setDraftPrice(draftPrice * 1000);
    } else if (event.key === "c") {
      setDraftPrice(draftPrice * 10000);
    } else if (event.key === "v") {
      setDraftPrice(draftPrice * 100000);
    }
  };
  return (
    <input
      type="number"
      min="0"
      onBlur={(e) => onBlur(Number(e.target.value))}
      onKeyDown={appendDigits}
      value={draftPrice}
      onChange={(e) => setDraftPrice(Number(e.target.value))}
      className={className}
    />
  );
};

export default function ClickableResourceDisplay(
  props: ClickableResourceDisplayProps
) {
  const {
    name,
    quantity,
    imgUrl,
    isBig,
    onRightClick,
    onLeftClick,
    onMiddleClick,
    onQuantityChange,
    price,
    totalPrice,
    onMouseEnter,
    onMouseLeave,
    shouldPricesBeDisplayed,
    resourcePrices,
    backgroundIntensity,
    trend,
    orientation = "horizontal",
    isSheitan,
  } = props;

  const { updateResourcePrice } = useResourcesContext();
  return (
    <Container>
      {onQuantityChange && quantity && (
        <Button onClick={() => onQuantityChange(quantity - 1)}>-</Button>
      )}
      <StyledClickableResource
        title={`${name} (${totalPrice}k)`}
        onClick={onLeftClick}
        onAuxClick={(e) => {
          if (e.button === 1 && onMiddleClick) {
            onMiddleClick(e);
          }
        }}
        onContextMenu={onRightClick}
        isBig={isBig}
        isSheitan={isSheitan}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <Image
          src={formattedImageUrl(imgUrl, "resources")}
          referrerPolicy="no-referrer"
          backgroundIntensity={backgroundIntensity}
        />
        <Quantity>{quantity}</Quantity>
        {orientation === "vertical" ? (
          <MagicInput
            key={name}
            className={styles.priceInput}
            defaultValue={price}
            onBlur={(newValue) => updateResourcePrice(name, newValue)}
          />
        ) : (
          <Price>{price}</Price>
        )}

        {shouldPricesBeDisplayed && (
          <Chart
            options={resourcePrices!.options}
            series={resourcePrices!.series}
            width="300"
            type="line"
          />
        )}
        {trend && <Trend value={trend} />}
      </StyledClickableResource>
      {onQuantityChange && (
        <Button onClick={() => onQuantityChange((quantity || 0) + 1)}>+</Button>
      )}
    </Container>
  );
}
