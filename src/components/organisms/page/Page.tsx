import { Header } from "../../molecules/header/header";
import { Footer } from "../../molecules/footer/footer";
import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";

export function Page({
  className,
  children,
}: {
  children: React.ReactNode;
  className: string;
}) {
  const { pathname } = useRouter();

  return (
    <div className={`${className} min-h-screen`}>
      <Head>
        <title>Lingebokaal administratie</title>
        <meta name="description" content="Lingebokaal administratie" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/rvl_logo_small.png" />
      </Head>
      <Header />
      <main
        className={`h-[calc(100vh_-_204px)] flex justify-center py-6 ${
          pathname === "/" ? "diagonal-theme-line" : "bg-background"
        }`}
      >
        <div className="w-6xl">{children}</div>
      </main>
      <Footer/>
    </div>
  );
}
