import { StyledNavLink } from "./styles";

export default function Navbar() {
  return (
    <div>
      <StyledNavLink to="/craft">Crafts</StyledNavLink>
      <StyledNavLink to="/shopping">Shopping</StyledNavLink>
      <StyledNavLink to="/workshop">Atelier</StyledNavLink>
    </div>
  );
}
