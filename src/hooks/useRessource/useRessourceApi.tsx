/**
 * This hook is used to fetch and post data to the API
 */

import { postOnServer } from "../../services/server";
import { Resource } from "../../types/Resource";

export const useResourcesApi = () => {
  // useQuery to post data to the API
  const createNewResource = async (ressource: Partial<Resource>) => {
    const { name } = ressource;
    if (!name) {
      throw new Error("Missing name for component" + JSON.stringify(ressource));
    }
    return await postOnServer("/resources/", ressource)
      .then((response) => {
        const createdResource = response.data.resource;
        if (!createdResource.name) {
          throw new Error(
            "Missing name for component" + JSON.stringify(createdResource)
          );
        }
        return createdResource;
      })
      .catch((error) => {
        throw new Error(error);
      });
  };
  return {
    createNewResource,
  };
};
