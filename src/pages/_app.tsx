import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Page } from "../components/organisms/page/Page";
import Head from "next/head";
import { Nunito } from "next/font/google";

const nunito = Nunito({
  weight: "400",
  subsets: ["latin"],
});
export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Lingebokaal administratie</title>
      </Head>
      <Page className={nunito.className}>
        <Component {...pageProps} />
      </Page>
    </>
  );
}
