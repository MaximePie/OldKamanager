import { Resource } from "../../../types/Resource";
type ResourceProps = {
  data: Resource;
  isEditing?: boolean;
  quantity?: number;
  onNameChange?: (newName: string) => void;
  onQuantityChange?: (newQuantity: number) => void;
};

type StyledResourceProps = {
  isEditing: ResourceProps["isEditing"];
};
export type { ResourceProps, StyledResourceProps };
