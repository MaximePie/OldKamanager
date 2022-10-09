import React, {MouseEvent, useState} from "react"
import ClickableResourceDisplay from "./ClickableResourceDisplay"
import {ClickableResourceProps} from "./types";
import {copyToClipboard} from "../../../services/clipboard";
import {GearPrice} from "../../../types/GearPrice";
import {Props as ChartProps} from "react-apexcharts";
import {useQuery} from "react-query";
import {GearPriceRequest} from "../Gear/types";
import {getFromServer} from "../../../services/server";

export default function ClickableResource(props: ClickableResourceProps) {
  const {quantity, name, imgUrl, isBig, onHide, onQuantityChange, price, timesRequiredInRecipes} = props;
  const [shouldPricesBeDisplayed, setPricesDisplayState] = useState(false);
  const {data: priceData} = useQuery<GearPriceRequest>(`resourcePrices/${name}`, fetchPrices)

  const totalPrice = price * (quantity || 1);

  let resourcePrices: ChartProps | undefined  = undefined;
  if (priceData?.prices) {
    resourcePrices = {
      options: {
        chart: {
          type: "line",
          animations: {
            speed: 400,
          }
        },
        stroke: {
          curve: "smooth",
        },
        xaxis: {
          categories: []
        },
      },
      series: [{
        name: '',
        data: priceData.prices?.map(({price}: GearPrice) => price),
      }],
    }
  }

  const backgroundColor = timesRequiredInRecipes > 2555 ? 1 : timesRequiredInRecipes / 255;

  return (
    <ClickableResourceDisplay
      quantity={quantity === 0 ? undefined : quantity}
      name={name}
      imgUrl={imgUrl}
      isBig={isBig}
      onLeftClick={() => copyToClipboard(normalizedName(name))}
      onRightClick={onRightClick}
      onQuantityChange={onQuantityChange}
      price={price}
      totalPrice={totalPrice}
      onMouseEnter={() => showPrices()}
      onMouseLeave={() => hidePrices()}
      shouldPricesBeDisplayed={shouldPricesBeDisplayed && priceData?.prices?.length !== 0 && resourcePrices !== undefined}
      resourcePrices={resourcePrices}
      backgroundIntensity={backgroundColor}
    />
  )

  /**
   * Remove Oe symbols and replace them by "oe" string
   * @param draftName - String the name of the resource
   */
  function normalizedName(draftName: string) {
    return draftName
      .replaceAll('Œil', 'il')
      .replaceAll('Œuf', 'uf')
      .replaceAll('Cœur', 'ur')
      ;
  }


  function fetchPrices() {
    return getFromServer(`/resources/prices/${name}`).then(response => response.data);
  }

  function showPrices() {
    setPricesDisplayState(true);
  }

  function hidePrices() {
    setPricesDisplayState(false);
  }


  function onRightClick(event: MouseEvent<HTMLDivElement>) {
    event.preventDefault();
    if (onHide) {
      onHide(name);
    }
  }
}
