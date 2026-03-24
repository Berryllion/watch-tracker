// Source - https://stackoverflow.com/a/78119370
// Posted by Youssouf Oumar, modified by community. See post 'Timeline' for change history
// Retrieved 2026-03-23, License - CC BY-SA 4.0

"use client";

import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function QueryClientContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
