import {Component} from "../../../types/Gear";

type ShoppingQuery = {
  list: Component[],
  estimatedIncome: number,
  slots: number,
}

type ShoppingProps = {

}
type ShoppingDisplayProps = {
  items: Component[],
  total: string,
  estimatedIncome: string,
  ratio: string,
  slots: number,
  benefit: string,
  onHide: (name: string) => void,
  onCancelActionClick: () => void,
}

export type {ShoppingDisplayProps, ShoppingProps, ShoppingQuery}

