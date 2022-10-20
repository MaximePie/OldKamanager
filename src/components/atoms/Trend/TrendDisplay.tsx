
import React from "react";
import {StyledTrend} from "./styles";
import {TrendDisplayProps} from "./types";

export default function TrendDisplay({display}: TrendDisplayProps) {
  return (
    <StyledTrend>
      {display}
    </StyledTrend>
  )
}

