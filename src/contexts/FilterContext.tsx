import {createContext, ReactNode, useEffect, useState} from "react";

type FiltersType = {
  isInShopHidden: boolean,
  isPricelessOnly: boolean,
  isInInventory: boolean,
  shouldHideToBeCrafted: boolean,
  shouldShowToBeCraftedOnly: boolean,
  shouldDisplayOldPrices: boolean,
  shouldDisplayWishlist: boolean,
  search: string,
  limit: number,
  types: string[],
  minLevel: number,
  maxLevel: number,
  minCurrentPrice: number,
}

const InitialFilter = {
  search: '',
  types: [] as string[],
  minLevel: 1,
  maxLevel: 200,
  limit: 10,
  isPricelessOnly: false,
  isInInventory: false,
  isInShopHidden: false,
  shouldHideToBeCrafted: false,
  shouldShowToBeCraftedOnly: false,
  shouldDisplayOldPrices: false,
  shouldDisplayWishlist: false,
  minCurrentPrice: 0,
}

const FilterContext = createContext({
  filters: InitialFilter,

  updateSearch: (value: string) => {},
  updateDisplayedAmount: (value: number) => {},
  updateMinLevel: (value: number) => {},
  updateMaxLevel: (value: number) => {},
  updateTypes: (values: string[]) => {},
  updatePricelessState: (shouldDisplayPricelessOnly: boolean) => {},
  updateShopOnlyState: (shouldHideShop: boolean) => {},
  updateInventoryOnlyState: (isInInventory: boolean) => {},
  updateHideToBeCraftedState: (shouldHideToBeCrafted: boolean) => {},
  updateToBeCraftedState: (shouldShowToBeCraftedOnly: boolean) => {},
  updateOldPricesDisplayState: (shouldDisplayOldPrices: boolean) => {},
  updateWishListState: (shouldDisplayWishlist: boolean) => {},
  updateMinCurrentPrice: (minCurrentPrice: number) => {},
});

type FilterContextProviderProps = {
  children: ReactNode,
}

export default function FilterContextProvider(props: FilterContextProviderProps) {
  const {children} = props;
  const [filters, setFilters] = useState<FiltersType>(InitialFilter);

  return (
    <FilterContext.Provider value={{
      updateSearch,
      updateDisplayedAmount: updateLimit,
      updateInventoryOnlyState,
      updateTypes,
      updateShopOnlyState,
      updatePricelessState,
      updateMinLevel,
      updateMaxLevel,
      updateMinCurrentPrice,
      updateHideToBeCraftedState,
      updateToBeCraftedState,
      updateOldPricesDisplayState,
      updateWishListState,
      filters,
    }}>
      {children}
    </FilterContext.Provider>
  )

  /**
   * Update the wishlist state, setting whether if we should only display items on waiting list,
   * but would not appear on the shopping list
   * @param shouldDisplayWishlist: boolean, whether we want to display only wishlist or not
   */
  function updateWishListState(shouldDisplayWishlist: boolean) {
    setFilters(filters => ({
      ...filters,
      shouldDisplayWishlist,
    }))
  }

  function updateOldPricesDisplayState(shouldDisplayOldPrices: boolean) {
    setFilters({
      ...filters,
      shouldDisplayOldPrices
    })
  }


  function updateToBeCraftedState(shouldShowToBeCraftedOnly: boolean) {
    setFilters({
      ...filters,
      shouldShowToBeCraftedOnly
    })
  }


  function updateMinCurrentPrice(minCurrentPrice: number) {
    setFilters({
      ...filters,
      minCurrentPrice: isNaN(minCurrentPrice) ? 0 : minCurrentPrice,
    })
  }

  function updateShopOnlyState(shouldHideShop: boolean) {
    setFilters({
      ...filters,
      isInShopHidden: shouldHideShop,
    })
  }


  function updateHideToBeCraftedState(shouldHideToBeCrafted: boolean) {
    setFilters({
      ...filters,
      shouldHideToBeCrafted,
    })
  }

  function updateInventoryOnlyState(isInInventory: boolean) {
    setFilters({
      ...filters,
      isInInventory,
    })
  }

  function updateMinLevel(level: number) {
    setFilters({
      ...filters,
      minLevel: isNaN(level) ? 0 : level
    });
  }

  function updateMaxLevel(level: number) {
    setFilters({
      ...filters,
      maxLevel: isNaN(level) || level > 200 ? 200 : level
    });
  }

  function updatePricelessState(isPricelessOnly: boolean) {
    setFilters({
      ...filters,
      isPricelessOnly
    });
  }

  function updateTypes(values: string[]): void {
    setFilters({
      ...filters,
      types: [...values]
    });
  }

  function updateLimit(value: number): void {
    setFilters({
      ...filters,
      limit: value,
    });
  }

  function updateSearch(value: string): void {
    /**
     * [a], [b], [c]
     * => a,b,c
     */
    const formattedValue = value
        .replaceAll('[', '')
        .replaceAll(']', ',')
        .replace(', ', ',');
    setFilters({
      ...filters,
      search: formattedValue
    });
  }
}

export {FilterContext};