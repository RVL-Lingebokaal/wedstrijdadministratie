import React from "react";
import { useRouter } from "next/router";

export function Footer() {
  const { pathname } = useRouter();

  return (
    <div className="bg-primary justify-center">
        <p>footer</p>
    </div>
  );
}
