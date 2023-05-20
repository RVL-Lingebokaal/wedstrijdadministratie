import { Header } from "../header/header";
import React from "react";
import Head from "next/head";

export function Page({
  className,
  children,
}: {
  children: React.ReactNode;
  className: string;
}) {
  return (
    <div className={className}>
      <Head>
        <title>Lingebokaal administratie</title>
        <meta name="description" content="Lingebokaal administratie" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main>{children}</main>
    </div>
  );
}
