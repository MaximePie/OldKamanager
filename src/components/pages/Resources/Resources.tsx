import {Header, StyledRessources, StyledButton as Button} from "./styles";
import {useQuery} from "react-query";
import {Resource as ResourceType} from "../../../types/Resource"
import Resource from "../../molecules/Resource/Resource"

import {getFromServer} from "../../../services/server";
import {useContext, useEffect, useMemo, useState} from "react";
import {FilterContext} from "../../../contexts/FilterContext"
import Filters from "../../molecules/Filters/Filters";

export default function Resources() {
  const {filters} = useContext(FilterContext);
  const {data, isLoading, refetch} = useQuery<ResourceType[]>({
    queryKey: ['resources'],
    queryFn: fetchResources,
    refetchOnWindowFocus: false,
    enabled: false,
  })

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 1;

  const resources = useMemo(() => {
    return formattedResources();
  }, [data, filters.search])
  const slicedResources = resources.slice((currentPage - 1) * pageSize, currentPage * pageSize).slice(0, pageSize);

  useEffect(() => {
    refetch();
  }, [refetch])

  return (
    <>
      <Filters/>
      <div>
        <Button onClick={() => setCurrentPage(currentPage => currentPage - 1)}>
          &lt;
        </Button>
        <Button onClick={() => setCurrentPage(currentPage => currentPage + 1)}>
          &gt;
        </Button>
        <span>
          Page : {currentPage}
        </span>
      </div>
      <StyledRessources>
        <Header>
          <span>Image</span>
          <span>Nom</span>
          <span>Prix</span>
        </Header>
        {isLoading && <span>Chargement...</span>}
        {slicedResources.map((resource) => (
          <Resource key={resource._id} data={resource}/>
        ))}
      </StyledRessources>
    </>
  )

  async function fetchResources() {
    return getFromServer('/resources').then(response => response.data)
  }

  function formattedResources(): ResourceType[] {
    const {search, shouldDisplayOldPrices} = filters;
    if (!data) {
      return [];
    }

    let resources = data;

    if (shouldDisplayOldPrices) {
      // Return only the resources that have old prices (priceUpdatedAt > 7 days)
      resources = data.filter(({priceUpdatedAt}) => {
        const date = new Date(priceUpdatedAt);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return diffDays > 7;
      });
    }



    resources = resources.filter(({name}) => flattenedSearch(name).includes(flattenedSearch(search)));
    return resources.sort((resource1) => resource1.isWantedForTen || resource1.isWantedForHundred ? -1 : 1);
  }

  function flattenedSearch(string: string) {
    return string
      .toLowerCase()
      .replaceAll('é', 'e')
      .replaceAll('è', 'e')
      .replaceAll('ë', 'e')
      .replaceAll('à', 'a')
      .replaceAll('â', 'a')
      .replaceAll('ù', 'ù')
      .replaceAll('û', 'û')
  }
}