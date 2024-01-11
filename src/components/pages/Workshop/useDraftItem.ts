import { useState } from "react";
import { Component } from "../../../types/Gear";

export const useDraftItem = () => {
  const [draftItem, setDraftItem] = useState<Partial<Component>>({
    name: "",
    quantity: 0,
  });

  const [recipe, setRecipe] = useState<Component[]>([]);

  const updateDraftItem = (newDraftItem: Partial<Component>) => {
    setDraftItem(newDraftItem);
  };

  const setName = (name: string) => {
    setDraftItem((draftItem) => ({ ...draftItem, name }));
  };

  const setQuantity = (quantity: number) => {
    setDraftItem((draftItem) => ({ ...draftItem, quantity }));
  };

  const appendDraftToRecipe = () => {
    if (!draftItem.name) throw new Error("Cannot add an item with no name");
    if (draftItem.name) {
      setRecipe((recipe) => [...recipe, draftItem as Component]);
      setDraftItem({ name: "", quantity: 0 });
    }
  };

  return {
    draftItem,
    updateDraftItem,
    setName,
    appendDraftToRecipe,
    recipe,
    setQuantity,
  };
};
