import { renderHook, act } from "@testing-library/react-hooks";
import { useDraftItem } from "./useDraftItem";

describe("useDraftItem", () => {
  it("should initialize draftItem with default values", () => {
    const { result } = renderHook(() => useDraftItem());

    expect(result.current.draftItem).toEqual({ name: "", quantity: 0 });
  });

  it("should update draftItem when updateDraftItem is called", () => {
    const { result } = renderHook(() => useDraftItem());

    const newDraftItem = { name: "Item1", quantity: 5 };
    act(() => {
      result.current.updateDraftItem(newDraftItem);
    });

    expect(result.current.draftItem).toEqual(newDraftItem);
  });

  it("should update the name in draftItem when setName is called", () => {
    const { result } = renderHook(() => useDraftItem());

    const newName = "Item2";
    act(() => {
      result.current.setName(newName);
    });

    expect(result.current.draftItem.name).toEqual(newName);
  });

  it("should update the quantity in draftItem when setQuantity is called", () => {
    const { result } = renderHook(() => useDraftItem());

    const newQuantity = 10;
    act(() => {
      result.current.setQuantity(newQuantity);
    });

    expect(result.current.draftItem.quantity).toEqual(newQuantity);
  });

  it("should append draftItem to recipe when appendDraftToRecipe is called with a valid draftItem", () => {
    const { result } = renderHook(() => useDraftItem());

    const draftItem = { name: "Item3", quantity: 3 };

    act(() => {
      result.current.updateDraftItem(draftItem);
    });

    act(() => {
      result.current.appendDraftToRecipe();
    });

    expect(result.current.recipe).toEqual([draftItem]);
    expect(result.current.draftItem).toEqual({ name: "", quantity: 0 });
  });

  it("should throw an error when appendDraftToRecipe is called with a draftItem with no name", () => {
    const { result } = renderHook(() => useDraftItem());

    expect(() => {
      act(() => {
        result.current.appendDraftToRecipe();
      });
    }).toThrow("Cannot add an item with no name");
  });
});
