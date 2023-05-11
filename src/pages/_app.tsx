import type { AppProps } from "next/app";
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
  StyledEngineProvider,
} from "@mui/material";
import { Page } from "../components/molecules/page/Page";
import { ThemeProvider } from "styled-components";
import Head from "next/head";
import { Nunito } from "next/font/google";
import { GlobalStyle } from "../components/theme/global-style";

const nunito = Nunito({
  weight: "400",
  subsets: ["latin"],
});
export default function App({ Component, pageProps }: AppProps) {
  const theme = createTheme();
  return (
    <StyledEngineProvider>
      <MuiThemeProvider theme={theme}>
        <ThemeProvider theme={theme}>
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
