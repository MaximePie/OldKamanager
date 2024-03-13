/**
 * Fetch all ressources and keep it in context
 */

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";

import { Resource as ResourceType } from "../types/Resource";
import { getFromServer, postOnServer } from "../services/server";
import { FilterContext } from "./FilterContext";

type ResourcesContext = {
  resources: ResourceType[];
  filteredResources: ResourceType[];
  isLoading: boolean;
  findResourceFromName: (name: string) => ResourceType | undefined;
  page: number;
  allResources: ResourceType[];
  setPage: (page: number) => void;
  updateResourcePrice: (resource: string, newPrice: number) => void;
};

const ResourcesContext = createContext({} as ResourcesContext);

type ProviderProps = {
  children: React.ReactNode;
};

export const ResourcesProvider = ({ children }: ProviderProps) => {
  const { filters } = useContext(FilterContext);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 1;
  const { data, isLoading, refetch } = useQuery<ResourceType[]>({
    queryKey: ["resources"],
    queryFn: fetchResources,
    refetchOnWindowFocus: false,
    enabled: false,
  });
  const resources = useMemo(() => {
    return formattedResources();
  }, [data]);

  const filteredResources = useMemo(() => {
    return formattedResources();
  }, [data, filters.search]);
  const slicedResources = filteredResources
    .slice((currentPage - 1) * pageSize, currentPage * pageSize)
    .slice(0, pageSize);

  useEffect(() => {
    refetch();
  }, [refetch]);

  async function fetchResources() {
    return getFromServer("/resources").then((response) => response.data);
  }

  /**
   * Update the ressource price on the server
   * @param resource The resource to update
   * @param newPrice The new price
   */
  const updateResourcePrice = async (resource: string, newPrice: number) => {
    const resourceToUpdate = resources.find(({ name }) => name === resource);
    if (!resourceToUpdate) {
      return;
    }
    console.log(resourceToUpdate.currentPrice, newPrice);
    if (resourceToUpdate.currentPrice !== newPrice) {
      await postOnServer(`/resources/update/${resourceToUpdate._id}`, {
        currentPrice: newPrice,
      });
    }
  };

  function formattedResources(): ResourceType[] {
    const { search, shouldDisplayOldPrices } = filters;
    if (!data) {
      return [];
    }

    let resources = data;

    if (shouldDisplayOldPrices) {
      // Return only the resources that have old prices (priceUpdatedAt > 7 days)
      resources = data.filter(({ priceUpdatedAt }) => {
        const date = new Date(priceUpdatedAt);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return diffDays > 7;
      });
    }

    resources = resources.filter(({ name }) =>
      flattenedSearch(name).includes(flattenedSearch(search))
    );
    return resources.sort((resource1) =>
      resource1.isWantedForTen || resource1.isWantedForHundred ? -1 : 1
    );
  }

  function flattenedSearch(string: string) {
    if (!string) {
      return "";
    }
    return string
      .toLowerCase()
      .replaceAll("é", "e")
      .replaceAll("è", "e")
      .replaceAll("ë", "e")
      .replaceAll("à", "a")
      .replaceAll("â", "a")
      .replaceAll("ù", "ù")
      .replaceAll("û", "û");
  }
  const findResourceFromName = (name: string) => {
    return resources.find((resource) => resource.name === name);
  };

  const value = {
    resources: slicedResources,
    filteredResources,
    isLoading,
    allResources: resources,
    page: currentPage,
    setPage: setCurrentPage,
    findResourceFromName,
    updateResourcePrice,
  };

  return (
    <ResourcesContext.Provider value={value}>
      {children}
    </ResourcesContext.Provider>
  );
};

export const useResourcesContext = () => useContext(ResourcesContext);
