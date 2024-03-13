import { MouseEvent } from "react";
import { ResourcePrice } from "../../../types/ResourcePrice";
import { Props as ChartProps } from "react-apexcharts";
import { Trend } from "../../../types/Trend";

type ClickableResourceProps = {
  name: string;
  quantity?: number;
  imgUrl: string;
  isBig?: boolean;
  onHide?: (name: string) => void;
  onQuantityChange?: (newQuantity: number) => void;
  price: number;
  timesRequiredInRecipes: number;
  trend?: Trend;
  isSheitan?: boolean;
};
type ClickableResourceDisplayProps = Omit<
  ClickableResourceProps,
  "_id" | "timesRequiredInRecipes"
> & {
  onLeftClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onRightClick?: (event: MouseEvent<HTMLDivElement>) => void;
  onMiddleClick?: (event: MouseEvent<HTMLDivElement>) => void;
  totalPrice: number;
  shouldPricesBeDisplayed?: boolean;
  prices?: ResourcePrice[];
  backgroundIntensity: number;
  resourcePrices?: ChartProps | undefined;
  orientation?: "horizontal" | "vertical";
};

type StyledClickableResourceProps = {
  isBig?: boolean;
  isSheitan?: boolean;
};

type StyledImageProps = {
  backgroundIntensity: number;
};

export type {
  ClickableResourceDisplayProps,
  ClickableResourceProps,
  StyledClickableResourceProps,
  StyledImageProps,
};
