import { useState } from "react";
import { Component, Gear } from "../../../types/Gear";
import { useResourcesContext } from "../../../contexts/RessourcesContext";

export const useDraftItem = () => {
  const [draftItem, setDraftItem] = useState<Partial<Gear>>({
    name: "",
    type: "",
    level: 1,
    description: "",
  });
  const { findResourceFromName } = useResourcesContext();

  const [draftComponent, setDraftComponent] = useState<Partial<Component>>({
    name: "",
    quantity: 1,
  });

  const [recipe, setRecipe] = useState<Partial<Component>[]>([]);

  const updateDraftItem = (newDraftItem: Partial<Gear>) => {
    setDraftItem(newDraftItem);
  };

  const setType = (type: string) => {
    setDraftItem((draftItem) => ({ ...draftItem, type }));
  };

  const setLevel = (level: number) => {
    setDraftItem((draftItem) => ({ ...draftItem, level }));
  };

  const setDescription = (description: string) => {
    setDraftItem((draftItem) => ({ ...draftItem, description }));
  };

  const setName = (name: string) => {
    setDraftItem((draftItem) => ({ ...draftItem, name }));
  };

  const setComponentName = (name: string) => {
    setDraftComponent((draftComponent) => ({ ...draftComponent, name }));
  };

  const setComponentQuantity = (quantity: number) => {
    setDraftComponent((draftComponent) => ({ ...draftComponent, quantity }));
  };

  const appendComponentToRecipe = () => {
    if (!draftComponent.name)
      throw new Error("Cannot add an item with no name");
    if (!draftComponent.quantity)
      throw new Error("Cannot add an item with no quantity");
    const component = findResourceFromName(draftComponent.name);

    if (!component) throw new Error("Cannot find component");
    setRecipe((recipe) => [
      ...recipe,
      {
        name: component.name,
        quantity: draftComponent.quantity,
      } as Component,
    ]);
    setDraftComponent({ name: "", quantity: 1 });
  };

  const isValid = () => {
    return (
      draftItem.name &&
      draftItem.type &&
      draftItem.level &&
      draftItem.description &&
      recipe.length > 0
    );
  };

  const save = () => {
    alert("OK");
  };

  return {
    draftItem,
    updateDraftItem,
    setName,
    setType,
    setLevel,
    setDescription,
    setComponentName,
    setComponentQuantity,
    appendComponentToRecipe,
    isValid,
    save,
    recipe,
  };
};
