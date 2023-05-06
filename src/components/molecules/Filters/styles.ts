import {Button, FormControl, FormGroup, TextField} from "@mui/material"
import styled from "styled-components"

export const StyledFilters = styled.div`
  margin: 1em 0;

  display: flex;
  align-items: center;
`

export const FormatButton = styled(Button)`
  position: absolute !important;
  top: -2.5em;
  left: -1.75em;
  width: 0
`

export const Field = styled(TextField)`
  max-width: 200px !important;
`
export const Control = styled(FormControl)`

  &:not(:first-child) {
    margin: 0;
    margin-left: 1em !important;
  }
`

export const Group = styled(FormGroup)`
  margin-left: 1em;
  display: inline-flex !important;
  flex-direction: column;
`