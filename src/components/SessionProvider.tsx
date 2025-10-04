'use client';

import { CustomSession } from "@/app/(main)/auth/signin/utils/register_user";
import { SessionProvider } from "next-auth/react";

export function Providers({ children, session }: { children: React.ReactNode, session?: CustomSession }) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
