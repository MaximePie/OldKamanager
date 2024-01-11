import Resource from "../../molecules/Resource/Resource";
import { useDraftItem } from "./useDraftItem";

export const Workshop = () => {
  const { setName, appendDraftToRecipe, recipe } = useDraftItem();
  return (
    <div>
      <h1>Workshop</h1>
      <h3>Créer un nouvel objet</h3>
      <form>
        <h4>Recette</h4>
        {recipe.map((item) => (
          <Resource
            key={item._id}
            data={item}
            isEditing={true}
            quantity={item.quantity}
          />
        ))}
        <div>
          <input
            type="text"
            name="itemName"
            id="name"
            onChange={(e) => setName(e.target.value)}
            placeholder="Nom de l'objet"
          />
          <input type="number" name="quantity" id="quantity" placeholder="1" />
          <button onClick={appendDraftToRecipe}>+</button>
        </div>
        <button>Valider</button>
      </form>
    </div>
  );
};
