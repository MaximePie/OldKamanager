
import React from "react";
import {StyledRecipeFormDisplay, Wrapper, CloseIcon} from "./styles";
import {RecipeFormDisplayProps} from "./types";
import Resource from "../Resource/Resource";
import {Header} from "../../pages/Resources/styles";

export default function RecipeFormDisplay(props: RecipeFormDisplayProps) {
  const {recipe, onClose, onNameUpdate, name, onComponentQuantityUpdate} = props;
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
        {recipe.map(item => <Resource
          key={item._id}
          data={item}
          isEditing={true}
          quantity={item.quantity}
          onNameChange={(newName: string) => onNameUpdate(item, newName)}
          onQuantityChange={(newQuantity: number) => onComponentQuantityUpdate(item, newQuantity)}
        />)}
      </StyledRecipeFormDisplay>
    </Wrapper>
  )

}

