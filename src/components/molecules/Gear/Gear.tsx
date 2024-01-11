import { GearPriceRequest, GearProps } from "./types";

import {
  StyledGear,
  Image,
  ComponentImage,
  Recipe,
  ComponentAmount,
  Name,
  Component,
  StyledButton as Button,
  Price,
  PriceInput,
  StyledChart as Chart,
  PricesActions,
  PendingPriceIcon,
  SaleButton,
  SoldButton,
} from "./styles";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  Component as ComponentType,
  Gear as GearType,
} from "../../../types/Gear";
import {
  getFromServer,
  postOnServer,
  putOnServer,
} from "../../../services/server";
import RecipeForm from "../RecipeForm/RecipeForm";
import { copyToClipboard } from "../../../services/clipboard";
import { playSuccessSound } from "../../../services/sounds";
import { useQuery, useQueryClient } from "react-query";
import { GearPrice } from "../../../types/GearPrice";
import { hasBeenRecentlyUpdated } from "../../../services/gears";
import { useResourcesContext } from "../../../contexts/RessourcesContext";
import { isFreeTier } from "../../pages/Gears/Gears";
import styles from "./Gear.module.scss";
import { OutdatedInput } from "../../atoms/OutdatedInput";
import { Earnings } from "../../atoms/Earnings";
import { useResourcesApi } from "../../../hooks/useRessource/useRessourceApi";

