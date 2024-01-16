import { Component } from "../../../types/Gear";
import Resource from "../../molecules/Resource/Resource";
import { useDraftItem } from "./useDraftItem";

export const Workshop = () => {
  const {
    setName,
    recipe,
    save,
    setComponentName,
    setComponentQuantity,
    appendComponentToRecipe,
    isValid,
  } = useDraftItem();
  return (
    <div>
      <a href="http://localhost:4001/gears/fill/images">Gears</a>
      <a href="http://localhost:4001/resources/fill/images">Resources</a>
      <h1>Workshop</h1>
      <h3>Créer un nouvel objet</h3>
      <input
        type="text"
        name="name"
        id="name"
        placeholder="Nom de l'objet"
        onChange={(e) => setName(e.target.value)}
      />
      <h4>Recette</h4>
      {recipe.map((item) => (
        <Resource
          key={item._id}
          data={item as Component}
          isEditing={true}
          quantity={item.quantity}
        />
      ))}
      <div>
        <input
          type="text"
          placeholder="composant"
          onChange={(e) => setComponentName(e.target.value)}
        />
        <input
          type="number"
          placeholder="1"
          onChange={(e) => setComponentQuantity(parseInt(e.target.value, 10))}
        />
        <button type="submit" onClick={appendComponentToRecipe}>
          +
        </button>
      </div>
      <button onClick={save} disabled={!isValid()}>
        Valider
      </button>
    </div>
  );
};
