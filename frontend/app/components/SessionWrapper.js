

"use client";

import { SessionProvider } from "next-auth/react";

export default function SessionWrapper({ children }) {
  // all children or text come her.e 
  return <SessionProvider>{children}</SessionProvider>;
}