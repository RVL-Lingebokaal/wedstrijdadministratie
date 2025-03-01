'use client';
import { Header } from '@components';
import { Footer } from '../../molecules/footer/footer';
import React from 'react';
import { usePathname } from 'next/navigation';
import { StyledToast } from '../../atoms/styled-toast/styledToast';

export function Page({
  className,
  children,
}: {
  children: React.ReactNode;
  className: string;
}) {
  const pathname = usePathname();

  return (
    <div className={`${className} min-h-full`}>
      <Header />
      <main
        className={`min-h-[calc(100vh_-_138px)] flex justify-center py-6 ${
          pathname === '/' ? 'diagonal-theme-line' : 'bg-background'
        }`}
      >
        <StyledToast />
        <div className="w-6xl">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
