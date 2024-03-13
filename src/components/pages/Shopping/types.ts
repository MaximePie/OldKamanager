import { Component } from "../../../types/Gear";
export type ShoppingComponent = Component & { isSheitan: boolean };

type ShoppingQuery = {
  list: Component[];
  estimatedIncome: number;
  slots: number;
};

type ShoppingProps = {};
type ShoppingDisplayProps = {
  items: ShoppingComponent[];
  total: string;
  estimatedIncome: string;
  savedAmount: string;
  ratio: string;
  slots: number;
  benefit: string;
  ingredientsCount: string;
  onHide: (name: string) => void;
  onCancelActionClick: () => void;
  softHide: () => void;
  showSoftHiddenItems: () => void;
};

export type { ShoppingDisplayProps, ShoppingProps, ShoppingQuery };
