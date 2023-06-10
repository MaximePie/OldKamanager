import {Header, StyledRessources, StyledButton as Button} from "./styles";
import {useQuery} from "react-query";
import {Resource as ResourceType} from "../../../types/Resource"
import Resource from "../../molecules/Resource/Resource"

import {getFromServer} from "../../../services/server";
import {useContext, useEffect, useState} from "react";
import {FilterContext} from "../../../contexts/FilterContext"
import Filters from "../../molecules/Filters/Filters";

export default function Resources() {
  const {filters} = useContext(FilterContext);
  const {data, isLoading} = useQuery<ResourceType[]>({
    queryKey: ['resources', filters],
    queryFn: fetchResources,
  })

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 1;

  const resources = formattedResources();
  const slicedResources = resources.slice((currentPage - 1) * pageSize, currentPage * pageSize).slice(0, pageSize);

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

  async function fetchResources({queryKey}: any) {
    const [, params] = queryKey;
    const search = encodeURIComponent(params.search);
    return getFromServer('/resources', {
      ...params,
      search,
    })
      .then(response => response.data)
  }

  function formattedResources(): ResourceType[] {
    if (!data) {
      return [];
    }
    return data.sort((resource1) => resource1.isWantedForTen || resource1.isWantedForHundred ? -1 : 1);
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