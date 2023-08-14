import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Page } from "../components/organisms/page/Page";
import Head from "next/head";
import { Nunito } from "next/font/google";
import { QueryClient } from "@tanstack/query-core";
import { QueryClientProvider } from "@tanstack/react-query";

const nunito = Nunito({
  weight: "400",
  subsets: ["latin"],
});
const queryClient = new QueryClient();
export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Head>
        <title>Lingebokaal administratie</title>
      </Head>
      <Page className={nunito.className}>
        <Component {...pageProps} />
      </Page>
    </QueryClientProvider>
  );
}
