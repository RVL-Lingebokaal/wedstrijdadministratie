import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";

const navLinks = [
  { title: "Instellingen", target: "/settings" },
  { title: "Upload", target: "/upload" },
  { title: "Data", target: "/data" },
];

export function Header() {
  const { pathname } = useRouter();
  console.log(pathname);

  return (
    <div className="bg-primary flex justify-center">
      <nav className="flex justify-between py-6 w-6xl">
        <Image src="/rvl_logo.png" alt="RVL logo" width={128} height={50} />
        <div className="flex justify-end gap-6">
          {navLinks.map(({ title, target }) => (
            <Link className="text-white" key={target} href={target} passHref>
              {title}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
