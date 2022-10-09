
import React from "react"
import StatsDetailsDisplay from "./StatsDetailsDisplay"
import {useQuery} from "react-query";
import {GearPriceRequest} from "../Gear/types";
import {StatsDetailsProps} from "./types";
import {getFromServer, deleteOnServer} from "../../../services/server";
import {ObjectId} from "bson";
import {playSuccessSound} from "../../../services/sounds";
export default function StatsDetails(props: StatsDetailsProps) {
  const {gear} = props;
  const {_id} = gear;
  const {data} = useQuery<GearPriceRequest>(`gearPrices/${_id}`, fetchPrices)
  return (
    <StatsDetailsDisplay gear={gear} prices={data?.prices || []} onDelete={deletePrice}/>
  )

  function deletePrice(_id: ObjectId) {
    return deleteOnServer(`/gears/prices/${_id}`).then(() => {
      playSuccessSound();
    })
  }

  function fetchPrices() {
    return getFromServer(`/gears/prices/${_id}`).then(response => response.data);
  }
}
