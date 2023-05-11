import React from "react";
import Link from "next/link";
import { HeaderBar, HeaderLink, HeaderNav } from "./header.styles";
import { useRouter } from "next/router";

const navLinks = [
  { title: "Instellingen", target: "/settings" },
  { title: "Upload", target: "/upload" },
  { title: "Data", target: "/data" },
];

export function Header() {
  const { pathname } = useRouter();

  return (
    <HeaderBar position="static">
      <HeaderNav>
        {navLinks.map(({ title, target }) => (
          <Link key={target} href={target} passHref>
            <HeaderLink active={pathname === target}>{title}</HeaderLink>
          </Link>
        ))}
      </HeaderNav>
    </HeaderBar>
  );
}
