
import React from "react"
import TrendDisplay from "./TrendDisplay"
import {TrendProps} from "./types";

export default function Trend({value}: TrendProps) {

  // 📈 if the trend is ascending
  // 📉 if the trend is descending
  // 📊 if the trend is stable
  const display = value === "ascending" ? "📈" : value === "descending" ? "📉" : "📊";

  return (
    <TrendDisplay display={display}/>
  )
}
