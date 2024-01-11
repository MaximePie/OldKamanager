import { renderHook } from "@testing-library/react-hooks";
import { useResourcesApi } from "../useRessourceApi";
import { postOnServer } from "../../../services/server";

jest.mock("../../services/server", () => ({
  postOnServer: jest.fn(),
}));

describe("useResourcesApi", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new resource", async () => {
    const { result } = renderHook(() => useResourcesApi());
    const { createNewResource } = result.current;

    const resource = { name: "Test Resource" };
    const expectedResponse = { id: 1, name: "Test Resource" };

    postOnServer.mockResolvedValue(expectedResponse);

    const response = await createNewResource(resource);

    expect(postOnServer).toHaveBeenCalledWith("/resource/", resource);
    expect(response).toEqual(expectedResponse);
  });

  it("should throw an error if name is missing", async () => {
    const { result } = renderHook(() => useResourcesApi());
    const { createNewResource } = result.current;

    const resource = { name: "" };

    await expect(createNewResource(resource)).rejects.toThrow(
      "Missing name for component"
    );
  });
});
