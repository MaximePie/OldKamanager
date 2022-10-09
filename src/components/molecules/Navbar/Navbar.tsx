import {StyledNavLink} from "./styles";

export default function Navbar() {
  return (
    <div>
      <StyledNavLink to='/'>Ressources</StyledNavLink>
      <StyledNavLink to='/craft'>Crafts</StyledNavLink>
      <StyledNavLink to='/shopping'>Shopping</StyledNavLink>
    </div>
  )
}