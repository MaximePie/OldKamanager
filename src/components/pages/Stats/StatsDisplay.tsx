
import React, {useContext} from "react";
import {StyledStats} from "./styles";
import {StatsDisplayProps} from "./types";
import Filters from "../../molecules/Filters/Filters";
import {useQuery} from "react-query";
import {Gear as GearType} from "../../../types/Gear";
import {FilterContext} from "../../../contexts/FilterContext";
import {getFromServer} from "../../../services/server";
import StatsDetails from "../../molecules/StatsDetails/StatsDetails";

type CraftsQuery = {
  gears: GearType[],
  remaining: number,
}

export default function StatsDisplay(props: StatsDisplayProps) {

  const { filters  } = useContext(FilterContext);
  const types = filters.types?.toString();

  const {data, isLoading} = useQuery<CraftsQuery>(['gears', {
    ...filters,
    types,
  }], fetchGears)

  return (
    <StyledStats>
      <Filters isGearsPage={true}/>
      {data?.gears.map(gear => (
        <div key={gear._id.toString()}>
          <StatsDetails gear={gear}/>
        </div>
      ))}
    </StyledStats>
  )


  function fetchGears({queryKey}: any) {
    const [key, params] = queryKey;
    const search = encodeURIComponent(params.search);
    return getFromServer('/gears', {
      ...params,
      search,
    })
      .then(response => response.data)
  }
}

