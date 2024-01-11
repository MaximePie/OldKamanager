import { Header, StyledRessources, StyledButton as Button } from "./styles";
import Resource from "../../molecules/Resource/Resource";

import Filters from "../../molecules/Filters/Filters";
import { useResourcesContext } from "../../../contexts/RessourcesContext";

export default function Resources() {
  const { filteredResources, isLoading, page, setPage } = useResourcesContext();

  return (
    <>
      <Filters />
      <div>
        <Button onClick={() => setPage(page - 1)}>&lt;</Button>
        <Button onClick={() => setPage(page + 1)}>&gt;</Button>
        <span>Page : {page}</span>
      </div>
      <StyledRessources>
        <Header>
          <span>Image</span>
          <span>Nom</span>
          <span>Prix</span>
        </Header>
        {isLoading && <span>Chargement...</span>}
        {filteredResources.slice(0, 100).map((resource) => (
          <Resource key={resource._id} data={resource} />
        ))}
      </StyledRessources>
    </>
  );
}
