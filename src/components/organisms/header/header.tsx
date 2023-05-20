import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const navLinks = [
  { title: "Instellingen", target: "/settings" },
  { title: "Upload", target: "/upload" },
  { title: "Data", target: "/data" },
];

export function Header() {
  const { pathname } = useRouter();
  console.log(pathname);

  return (
    <div>
      <nav>
        {navLinks.map(({ title, target }) => (
          <Link key={target} href={target} passHref>
            <div>{title}</div>
          </Link>
        ))}
      </nav>
    </div>
  );
}
