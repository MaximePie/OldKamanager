import styled from "styled-components";
import { StyledResourceProps } from "./types";
import { Button } from "@mui/material";

export const StyledResource = styled.div<StyledResourceProps>`
  margin-bottom: 0.5em;
  display: grid;
  align-items: center;
  justify-content: center;
  grid-template-columns: 80px 1fr 120px;
  grid-column-gap: 1em;
`;

export const Image = styled.img`
  width: 100%;
  height: 100%;
`;
