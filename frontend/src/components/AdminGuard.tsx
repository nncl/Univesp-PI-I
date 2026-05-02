"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth } from "@/lib/api";
import { clearTokens, isAuthenticated } from "@/lib/auth";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/admin/login");
      return;
    }
    auth
      .me()
      .then(() => setReady(true))
      .catch(() => {
        clearTokens();
        router.replace("/admin/login");
      });
  }, [router]);

  if (!ready) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-ink/60">
        Verificando sessão…
      </div>
    );
  }
  return <>{children}</>;
}
