import {ResourceProps} from "./types";
import {StyledResource} from "./styles";
import {ChangeEvent, useEffect, useState} from "react";
import {Resource as ResourceType} from "../../../types/Resource"
import {postOnServer} from "../../../services/server";
import {Button} from "@mui/material";
import ClickableResource from "../ClickableResource/ClickableResource";

Resource.defaultProps = {
  data: null,
  isEditing: false,
}
export default function Resource(props: ResourceProps) {
  const {data, isEditing, quantity, onNameChange, onQuantityChange} = props;
  const [product, setProduct] = useState<ResourceType>(data);
  const {_id, imgUrl, name, currentPrice, soldByTen, soldByHundred, isWantedForTen, isWantedForHundred, timesRequiredInRecipes} = product;
  const [isInitialized, setInitialisationState] = useState<boolean>(false);

  const [draftName, setDraftName] = useState(name);
  const [draftPrice, setDraftPrice] = useState(currentPrice);

  let isMounted = true;

  useEffect(onUpdate, [product])

  return (
    <StyledResource isEditing={isEditing}>
      <ClickableResource
        price={currentPrice}
        imgUrl={imgUrl}
        name={draftName}
        quantity={quantity || 0}
        onQuantityChange={onQuantityChange || undefined}
        timesRequiredInRecipes={timesRequiredInRecipes}
      />
      {isEditing && onNameChange
        ? <input type="text" value={draftName} onChange={(event) => handleNameChange(event.target.value)}/>
        : <span>{draftName}</span>
      }
      <input
        type="number"
        name="currentPrice"
        onChange={(event) => handlePriceChange(event.target.value)}
        onBlur={update}
        value={draftPrice}/>
    </StyledResource>
  )

  function handlePriceChange(newPrice: string) {
    setDraftPrice(parseInt(newPrice));
  }

  function handleNameChange(newName: string) {
    setDraftName(newName);
    if (onNameChange) {
      onNameChange(newName);
    }
  }

  function addOneSoldByTen() {
    setProduct({
      ...product,
      soldByTen: product.soldByTen + 1,
    })
  }

  function addOneSoldByHundred() {
    setProduct({
      ...product,
      soldByHundred: product.soldByHundred + 1,
    })
  }


  function onUpdate() {

    if (!isInitialized) {
      setInitialisationState(true);
    }

    if (isMounted && isInitialized) {
      save();
    }

    return () => {
      isMounted = false;
    }
  }

  function setWantedState(event: ChangeEvent<HTMLInputElement>) {
    setProduct({
      ...product,
      [event.target.name]: event.target.checked,
    })
  }

  function update(event: ChangeEvent<HTMLInputElement>) {
    setProduct({
      ...product,
      [event.target.name]: event.target.value,
    })
  }

  async function save() {
    await postOnServer('/resources/update/' + _id, {
      currentPrice: product.currentPrice,
      soldByTen: product.soldByTen,
      soldByHundred: product.soldByHundred,
      isWantedForTen: product.isWantedForTen,
      isWantedForHundred: product.isWantedForHundred,
    });
  }
}