
import React, {useState} from "react"
import ShoppingDisplay from "./ShoppingDisplay"
import {useQuery} from "react-query";
import {getFromServer} from "../../../services/server";
import {Component} from "../../../types/Gear";
import {ShoppingQuery} from "./types";

export default function Shopping() {
  const {data} = useQuery<ShoppingQuery>('shopping', fetchShopping);
  const [hiddenItems, setHiddenItems] = useState<string[]>([]);
  const items = data?.list?.filter(({name}) => !hiddenItems.includes(name) ) || [];
  const total = items.reduce((accumulator, {currentPrice, quantity, name}) => !hiddenItems.includes(name) ? accumulator + currentPrice * quantity : accumulator, 0);
  const income = data?.estimatedIncome || 0;
  const slots = data?.slots || 0;
  const benefit = income - total;

  const ratio = Math.round(income / total * 100)

  return (
    <ShoppingDisplay
      items={items}
      total={total.toLocaleString('FR-fr')}
      onHide={hideFromList}
      estimatedIncome={income.toLocaleString('FR-fr')}
      benefit={benefit.toLocaleString('FR-fr')}
      slots={slots}
      ratio={`${ratio > 0 ? '+' : '-'}${ratio}`}
    />
  )

  async function fetchShopping() {
    return getFromServer('/shopping').then(response => response.data);
  }

  function hideFromList(name: string) {
    setHiddenItems([...hiddenItems, name]);
  }
}
