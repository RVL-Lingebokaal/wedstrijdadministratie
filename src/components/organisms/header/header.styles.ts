import styled from "styled-components";
import { AppBar } from "@mui/material";

export const HeaderLink = styled.div<{ active: boolean }>`
  && {
    font-size: 20px;
    line-height: 25px;
    display: inline-block;
    margin: 0 12px;
    text-decoration: none;
    color: ${({ theme, active }) =>
      active ? theme.palette.common.black : theme.palette.common.white};
  }
`;

export const HeaderBar = styled(AppBar)`
  && {
    flex-direction: row;
    background: ${({ theme }) => theme.palette.primary.main};
    padding: 26px 20px 26px 20px;
    justify-content: space-between;
    align-items: center;
  }
`;

export const HeaderNav = styled.nav`
  && {
    display: flex;
    flex-grow: 1;
    justify-content: start;
  }
`;
