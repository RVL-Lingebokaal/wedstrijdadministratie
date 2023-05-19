import type { AppProps } from "next/app";
import {
  ThemeProvider as MuiThemeProvider,
  StyledEngineProvider,
} from "@mui/material/styles";
import { Page } from "../components/organisms/page/Page";
import { ThemeProvider } from "styled-components";
import Head from "next/head";
import { Nunito } from "next/font/google";
import { GlobalStyle } from "../components/theme/global-style";
import { muiTheme } from "../theme/theme";

const nunito = Nunito({
  weight: "400",
  subsets: ["latin"],
});
export default function App({ Component, pageProps }: AppProps) {
  return (
    <StyledEngineProvider>
      <MuiThemeProvider theme={muiTheme}>
        <ThemeProvider theme={muiTheme}>
          <GlobalStyle />
          <Head>
            <title>Lingebokaal administratie</title>
          </Head>
          <Page className={nunito.className}>
            <Component {...pageProps} />
          </Page>
        </ThemeProvider>
      </MuiThemeProvider>
    </StyledEngineProvider>
  );
}
