'use client';
import { Header } from '@components';
import { Footer } from '../../molecules/footer/footer';
import React from 'react';
import { StyledToast } from '../../atoms/styled-toast/styledToast';
import { usePathname } from 'next/navigation';

export function Page({
  className,
  children,
}: {
  children: React.ReactNode;
  className: string;
}) {
  const pathname = usePathname();
  const showDiagonalLine = pathname === '/' || pathname.includes('/wedstrijd/');

  console.log(pathname);

  return (
    <div className={`${className} min-h-full`}>
      <Header />
      <main
        className={`min-h-[calc(100vh_-_138px)] flex justify-center py-6 ${
          showDiagonalLine ? 'diagonal-theme-line' : 'bg-background'
        }`}
      >
        <StyledToast />
        <div className="w-6xl">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
