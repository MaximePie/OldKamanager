import React, {MouseEvent, useState} from "react"
import ClickableResourceDisplay from "./ClickableResourceDisplay"
import {ClickableResourceProps} from "./types";
import {copyToClipboard} from "../../../services/clipboard";
import {GearPrice} from "../../../types/GearPrice";
import {Props as ChartProps} from "react-apexcharts";
import {useQuery} from "react-query";
import {GearPriceRequest} from "../Gear/types";
import {getFromServer} from "../../../services/server";
import {Trend} from "../../../types/Trend";

export default function ClickableResource(props: ClickableResourceProps) {
  const {quantity, name, imgUrl, isBig, onHide, onQuantityChange, price, timesRequiredInRecipes} = props;
  const [shouldPricesBeDisplayed, setPricesDisplayState] = useState(false);
  const {data: priceData} = useQuery<GearPriceRequest>(`resourcePrices/${name}`, fetchPrices)

  const totalPrice = price * (quantity || 1);

  let pricesHistory: ChartProps | undefined  = undefined;
  let pricesTrend: Trend = undefined;
  if (priceData?.prices) {
    pricesHistory = {
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
    pricesTrend = trendFromPricesHistory(priceData);
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
      shouldPricesBeDisplayed={shouldPricesBeDisplayed && priceData?.prices?.length !== 0 && pricesHistory !== undefined}
      resourcePrices={pricesHistory}
      trend={pricesTrend}
      backgroundIntensity={backgroundColor}
    />
  )

  /**
   * Calculate the trend of the prices history
   *
   * @param priceData - Object containing the prices history
   * @returns "ascending" | "descending" | "stable" | undefined
   */
  function trendFromPricesHistory(priceData: GearPriceRequest): Trend {
    const prices = priceData.prices;
    if (prices.length > 2) {
      const lastPrice = prices[prices.length - 1].price;
      const preLastPrice = prices[prices.length - 2].price;
      // If lastPrice is 20% higher than preLastPrice, return "ascending"
      if (lastPrice > preLastPrice * 1.2) {
        return "ascending";
      }
      // If lastPrice is 20% lower than preLastPrice, return "descending"
      if (lastPrice < preLastPrice * 0.8) {
        return "descending";
      }
      // Else, return "stable"
      return "stable";
    }
    return "stable";
  }

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
