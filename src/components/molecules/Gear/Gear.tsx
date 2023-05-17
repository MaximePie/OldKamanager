import {GearPriceRequest, GearProps} from "./types";

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
  SoldButton
} from "./styles";
import {ChangeEvent, useEffect, useRef, useState} from "react";
import {Component as ComponentType, Gear as GearType} from "../../../types/Gear"
import {getFromServer, postOnServer, putOnServer} from "../../../services/server";
import RecipeForm from "../RecipeForm/RecipeForm";
import {copyToClipboard} from "../../../services/clipboard";
import {playSuccessSound} from "../../../services/sounds";
import {useQuery, useQueryClient} from "react-query";
import {GearPrice} from "../../../types/GearPrice";
import {hasBeenRecentlyUpdated} from "../../../services/gears";

export default function Gear(props: GearProps) {
  const {data, afterUpdate} = props;
  const [product, setProduct] = useState<GearType>(data);
  const [draftProduct, setDraftProduct] = useState<GearType>(product);
  const {data: priceData, refetch} = useQuery<GearPriceRequest>(`gearPrices/${product._id}`, fetchPrices, {
    refetchOnWindowFocus: false,
    enabled: false,
  })
  const queryClient = useQueryClient();

  const {
    _id,
    imgUrl,
    name,
    currentPrice,
    sold,
    level,
    recipe,
    craftingPrice,
    ratio,
    isInInventory,
    onWishList,
    toBeCrafted,
    isInMarket,
    lastPriceUpdatedAt
  } = draftProduct;
  const [isInitialized, setInitialisationState] = useState<boolean>(false);

  const [isRecipeModalOpen, setRecipeModalState] = useState(false);

  const [draftPrice, setDraftPrice] = useState<number | ''>(currentPrice === 0 ? '' : currentPrice);

  const [shouldPricesBeDisplayed, setPricesDisplayState] = useState(false);
  let showPricesInterval: number | undefined = undefined;

  let isMounted = true;
  let gearPrices = undefined;
  if (priceData?.prices) {
    gearPrices = {
      options: {
        chart: {
          type: "line",
          animations: {
            speed: 400,
          }
        },
        stroke: {
          curve: "smooth",
        },
        xaxis: {
          categories: []
        },
      },
      series: [
        {
          name: '',
          data: priceData.prices?.map(({price}: GearPrice) => price),
        },
        {
          name: '',
          data: priceData.prices?.map(({craftingPrice}: GearPrice) => craftingPrice),
        },
      ],
    }
  }

  useEffect(onUpdate, [draftProduct])
  useEffect(onUpdateAfterRefetch, [data]);

  return (
    <StyledGear>
      {isRecipeModalOpen &&
        <RecipeForm
          name={name}
          recipe={recipe}
          onClose={closeModal}
          onNameUpdate={onComponentNameUpdate}
          onComponentQuantityUpdate={onComponentQuantityUpdate}
        />
      }
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
      <Image src={imgUrl} alt={'icon'} referrerPolicy="no-referrer"/>
      <Name
        onClick={() => copyToClipboard(name)}
        onMouseEnter={() => showPrices()}
        onMouseLeave={() => hidePrices()}
      >
        {name}
        {shouldPricesBeDisplayed && priceData?.prices.length !== 0 && gearPrices && (
          <Chart
            options={gearPrices.options}
            series={gearPrices.series}
            width="300"
            type="line"
          />
        )}
      </Name>
      <span>{level}</span>
      <span>
        <Button onClick={addOneFailed}>-</Button>
        {sold}
        <Button onClick={addOneSold}>+</Button>
      </span>
      <input type="checkbox" name="isInMarket" onChange={setInMarketState} checked={isInMarket}/>
      <input type="checkbox" name="isInInventory" onChange={setWishedState} checked={isInInventory}/>
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
        onChange={(event) => updateWaitingList(parseInt(event.target.value, 10))}
      />
      <Price>
        {!hasBeenRecentlyUpdated(lastPriceUpdatedAt) && <PendingPriceIcon/>}
        <PriceInput
          type="number"
          name="currentPrice"
          onChange={(event) => onDraftPriceChange(event.target.value)}
          onBlur={update}
          value={draftPrice}
          shouldBeUpdated={shouldPriceBeUpdated(lastPriceUpdatedAt)}
        />
        <PricesActions>
          <Button onClick={lowerPrice}>-20%</Button>
          <Button onClick={increasePrice}>+20%</Button>
        </PricesActions>
      </Price>
      <span>{craftingPrice.toLocaleString('FR-fr')} k</span>
      <span>{Math.round(ratio * 100)}%</span>
      <Recipe onClick={openRecipeModal}>
        {recipe.map(({_id, name, imgUrl, quantity, isEmpty}) => (
          <Component key={_id} title={name} isEmpty={isEmpty} isTooHigh={false}>
            <ComponentImage src={imgUrl} referrerPolicy="no-referrer"/>
            <ComponentAmount>{quantity}</ComponentAmount>
          </Component>
        ))}
      </Recipe>
    </StyledGear>
  )

  /**
   * Uncheck 'isInMarket', add 1 to sold quantity and add 1 to 'toBeCrafted'
   */
  function setSold() {
    setDraftProduct({
      ...draftProduct,
      sold: sold + 1,
      isInMarket: false,
      toBeCrafted: toBeCrafted + 1,
    })
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
    })
  }

  /**
   * If the gear has been updated from longer than 1 month, the price should be updated
   * @param lastPriceUpdatedAt
   */
  function shouldPriceBeUpdated(lastPriceUpdatedAt: Date) {
    const oneMonthInMilliseconds = 1000 * 60 * 60 * 24 * 30;
    return Date.now() - new Date(lastPriceUpdatedAt).getTime() > oneMonthInMilliseconds;
  }

  function showPrices() {
    showPricesInterval  = window.setTimeout(() => {
      refetch();
      setPricesDisplayState(true);
    }, 1000);
  }

  function hidePrices() {
    window.clearTimeout(showPricesInterval);
    setPricesDisplayState(false);
  }

  function lowerPrice() {
    const newPrice = Math.round((typeof draftPrice === 'string' ? parseInt(draftPrice) : draftPrice) * 0.8)
    setDraftPrice(newPrice);
    setDraftProduct({
      ...draftProduct,
      currentPrice: newPrice
    })
  }


  function increasePrice() {
    const newPrice = Math.round((typeof draftPrice === 'string' ? parseInt(draftPrice) : draftPrice) * 1.2)
    setDraftPrice(newPrice);
    setDraftProduct({
      ...draftProduct,
      currentPrice: newPrice
    })
  }

  function onUpdateAfterRefetch() {
    setProduct(data);
  }

  function onDraftPriceChange(newPrice: string) {
    setDraftPrice(parseInt(newPrice));
  }

  function onComponentNameUpdate(item: ComponentType, newName: string) {
    const updatedRecipes = [...recipe].map(component => {
      if (component.name !== item.name) {
        return component
      } else {
        return {
          ...component,
          name: newName,
        }
      }
    })

    setDraftProduct({
      ...draftProduct,
      recipe: updatedRecipes,
    })
  }

  function onComponentQuantityUpdate(item: ComponentType, newQuantity: number) {
    const updatedRecipes = [...recipe].map(component => {
      if (component.name !== item.name) {
        return component
      } else {
        return {
          ...component,
          quantity: newQuantity,
        }
      }
    })

    setDraftProduct({
      ...draftProduct,
      recipe: updatedRecipes,
    })
  }

  function updateCraftList(toBeCrafted: number) {
    setDraftProduct({
      ...draftProduct,
      toBeCrafted,
    })
  }


  /**
   * Updates the amount of times the component is wished.
   * Hence, it will not appear on shopping list,
   * but still will be kept in memory (only for video production purpose)
   * @param onWishList : number, the amount of desired items
   */
  function updateWaitingList(onWishList: number) {
    setDraftProduct(draftProduct => ({
        ...draftProduct,
      onWishList
      })
    )
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
    })
  }

  async function addOneFailed() {
    await putOnServer(`/gears/fail/${_id}`, {}).then(response => {
      const {data: {message}} = response;
      if (message === 'ok') {
        playSuccessSound();
      }
    });
  }

  function setWishedState(event: ChangeEvent<HTMLInputElement>) {
    setDraftProduct({
      ...draftProduct,
      isInInventory: event.target.checked,
    })
  }

  function setInMarketState(event: ChangeEvent<HTMLInputElement>) {
    setDraftProduct({
      ...draftProduct,
      isInMarket: event.target.checked,
    })
  }

  function update(event: ChangeEvent<HTMLInputElement>) {

    let newCraftingPrice = recipe.reduce((accumulator, resource) => {
      return accumulator + resource?.currentPrice * resource.quantity || 0
    }, 0);
    let ratio = currentPrice / newCraftingPrice

    setDraftProduct({
      ...draftProduct,
      [event.target.name]: event.target.value,
      ratio,
      craftingPrice: newCraftingPrice
    })
  }


  async function save() {
    await postOnServer('/gears/update/' + _id, {product: draftProduct});
  }

  function fetchPrices() {
    return getFromServer(`/gears/prices/${_id}`).then(response => response.data);
  }


  function onUpdate() {

    if (!isInitialized) {
      setInitialisationState(true);
    }

    if (isMounted && isInitialized) {
      save().then(() => {
        queryClient.invalidateQueries(`gearPrices/${product._id}`).then(afterUpdate);
      });
    }

    return () => {
      isMounted = false;
    }
  }
}