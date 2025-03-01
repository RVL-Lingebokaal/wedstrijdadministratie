'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const navLinks = [
  { title: 'Instellingen', target: '/settings' },
  { title: 'Upload', target: '/upload' },
  { title: 'Data', target: '/data' },
  { title: 'Administratie', target: '/administration' },
  { title: 'Koppelen', target: '/koppelen' },
  { title: 'Uitslagen', target: '/results' },
];

export function Header() {
  const pathname = usePathname();

  return (
    <div className="bg-primary flex justify-center">
      <nav className="flex justify-between py-2 w-6xl">
        <Link href="/apps/administratie/public">
          <Image
            className="bg-white p-2"
            src="/rvl_logo.svg"
            alt="RVL logo"
            width={200}
            height={50}
          />
        </Link>
        <div className="flex justify-end gap-6">
          {navLinks.map(({ title, target }) => (
            <Link
              className={`text-white text-1xl my-auto ${
                pathname === target
                  ? 'underline decoration-secondary decoration-[3px] underline-offset-8'
                  : ''
              }`}
              key={target}
              href={target}
              passHref
            >
              {title}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
