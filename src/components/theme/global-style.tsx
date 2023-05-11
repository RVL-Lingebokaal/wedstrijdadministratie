import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`  
    @font-face {
      font-family: 'Nunito', sans-serif;
    }

    html {
      box-sizing: border-box;
    }

    *, *:before, *:after {
      box-sizing: inherit;
    }

    html {
      -webkit-text-size-adjust: 100%;
      line-height: 1.5;
      tab-size: 4;
      scroll-behavior: smooth;
      overflow-x: hidden;
    }
    
    body {
      line-height: 1.5;
      margin: 0;
    }

`;
