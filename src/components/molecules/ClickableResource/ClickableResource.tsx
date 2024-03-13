import React, { MouseEvent, useMemo, useState } from "react";
import ClickableResourceDisplay from "./ClickableResourceDisplay";
import { ClickableResourceProps } from "./types";
import { copyToClipboard } from "../../../services/clipboard";
import { GearPrice } from "../../../types/GearPrice";
import { Props as ChartProps } from "react-apexcharts";
import { useQuery } from "react-query";
import { GearPriceRequest } from "../Gear/types";
import { getFromServer } from "../../../services/server";
import { Trend } from "../../../types/Trend";
import { Debug } from "../Debug/Debug";
import { useDebugContext } from "../../../contexts/DebugContext";

export default function ClickableResource(props: ClickableResourceProps) {
  const {
    quantity,
    name,
    imgUrl,
    isBig,
    onHide,
    onQuantityChange,
    price,
    timesRequiredInRecipes,

    isSheitan,
  } = props;
  const { addDebugMessage } = useDebugContext();
  const [shouldPricesBeDisplayed, setPricesDisplayState] = useState(false);
  const { data: priceData, refetch } = useQuery<GearPriceRequest>(
    `resourcePrices/${name}`,
    fetchPrices,
    {
      refetchOnWindowFocus: false,
      enabled: false,
    }
  );

  const totalPrice = price * (quantity || 1);

  let pricesHistory: ChartProps | undefined = undefined;
  let pricesTrend: Trend = undefined;
  useMemo(() => {
    if (priceData?.prices) {
      pricesHistory = {
        options: {
          chart: {
            type: "line",
            animations: {
              speed: 400,
            },
          },
          stroke: {
            curve: "smooth",
          },
          xaxis: {
            categories: [],
          },
        },
        series: [
          {
            name: "",
            data: priceData.prices?.map(({ price }: GearPrice) => price),
          },
        ],
      };
      pricesTrend = trendFromPricesHistory(priceData);
    }
  }, [priceData]);
  let showPricesInterval: number | undefined = undefined;

  const backgroundColor =
    timesRequiredInRecipes > 2555 ? 1 : timesRequiredInRecipes / 255;

  /**
   * Copy the quantity to the clipboard on middle click
   * @param quantity - Quantity of resources we want to use
   */
  const copyQuantityToClipboard = (quantity: number | undefined) => {
    if (quantity) {
      copyToClipboard(quantity.toString());
    }

    addDebugMessage("Copied quantity to clipboard : " + quantity + " " + name);
  };

  const copyNameToClipboard = (name: string) => {
    copyToClipboard(name);
    addDebugMessage("Copied name to clipboard : " + name);
  };

  const removeFromList = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (onHide) {
      addDebugMessage("Removed " + name + " from list");
      onHide(name);
    }
  };

  return (
    <>
      <ClickableResourceDisplay
        quantity={quantity === 0 ? undefined : quantity}
        name={name}
        imgUrl={imgUrl}
        isBig={isBig}
        onLeftClick={() => copyNameToClipboard(normalizedName(name))}
        onRightClick={removeFromList}
        onMiddleClick={() => copyQuantityToClipboard(quantity)}
        onQuantityChange={onQuantityChange}
        price={price}
        totalPrice={totalPrice}
        shouldPricesBeDisplayed={
          shouldPricesBeDisplayed &&
          priceData?.prices?.length !== 0 &&
          pricesHistory !== undefined
        }
        resourcePrices={pricesHistory}
        trend={pricesTrend}
        backgroundIntensity={backgroundColor}
        orientation="vertical"
        isSheitan={isSheitan}
      />
    </>
  );
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
    // create a list of objects with the name of the resource and the normalizedName
    const resourcesToNormalize = [
      { name: "Plumes de Tofu", normalizedName: "plume de tofu" },
      { name: "Fémur du Chafer Rōnin", normalizedName: "Fémur du Chafer R" },
      { name: "Jaune d'Œuf de Krokille", normalizedName: "uf de Krokille" },
      {
        name: "Antenne du Scarafeuille",
        normalizedName: "antennes de Scarafeuille",
      },
      {
        name: "Sang du Vampire",
        normalizedName: "sang de Vampire",
      },
      { name: "Poils Darits", normalizedName: "poils de Darit" },
      { name: "Œil", normalizedName: "il" },
      { name: "Œuf", normalizedName: "uf" },
      { name: "Cœur", normalizedName: "ur" },
    ];

    let result = draftName;
    resourcesToNormalize.forEach(({ name, normalizedName }) => {
      result = result.replaceAll(name, normalizedName);
    });

    return result;
  }

  function fetchPrices() {
    return getFromServer(`/resources/prices/${name}`).then(
      (response) => response.data
    );
  }
  function showPrices() {
    showPricesInterval = window.setTimeout(() => {
      refetch();
      setPricesDisplayState(true);
    }, 1000);
  }

  function hidePrices() {
    window.clearTimeout(showPricesInterval);
    setPricesDisplayState(false);
  }

  function onRightClick(event: MouseEvent<HTMLDivElement>) {
    event.preventDefault();
    if (onHide) {
      onHide(name);
    }
  }
}
