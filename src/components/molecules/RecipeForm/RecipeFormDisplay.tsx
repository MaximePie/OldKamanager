import React, { useState } from "react";
import { StyledRecipeFormDisplay, Wrapper, CloseIcon } from "./styles";
import { RecipeFormDisplayProps } from "./types";
import Resource from "../Resource/Resource";
import { Header } from "../../pages/Resources/styles";

type NewComponentHook = {
  draftName: string;
  setDraftName: (name: string) => void;
  draftQuantity: number;
  setDraftQuantity: (quantity: number) => void;
};

function useNewComponent(): NewComponentHook {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(0);
  return {
    draftName: name,
    setDraftName: setName,
    draftQuantity: quantity,
    setDraftQuantity: setQuantity,
  };
}

export default function RecipeFormDisplay(props: RecipeFormDisplayProps) {
  const {
    recipe,
    onClose,
    onNameUpdate,
    name,
    onComponentQuantityUpdate,
    onComponentAdd,
  } = props;

  const { draftName, setDraftName, draftQuantity, setDraftQuantity } =
    useNewComponent();

  return (
    <Wrapper>
      <StyledRecipeFormDisplay>
        <CloseIcon onClick={() => onClose()}>X</CloseIcon>
        <h3>{name}</h3>
        <Header>
          <span>Image</span>
          <span>Nom</span>
          <span>Prix</span>
        </Header>
        {recipe.map((item) => (
          <Resource
            key={item._id}
            data={item}
            isEditing={true}
            quantity={item.quantity}
            onNameChange={(newName: string) => onNameUpdate(item, newName)}
            onQuantityChange={(newQuantity: number) =>
              onComponentQuantityUpdate(item, newQuantity)
            }
          />
        ))}

        <div className="new-component">
          <input
            type="text"
            value={draftName}
            onChange={(event) => setDraftName(event.target.value)}
          />
          <input
            type="number"
            value={draftQuantity}
            onChange={(event) => setDraftQuantity(event.target.valueAsNumber)}
          />
          <button onClick={() => onComponentAdd(draftName, draftQuantity)}>
            Save
          </button>
        </div>
      </StyledRecipeFormDisplay>
    </Wrapper>
  );
}
