"use client";
import React, { useEffect } from "react";
import { SessionProvider, useSession, signOut } from "next-auth/react";

function SessionGuard({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error === "RefreshTokenError") {
      signOut({ redirectTo: "/" });
    }
  }, [session?.error]);

  return <>{children}</>;
}

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider refetchInterval={4 * 60} refetchOnWindowFocus={true}>
      <SessionGuard>{children}</SessionGuard>
    </SessionProvider>
  );
};

export default Providers;
