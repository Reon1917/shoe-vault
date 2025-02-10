'use client';

import { SessionProvider } from 'next-auth/react';

export default function AuthProvider({ children }) {
  return (
    <SessionProvider
      session={undefined}  // Next.js will automatically pass the session
      refetchInterval={5 * 60}  // Refetch session every 5 minutes
      refetchOnWindowFocus={true}  // Refetch session when window is focused
    >
      {children}
    </SessionProvider>
  );
}
