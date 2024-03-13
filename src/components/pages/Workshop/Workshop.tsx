import { Autocomplete, TextField } from "@mui/material";
import { Component } from "../../../types/Gear";
import Resource from "../../molecules/Resource/Resource";
import { useResourcesContext } from "../../../contexts/RessourcesContext";
import { useState } from "react";
import { postOnServer } from "../../../services/server";

type draftComponent = {
  name: string;
  quantity: number;
};

type GearFormValue = Pick<
  Gear,
  "name" | "craftingPrice" | "currentPrice" | "recipe"
>;

function GearForm() {
  const { allResources } = useResourcesContext();

  const [draftComponentName, setDraftComponentName] = useState<string>("");
  const [draftQuantity, setDraftQuantity] = useState<number>(0);

  const [newGear, setGear] = useState<GearFormValue>({
    name: "",
    recipe: [],
    craftingPrice: 0,
    currentPrice: 0,
  });

  const allResourcesOptions = [
    ...new Set(
      allResources
        .map(({ name }) => name)
        .filter((name) => name !== "REMPLISSEZ çA DITES-DONC !")
    ),
  ];

  const setGearName = (newValue: string | null) => {
    if (newValue) {
      setGear({ ...newGear, name: newValue });
    }
  };

  const addNewGear = () => {
    postOnServer("gears", newGear)
      .then((response) => {
        console.log(response);

        setGear({
          name: "",
          recipe: [],
          craftingPrice: 0,
          currentPrice: 0,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const addComponentToGear = () => {
    const component = allResources.find(
      ({ name }) => name === draftComponentName
    );

    if (!component) {
      return;
    }

    const newComponent: Component = {
      ...component,
      quantity: draftQuantity,
      isEmpty: false,
    };

    setGear({
      ...newGear,
      recipe: [...newGear.recipe, newComponent],
    });

    setDraftComponentName("");
    setDraftQuantity(0);
  };

  const removeComponent = (component: Component) => {
    setGear({
      ...newGear,
      recipe: newGear.recipe.filter(
        (componentInRecipe) => componentInRecipe.name !== component.name
      ),
    });
  };

  return (
    <div>
      <Autocomplete
        defaultValue={newGear.name || ""}
        onChange={(_, newValue: string | null) => {
          setGearName(newValue);
        }}
        id={`controllable-states-demo-${newGear.name}`}
        options={allResourcesOptions}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Objet" />}
      />
      <div>
        {newGear.recipe.map((component, index) => (
          <>
            <Resource
              key={index}
              data={component}
              quantity={component.quantity}
            />
            <button onClick={() => removeComponent(component)}>Remove</button>
          </>
        ))}
      </div>

      {newGear.name && (
        <>
          <Autocomplete
            autoHighlight={true}
            onChange={(_, newValue: string | null) => {
              setDraftComponentName(newValue || "");
            }}
            id={`controllable-states-demo-${newGear.name}`}
            options={allResourcesOptions}
            sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField {...params} label="Composant" />
            )}
          />
          <TextField
            id="outlined-number"
            label="Quantité"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            value={draftQuantity}
            onChange={(event) => {
              setDraftQuantity(parseInt(event.target.value));
            }}
          />
          <button onClick={addComponentToGear}>Add component</button>

          <button onClick={addNewGear}>Ajouter</button>
        </>
      )}
    </div>
  );
}

export const Workshop = () => {
  return (
    <div>
      <a href="http://localhost:4001/gears/fill/images">Gears</a>
      <a href="http://localhost:4001/resources/fill/images">Resources</a>
      <h1>Workshop</h1>
      <GearForm />
    </div>
  );
};
