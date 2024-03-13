import { ResourceProps } from "./types";
import { StyledResource } from "./styles";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Resource as ResourceType } from "../../../types/Resource";
import { postOnServer } from "../../../services/server";
import ClickableResource from "../ClickableResource/ClickableResource";

Resource.defaultProps = {
  data: null,
  isEditing: false,
};
export default function Resource(props: ResourceProps) {
  const { data, isEditing, quantity, onNameChange, onQuantityChange } = props;
  const [product, setProduct] = useState<ResourceType>(data);
  const { _id, imgUrl, name, currentPrice, timesRequiredInRecipes } = product;
  const [isInitialized, setInitialisationState] = useState<boolean>(false);

  const [draftName, setDraftName] = useState(name);
  const [draftPrice, setDraftPrice] = useState(currentPrice);

  const priceRef = useRef(currentPrice);

  let isMounted = true;

  useEffect(onUpdate, [product]);

  // Add an event listener to rise price of +20% if +, -20% if -
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "+") {
        priceRef.current = Math.round(priceRef.current * 1.2);
        setDraftPrice(priceRef.current);
      } else if (event.key === "-") {
        priceRef.current = Math.round(priceRef.current * 0.8);
        setDraftPrice(priceRef.current);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  /**
   * If the user press a specific key, append some '0' to the price
   * If key = W, append 00 to the price
   * If key = X, append 000 to the price
   * If key = C, append 0000 to the price
   * If key = V, append 00000 to the price
   * @param event
   */
  const appendDigits = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "w") {
      setDraftPrice(draftPrice * 100);
    } else if (event.key === "x") {
      setDraftPrice(draftPrice * 1000);
    } else if (event.key === "c") {
      setDraftPrice(draftPrice * 10000);
    } else if (event.key === "v") {
      setDraftPrice(draftPrice * 100000);
    }
  };

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
      {isEditing && onNameChange ? (
        <>
          <input
            type="number"
            defaultValue={quantity}
            onBlur={(event) =>
              onQuantityChange
                ? onQuantityChange(parseInt(event.target.value, 10))
                : null
            }
          />
          <input
            type="text"
            value={draftName}
            onChange={(event) => handleNameChange(event.target.value)}
          />
        </>
      ) : (
        <span>{draftName}</span>
      )}
      <input
        title="+ pour augmenter de 20%, - pour diminuer de 20%"
        type="number"
        name="currentPrice"
        onChange={(event) => handlePriceChange(event.target.value)}
        onBlur={update}
        value={draftPrice}
        onKeyDown={appendDigits}
      />
    </StyledResource>
  );

  function handlePriceChange(newPrice: string) {
    setDraftPrice(parseInt(newPrice));
  }

  function handleNameChange(newName: string) {
    setDraftName(newName);
    if (onNameChange) {
      onNameChange(newName);
    }
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
    };
  }

  function update(event: ChangeEvent<HTMLInputElement>) {
    setProduct({
      ...product,
      [event.target.name]: event.target.value,
    });
  }

  async function save() {
    await postOnServer("/resources/update/" + _id, {
      currentPrice: product.currentPrice,
      soldByTen: product.soldByTen,
      soldByHundred: product.soldByHundred,
      isWantedForTen: product.isWantedForTen,
      isWantedForHundred: product.isWantedForHundred,
    });
  }
}