export default function Gear(props: GearProps) {
  const { data, afterUpdate } = props;
  const [product, setProduct] = useState<GearType>(data);
  const [draftProduct, setDraftProduct] = useState<GearType>(product);
  const { findResourceFromName } = useResourcesContext();
  const { data: priceData, refetch } = useQuery<GearPriceRequest>(
    `gearPrices/${product._id}`,
    fetchPrices,
    {
      refetchOnWindowFocus: false,
      enabled: false,
    }
  );

  const { ratio, craftingPrice } = data;

  const queryClient = useQueryClient();

  const {
    _id,
    name,
    currentPrice,
    sold,
    level,
    recipe,
    isInInventory,
    onWishList,
    toBeCrafted,
    isInMarket,
    lastPriceUpdatedAt,
    brisage,
  } = draftProduct;
  const [isInitialized, setInitialisationState] = useState<boolean>(false);

  const [isRecipeModalOpen, setRecipeModalState] = useState(false);

  const { createNewResource } = useResourcesApi();

  const [draftPrice, setDraftPrice] = useState<number | "">(
    currentPrice === 0 ? "" : currentPrice
  );

  const [shouldPricesBeDisplayed, setPricesDisplayState] = useState(false);
  let showPricesInterval: number | undefined = undefined;

  let isMounted = true;
  let gearPrices = undefined;

  useEffect(onUpdate, [draftProduct]);
  useEffect(onUpdateAfterRefetch, [data]);

  const isGearFreeTier = useMemo(() => {
    return isFreeTier(product);
  }, [product]);

  gearPrices = useMemo(() => {
    if (!priceData?.prices) return undefined;
    return {
      options: {
        chart: {
          type: "line",
          animations: {
            speed: 400,
          },
        },
        stroke: {
          curve: "smooth",
        },
        xaxis: {
          categories: [],
        },
      },
      series: [
        {
          name: "",
          data: priceData.prices?.map(({ price }: GearPrice) => price),
        },
        {
          name: "",
          data: priceData.prices?.map(
            ({ craftingPrice }: GearPrice) => craftingPrice
          ),
        },
      ],
    };
  }, [priceData?.prices]);
  return (
    <StyledGear>
      {isRecipeModalOpen && (
        <RecipeForm
          name={name}
          recipe={recipe}
          onClose={closeModal}
          onNameUpdate={onComponentNameUpdate}
          onComponentQuantityUpdate={onComponentQuantityUpdate}
          onComponentAdd={addComponent}
        />
      )}
      <SaleButton
        title="Décoche 'possédé', 'coche 'en vente'"
        onClick={setToSale}
      >
        ⏳
      </SaleButton>
      {isInMarket && (
        <SoldButton
          title="Décoche 'en vente', vend un objet et rachète"
          onClick={setSold}
        >
          💰
        </SoldButton>
      )}
      <Image src={""} alt={"icon"} referrerPolicy="no-referrer" />
      <Name
        onClick={() => copyToClipboard(name)}
        onMouseEnter={() => showPrices()}
        onMouseLeave={() => hidePrices()}
      >
        {name}
        {shouldPricesBeDisplayed &&
          priceData?.prices.length !== 0 &&
          gearPrices && (
            <Chart
              options={gearPrices.options}
              series={gearPrices.series}
              width="300"
              type="line"
            />
          )}
      </Name>
      <OutdatedInput
        name="brisage"
        value={brisage.ratio}
        onChange={(event) => updateBrisage(parseInt(event.target.value, 10))}
        lastModifiedDate={brisage.lastModifiedDate}
      />
      <span>
        {level} {!isGearFreeTier ? "⚠️" : ""}
      </span>
      <span>
        <Button onClick={addOneFailed}>-</Button>
        {sold}
        <Button onClick={addOneSold}>+</Button>
      </span>
      <input
        type="checkbox"
        name="isInMarket"
        onChange={setInMarketState}
        checked={isInMarket}
      />
      <input
        type="checkbox"
        name="isInInventory"
        onChange={setWishedState}
        checked={isInInventory}
      />
      <input
        type="number"
        name="toBeCrafted"
        value={toBeCrafted}
        onChange={(event) => updateCraftList(parseInt(event.target.value, 10))}
      />
      <input
        type="number"
        name="onWishList"
        value={onWishList}
        onChange={(event) =>
          updateWaitingList(parseInt(event.target.value, 10))
        }
      />
      <Price>
        {!hasBeenRecentlyUpdated(lastPriceUpdatedAt) && <PendingPriceIcon />}
        <PriceInput
          type="number"
          name="currentPrice"
          onChange={onDraftPriceChange}
          onKeyDown={onRoundKeyPress}
          onBlur={update}
          value={draftPrice}
          shouldBeUpdated={isOlderThanOneMonth(lastPriceUpdatedAt)}
        />
        <PricesActions>
          <Button onClick={lowerPrice}>-20%</Button>
          <Button onClick={increasePrice}>+20%</Button>
        </PricesActions>
      </Price>
      <span className={styles.craftingPrice}>
        <span>{craftingPrice.toLocaleString("FR-fr")}k</span>
        <Earnings craftingPrice={craftingPrice} currentPrice={currentPrice} />
      </span>
      <span>
        {Math.round(ratio * 100)}% {ratio < 1 ? "🔻" : ""}
      </span>
      <Recipe onClick={openRecipeModal}>
        {recipe.map(({ _id, name, imgUrl, quantity, isEmpty }) => (
          <Component key={_id} title={name} isEmpty={isEmpty} isTooHigh={false}>
            <ComponentImage src={""} referrerPolicy="no-referrer" />
            <ComponentAmount>{quantity}</ComponentAmount>
          </Component>
        ))}
      </Recipe>
    </StyledGear>
  );

  /**
   * Uncheck 'isInMarket', add 1 to sold quantity and add 1 to 'toBeCrafted'
   */
  function setSold() {
    setDraftProduct({
      ...draftProduct,
      sold: sold + 1,
      isInMarket: false,
      toBeCrafted: toBeCrafted + 1,
    });
    playSuccessSound();
  }

  /**
   * Uncheck 'isInInventory' and check 'isInMarket'
   * Triggers when we click on the 'sale' button
   */
  function setToSale() {
    setDraftProduct({
      ...draftProduct,
      isInInventory: false,
      isInMarket: true,
    });
  }

  function showPrices() {
    showPricesInterval = window.setTimeout(() => {
      refetch();
      setPricesDisplayState(true);
    }, 1000);
  }

  function hidePrices() {
    window.clearTimeout(showPricesInterval);
    setPricesDisplayState(false);
  }

  function lowerPrice() {
    const newPrice = Math.round(
      (typeof draftPrice === "string" ? parseInt(draftPrice) : draftPrice) * 0.8
    );
    setDraftPrice(newPrice);
    setDraftProduct({
      ...draftProduct,
      currentPrice: newPrice,
    });
  }

  function increasePrice() {
    const newPrice = Math.round(
      (typeof draftPrice === "string" ? parseInt(draftPrice) : draftPrice) * 1.2
    );
    setDraftPrice(newPrice);
    setDraftProduct({
      ...draftProduct,
      currentPrice: newPrice,
    });
  }

  function onUpdateAfterRefetch() {
    setProduct(data);
  }

  /**
   * Change the price of the gear with the following instructions:
   * If the key is x, multiply the draft price by 1000, then remove 20
   * @param event
   */
  function onRoundKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "x") {
      setDraftPrice((draftPrice) => (draftPrice || 0) * 1000 - 20);
    }
  }

  function onDraftPriceChange(event: ChangeEvent<HTMLInputElement>) {
    console.log(event);

    const newPrice = event.target.value;
    setDraftPrice(parseInt(newPrice));
  }

  function onComponentNameUpdate(item: ComponentType, newName: string) {
    const updatedRecipes = [...recipe].map((component) => {
      if (component.name !== item.name) {
        return component;
      } else {
        return {
          ...component,
          name: newName,
        };
      }
    });

    setDraftProduct({
      ...draftProduct,
      recipe: updatedRecipes,
    });
  }

  function onComponentQuantityUpdate(item: ComponentType, newQuantity: number) {
    const updatedRecipes = [...recipe].map((component) => {
      if (component.name !== item.name) {
        return component;
      } else {
        return {
          ...component,
          quantity: newQuantity,
        };
      }
    });

    // Remove duplicate components
    const uniqueComponents = updatedRecipes.reduce((accumulator, component) => {
      const index = accumulator.findIndex(
        ({ name }) => name === component.name
      );
      if (index === -1) {
        accumulator.push(component);
      } else {
        accumulator[index].quantity += component.quantity;
      }
      return accumulator;
    }, [] as ComponentType[]);

    // Remove components with quantity = 0
    const filteredComponents = uniqueComponents.filter(
      (component) => component.quantity !== 0
    );

    setDraftProduct({
      ...draftProduct,
      recipe: [...filteredComponents],
    });
  }

  /**
   * From the recipe, add a new component
   */
  async function addComponent(name: string, quantity = 1) {
    let component = findResourceFromName(name);
    let shouldCreateNewComponent = false;
    if (!component) {
      shouldCreateNewComponent = confirm(
        'Impossible de trouver la ressource "' +
          name +
          '"' +
          " dans la liste des ressources, voulez-vous l'ajouter ?"
      );
    }

    if (shouldCreateNewComponent) {
      component = await createNewResource({
        name,
      });
    }

    if (component) {
      const updatedRecipes: GearType["recipe"] = [
        ...recipe,
        {
          ...component,
          quantity,
          isEmpty: false,
        },
      ];
      setDraftProduct({
        ...draftProduct,
        recipe: updatedRecipes,
      });
    }
  }

  /**
   * Updates the brisage of the gear
   * @param brisage : number, the new brisage (%)
   */
  function updateBrisage(brisage: number) {
    setDraftProduct({
      ...draftProduct,
      brisage: {
        ratio: brisage,
        lastModifiedDate: new Date(),
      },
    });
  }

  function updateCraftList(toBeCrafted: number) {
    setDraftProduct({
      ...draftProduct,
      toBeCrafted,
    });
  }

  /**
   * Updates the amount of times the component is wished.
   * Hence, it will not appear on shopping list,
   * but still will be kept in memory (only for video production purpose)
   * @param onWishList : number, the amount of desired items
   */
  function updateWaitingList(onWishList: number) {
    setDraftProduct((draftProduct) => ({
      ...draftProduct,
      onWishList,
    }));
  }

  function openRecipeModal() {
    setRecipeModalState(true);
  }

  function closeModal() {
    setRecipeModalState(false);
    afterUpdate();
  }

  function addOneSold() {
    setDraftProduct({
      ...draftProduct,
      sold: draftProduct.sold + 1,
    });
  }

  async function addOneFailed() {
    await putOnServer(`/gears/fail/${_id}`, {}).then((response) => {
      const {
        data: { message },
      } = response;
      if (message === "ok") {
        playSuccessSound();
      }
    });
  }

  function setWishedState(event: ChangeEvent<HTMLInputElement>) {
    setDraftProduct({
      ...draftProduct,
      isInInventory: event.target.checked,
    });
  }

  function setInMarketState(event: ChangeEvent<HTMLInputElement>) {
    setDraftProduct({
      ...draftProduct,
      isInMarket: event.target.checked,
    });
  }

  function update(event: ChangeEvent<HTMLInputElement>) {
    let newCraftingPrice = recipe.reduce((accumulator, resource) => {
      return accumulator + resource?.currentPrice * resource.quantity || 0;
    }, 0);
    let ratio = currentPrice / newCraftingPrice;

    setDraftProduct({
      ...draftProduct,
      [event.target.name]: event.target.value,
      ratio,
      craftingPrice: newCraftingPrice,
    });
  }

  async function save() {
    await postOnServer("/gears/update/" + _id, { product: draftProduct });
  }

  function fetchPrices() {
    return getFromServer(`/gears/prices/${_id}`).then(
      (response) => response.data
    );
  }

  function onUpdate() {
    if (!isInitialized) {
      setInitialisationState(true);
    }

    if (isMounted && isInitialized) {
      save().then(() => {
        queryClient
          .invalidateQueries(`gearPrices/${product._id}`)
          .then(afterUpdate);
      });
    }

    return () => {
      isMounted = false;
    };
  }
}

/**
 * If the gear has been updated from longer than 1 month, the price should be updated
 * @param lastUpdatedAt
 */
export function isOlderThanOneMonth(lastUpdatedAt: Date) {
  const oneMonthInMilliseconds = 1000 * 60 * 60 * 24 * 30;
  return (
    Date.now() - new Date(lastUpdatedAt).getTime() > oneMonthInMilliseconds
  );
}
