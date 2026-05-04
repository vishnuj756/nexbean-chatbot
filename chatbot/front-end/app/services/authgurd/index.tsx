"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const authRoutes = ["/auth/login", "/auth/register", "/auth/forgot-password"];
    const isAuthPage = authRoutes.includes(pathname);

    if (!token && !isAuthPage) {
      router.push("/auth/login");
    } else if (token && isAuthPage) {
      // Logged in and trying to access an auth page -> Go to home
      // Everything is fine
      setIsReady(true);
    }
  }, [pathname, router]);

 

  return <>{children}</>;
}