import { Header, StyledRessources, StyledButton as Button } from "./styles";
import { useQuery } from "react-query";
import { Resource as ResourceType } from "../../../types/Resource";
import Resource from "../../molecules/Resource/Resource";

import { getFromServer } from "../../../services/server";
import { useContext, useEffect, useMemo, useState } from "react";
import { FilterContext } from "../../../contexts/FilterContext";
import Filters from "../../molecules/Filters/Filters";
import { useResources } from "../../../contexts/RessourcesContext";

export default function Resources() {
  const { resources, isLoading, page, setPage } = useResources();

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
        {resources.map((resource) => (
          <Resource key={resource._id} data={resource} />
        ))}
      </StyledRessources>
    </>
  );
}
