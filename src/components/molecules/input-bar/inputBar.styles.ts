import styled from "styled-components";
import { FormControl, InputLabel } from "@mui/material";

export const FormInputLabel = styled(InputLabel)`
  && {
    display: flex;
    flex-direction: column;
    justify-content: stretch;

    font-size: 1rem;
    color: ${({ theme }) => theme.palette.text.primary};
  }
`;

export const StyledFormControl = styled(FormControl)`
  && {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
  }
`;

export const Label = styled.div`
  && {
    max-width: 14rem;
    width: 50%;
    white-space: normal;
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
`;
