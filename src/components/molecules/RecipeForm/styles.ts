import styled from "styled-components";

export const Wrapper = styled.div`
  height: 100vh;
  width: 100vw;
  position: fixed;
  background-color: dimgray;
  
  top: 0;
  left: 0;

  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
`

export const StyledRecipeFormDisplay = styled.div`
  border-radius: 4px;
  width: 1200px;
  background-color: azure;
  position: relative;
  
  padding: 1em 2em;
`

export const CloseIcon = styled.button`
  position: absolute;
  right: 2em;
  top: 1em;
  border: none;
  outline: none;
  width: 40px;
`
