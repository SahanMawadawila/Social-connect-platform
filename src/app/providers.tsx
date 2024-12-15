"use client";

import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";

interface ProvidersProps {
  children: React.ReactNode;
}
//in here session provider is used to provide the session information to the client side components.server side components can use the session information by using the auth function. but in the client side we need to use the session provider to provide the session information to the client side components. after that we can use the session information by using the useSession hook. session object given by the useSession hook is always defined not like the session object given by the auth function. but user information retrieved part not same.

export default function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <NextUIProvider>{children}</NextUIProvider>
    </SessionProvider>
  );
}
