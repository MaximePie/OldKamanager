import styled from "styled-components";
import {NavLink} from "react-router-dom"

export const StyledNavLink = styled(NavLink)`
  
  text-decoration: none;
  text-transform: uppercase;
  font-size: 1.5em;
  
  &:not(:first-child) {
    margin-left: 1em;
  }
`