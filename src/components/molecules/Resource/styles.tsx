import styled from "styled-components";
import {StyledResourceProps} from "./types";


export const StyledResource = styled.div<StyledResourceProps>`
  margin-bottom: .5em;
  display: grid;
  align-items: center;
  justify-content: center;
  grid-template-columns: 80px 1fr 120px;
  grid-column-gap: 1em;
`

export const Image = styled.img`
  width: 100%;
`

export const Name = styled.input`
  width: 200px;
`
