import { Metadata } from 'next';
import { Homepage } from './homepage';

export const metadata: Metadata = {
  title: 'Lingebokaal administratie',
  description: 'Lingebokaal administratie',
  icons: '/rvl_logo_small.png',
};

export default function Home() {
  return <Homepage />;
}
