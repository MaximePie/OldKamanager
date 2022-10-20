import styled from "styled-components";
import {Button} from "@mui/material";

export const StyledRessources = styled.div`
  border: solid;
  padding: 1em;

  text-align: center;
  margin: auto;
`

export const Header = styled.div`
  margin-bottom: .5em;
  display: grid;
  align-items: center;
  grid-template-columns: 80px 1fr 120px;
  grid-column-gap: 1em;
  
  font-weight: bold;
`

export const StyledButton = styled(Button)`
  min-width: 20px !important;
  padding: 0 !important;
`