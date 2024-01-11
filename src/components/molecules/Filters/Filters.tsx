import {
  Field as TextField,
  StyledFilters,
  Control as FormControl,
  Group as FormGroup,
} from "./styles";
import { useContext } from "react";
import { FilterContext } from "../../../contexts/FilterContext";
import {
  Button,
  Checkbox,
  FormControlLabel,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import { FiltersProps } from "./types";
import bijoutierImage from "../../../images/bijoutier.png";
import sculpteurImage from "../../../images/sculpteur.png";
import forgeronImage from "../../../images/forgeron.png";
import tailleurImage from "../../../images/tailleur.png";
import cordonnierImage from "../../../images/cordonnier.png";
import trashImage from "../../../images/trash.png";
import { availableTypes } from "../../../services/geartypes";
import styles from "./styles.module.scss";

export default function Filters(props: FiltersProps) {
  const { isGearsPage } = props;
  const {
    updateSearch,
    updateDisplayedAmount,
    updateTypes,
    updatePricelessState,
    updateMinLevel,
    updateMaxLevel,
    updateShopOnlyState,
    updateInventoryOnlyState,
    updateHideToBeCraftedState,
    updateToBeCraftedState,
    updateWishListState,
    updateOldPricesDisplayState,
    updateFreeTierContentDisplayState,
    updateToSellItemsDisplayState,
    updateMinCurrentPrice,
    filters,
  } = useContext(FilterContext);

  const {
    isInShopHidden,
    isPricelessOnly,
    search,
    types,
    minCurrentPrice,
    minLevel,
    maxLevel,
    limit,
    isInInventory,
    shouldHideToBeCrafted,
    shouldShowToBeCraftedOnly,
    shouldDisplayOldPrices,
    shouldDisplayWishlist,
    shouldDisplayFreeTierContent,
    shouldDisplayToSellItemsOnly,
  } = filters;

  return (
    <StyledFilters>
      <FormControl className={styles.FormControl}>
        {isGearsPage && (
          <Button
            className={styles.FormatButton}
            onClick={formatSearchForQuery}
            title="Retire les [] et sépare les objets par des virgules. [a][b] => a,b"
          >
            🪄
          </Button>
        )}
        <TextField
          id="standard-basic"
          label="Rechercher ..."
          variant="outlined"
          onChange={(event) => updateSearch(event.target.value)}
          value={search}
        />

        {isGearsPage && (
          // MaxPrice Textfield
          <TextField
            id="standard-basic"
            label="Prix Min"
            variant="outlined"
            onChange={(event) =>
              updateMinCurrentPrice(parseInt(event.target.value))
            }
            value={minCurrentPrice}
          />
        )}
      </FormControl>

      <FormControl>
        <InputLabel id="demo-simple-select-label">Limite</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="amount"
          value={limit}
          label="Limite"
          onChange={(event) => onLimitSelect(event.target.value)}
        >
          <MenuItem value={1}>1</MenuItem>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={25}>25</MenuItem>
          <MenuItem value={50}>50</MenuItem>
          <MenuItem value={100}>100</MenuItem>
          <MenuItem value={200}>200</MenuItem>
          <MenuItem value={500}>500</MenuItem>
        </Select>
      </FormControl>

      {isGearsPage && (
        <>
          <FormControl sx={{ m: 1, width: 120 }}>
            <TextField
              id="standard-basic"
              label="Niveau min"
              variant="outlined"
              onChange={(event) => updateMinLevel(parseInt(event.target.value))}
              value={minLevel}
            />
          </FormControl>

          <FormControl sx={{ m: 1, width: 120 }}>
            <TextField
              id="standard-basic"
              label="Niveau max"
              variant="outlined"
              onChange={(event) => updateMaxLevel(parseInt(event.target.value))}
              value={maxLevel}
            />
          </FormControl>
          <FormControl sx={{ m: 1, width: 120 }} className={styles.Types}>
            <InputLabel id="demo-multiple-name-label">Catégorie</InputLabel>
            <span className={styles.Jobs}>
              <img
                src={bijoutierImage}
                className={styles.job}
                alt="bijoutier"
                onClick={() => onTypesChange(["Amulette", "Anneau"])}
              />
              <img
                src={sculpteurImage}
                className={styles.job}
                alt="sculpteur"
                onClick={() => onTypesChange(["Baguette", "Bâton", "Arc"])}
              />
              <img
                src={forgeronImage}
                className={styles.job}
                alt="forgeron"
                onClick={() =>
                  onTypesChange([
                    "Épée",
                    "Dague",
                    "Marteau",
                    "Pelle",
                    "Hache",
                    "Pioche",
                    "Faux",
                  ])
                }
              />
              <img
                src={tailleurImage}
                className={styles.job}
                alt="tailleur"
                onClick={() => onTypesChange(["Chapeau", "Cape", "Sac à dos"])}
              />
              <img
                src={cordonnierImage}
                className={styles.job}
                alt="cordonnier"
                onClick={() => onTypesChange(["Bottes", "Ceinture"])}
              />
              <img
                src={trashImage}
                className={styles.job}
                alt="trashImage"
                onClick={() => onTypesChange([])}
              />
            </span>
            <Select
              labelId="demo-multiple-name-label"
              id="demo-multiple-name"
              multiple
              value={types}
              onChange={(event) => onTypesChange(event.target.value)}
              input={<OutlinedInput label="Types" />}
            >
              {availableTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isPricelessOnly}
                  onChange={(event) =>
                    updatePricelessState(event.target.checked)
                  }
                />
              }
              label="Pas encore de prix"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={shouldDisplayWishlist}
                  onChange={(event) =>
                    updateWishListState(event.target.checked)
                  }
                />
              }
              label="Wishlist"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={isInShopHidden}
                  onChange={(event) =>
                    updateShopOnlyState(event.target.checked)
                  }
                />
              }
              label="Cacher les objets en vente"
            />
          </FormGroup>

          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isInInventory}
                  onChange={(event) =>
                    updateInventoryOnlyState(event.target.checked)
                  }
                />
              }
              label="à vendre"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={shouldHideToBeCrafted}
                  onChange={(event) =>
                    updateHideToBeCraftedState(event.target.checked)
                  }
                />
              }
              label="Trouver des items à crafter"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={shouldDisplayToSellItemsOnly}
                  onChange={(event) =>
                    updateToSellItemsDisplayState(event.target.checked)
                  }
                />
              }
              label="Objets en vente"
            />
          </FormGroup>

          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={shouldShowToBeCraftedOnly}
                  onChange={(event) =>
                    updateToBeCraftedState(event.target.checked)
                  }
                />
              }
              label="Crafter"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={shouldDisplayFreeTierContent}
                  onChange={(event) =>
                    updateFreeTierContentDisplayState(event.target.checked)
                  }
                />
              }
              label="Non abonné"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={shouldDisplayOldPrices}
                  onChange={(event) =>
                    updateOldPricesDisplayState(event.target.checked)
                  }
                />
              }
              label="Anciens prix"
            />
          </FormGroup>
        </>
      )}
    </StyledFilters>
  );

  /**
   * Remove the [ and ] from the search string, replace closing bracket by a comma
   * Trim ending spaces and remove last comma
   * @returns {string}
   */
  function formatSearchForQuery() {
    let formattedSearch = search
      .replaceAll("[", "")
      .replaceAll("]", ",")
      .trimEnd();

    if (formattedSearch.endsWith(",")) {
      formattedSearch = formattedSearch.slice(0, -1);
    }

    updateSearch(formattedSearch);
  }

  function onTypesChange(values: string | string[]) {
    const newValues = typeof values === "string" ? [values] : values;
    updateTypes(newValues);
  }

  function onLimitSelect(value: string | number) {
    const newLimit = typeof value === "string" ? parseInt(value) : value;
    updateDisplayedAmount(newLimit);
  }
}
