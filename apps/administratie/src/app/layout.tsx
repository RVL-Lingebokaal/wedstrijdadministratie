import { ReactNode } from 'react';
import Head from 'next/head';
import { Page } from '@components/server';
import { Nunito } from 'next/font/google';
import Providers from './providers';
import './styles/globals.css';

const nunito = Nunito({
  weight: '400',
  subsets: ['latin'],
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Head>
            <title>Lingebokaal administratie</title>
          </Head>
          <Page className={nunito.className}>{children}</Page>
        </Providers>
      </body>
    </html>
  );
}
