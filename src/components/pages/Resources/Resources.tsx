import {Header, StyledRessources} from "./styles";
import {useQuery} from "react-query";
import {Resource as ResourceType} from "../../../types/Resource"
import Resource from "../../molecules/Resource/Resource"

import {getFromServer} from "../../../services/server";
import {useContext, useState} from "react";
import {FilterContext} from "../../../contexts/FilterContext"
import Filters from "../../molecules/Filters/Filters";

export default function Resources() {
  const {data} = useQuery<ResourceType[]>('resources', fetchResources)

  const {filters: {search}} = useContext(FilterContext);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const resources = formattedResources();
  const slicedResources = resources.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  return (
    <>
      <Filters/>
      <div>
        <span>
          Page : {currentPage}
        </span>
        <button onClick={() => setCurrentPage(currentPage => currentPage - 1)}>
          &lt;
        </button>
        <button onClick={() => setCurrentPage(currentPage => currentPage + 1)}>
          &gt;
        </button>
      </div>
      <StyledRessources>
        <Header>
          <span>Image</span>
          <span>Nom</span>
          <span>Prix</span>
        </Header>
        {slicedResources.slice(0, 10).map((resource) => (
          <Resource key={resource._id} data={resource}/>
        ))}
      </StyledRessources>
    </>
  )

  async function fetchResources() {
    // return axios.get('https://fr.dofus.dofapi.fr/resources').then(response => response.data);
    return getFromServer('/resources').then(response => response.data);
  }

  function formattedResources(): ResourceType[] {
    if (!data) {
      return [];
    }

    const filteredData = data.filter(resource => search
      ? flattenedSearch(resource.name).includes(flattenedSearch(search))
      : true);

    return filteredData.sort((resource1) => resource1.isWantedForTen || resource1.isWantedForHundred ? -1 : 1);
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