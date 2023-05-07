import styled from "styled-components";
import {ComponentProps} from "./types";
import {Button} from "@mui/material";
import {CraftColumnsGridDimensions} from "../../pages/Gears/styles";
import Chart from "react-apexcharts";

export const StyledGear = styled.div`
  margin-bottom: .5em;
  display: grid;
  align-items: center;
  justify-content: center;
  grid-template-columns: ${CraftColumnsGridDimensions};
  grid-column-gap: 1em;
`

export const StyledButton = styled(Button)`
  min-width: 40px !important;
  padding: 0 !important;
`

type PriceInputProps = {
  shouldBeUpdated: boolean,
}

export const PendingPriceIcon = styled.span`
  position: absolute;
  top: -4px;
  left: -4px;
  background-color: #ffbb73;
  border-radius: 50%;
  width: 8px;
  height: 8px;
`

export const PriceInput = styled.input<PriceInputProps>`
  width: 70px;
  background-color: ${({shouldBeUpdated}) => shouldBeUpdated ? '#ffbb73' : ''};
`
export const PricesActions = styled.span`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`

export const Name = styled.span`
  cursor: pointer;
  
  position: relative;

  transition: background-color 500ms ease;
  height: 100%;

  display: flex;
  align-items: center;
  padding: 0 1em;

  &:hover {
    background-color: #cbffed;
  }
`

export const Image = styled.img`
  width: 100%;
`

export const ComponentImage = styled.img`
  width: 100%;
`

export const Price = styled.div`
  display: flex;
  height: 24px;
  
  position: relative;
`

export const Recipe = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 32px);
  grid-column-gap: 4px;

  justify-content: center;
  align-items: center;
`

export const Component = styled.div<ComponentProps>`
  position: relative;
  
  background-color: ${componentBackground}
`

export const ComponentAmount = styled.span`
  top: 12px;
  left: 24px;
  position: absolute;
`

export const StyledChart = styled(Chart)`
  position: absolute;
  left: 100%;
  background-color: #f5fff8;  
  border: solid;
  z-index: 1;
`

function componentBackground({isEmpty, isTooHigh}: ComponentProps) {
  let background = 'initial';

  if (isEmpty) {
    background = '#ffbb73';
  }

  if (isTooHigh) {
    background = '#ff6565';
  }

  return background;
}