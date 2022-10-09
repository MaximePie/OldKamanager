import {RecipeFormProps} from "./types";
import RecipeFormDisplay from "./RecipeFormDisplay";

export default function RecipeForm(props: RecipeFormProps) {
  const {recipe, onClose, onNameUpdate, name, onComponentQuantityUpdate} = props;

  return (
    <RecipeFormDisplay
      recipe={recipe}
      onClose={onClose}
      onNameUpdate={onNameUpdate}
      name={name}
      onComponentQuantityUpdate={onComponentQuantityUpdate}
    />
  )
}