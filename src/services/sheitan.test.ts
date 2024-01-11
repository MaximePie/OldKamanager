import { Component } from "../types/Gear";
import { isSheitan } from "./sheitan";

describe("isSheitan", () => {
  it("should return true if the item is in the sheitanItems array", () => {
    const item = { name: "Fer" } as Component;
    const result = isSheitan(item);

    expect(result).toBe(true);
  });

  it("should return false if the item is not in the sheitanItems array", () => {
    const item = { name: "Item4" } as Component;
    const result = isSheitan(item);
    expect(result).toBe(false);
  });
});
