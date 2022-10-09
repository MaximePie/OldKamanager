
import styled from "styled-components";
import {StyledClickableResourceProps, StyledImageProps} from "./types";
import {Button} from "@mui/material";

export const Image = styled.img<StyledImageProps>`
  width: 100%;

  background-color: rgba(80, 255, 80, ${props => props.backgroundIntensity});
`

export const StyledButton = styled(Button)`
  min-width: 24px !important;
`

export const Container = styled.span`
  display: flex;
`

export const StyledClickableResource = styled.div<StyledClickableResourceProps>`
  width: ${props => props.isBig ? '60' : '32'}px;
  height: ${props => props.isBig ? '60' : '32'}px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  cursor: pointer;
  
  &:hover {
    background-color: aquamarine;
    transition: background-color 600ms ease;
  }
`

export const Quantity = styled.span`
  position: absolute;
  right: 0;
  bottom: 0;
`

export const Price = styled.span`
  position: absolute;
  top: 0;
  font-size: 0.6em;
`

