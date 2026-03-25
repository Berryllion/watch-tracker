"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";

function HeaderDescription() {
  const pathname = usePathname();
  const isLogin = pathname === "/login";

  const description = isLogin ? "Don't have an account?" : "Already have an account?";
  const linkText = isLogin ? "Sign up" : "Sign in";
  const linkHref = isLogin ? "register" : "login";

  return (
    <>
      {description}
      {" "}
      <Link href={linkHref}>{linkText}</Link>
    </>
  )
}

export default HeaderDescription
