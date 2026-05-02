"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { auth } from "@/lib/api";
import { setTokens } from "@/lib/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const tokens = await auth.login(username, password);
      setTokens(tokens);
      router.replace("/admin");
    } catch {
      setError("Usuário ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-6 border border-ink/10 bg-paper-warm p-8"
      >
        <header className="space-y-1">
          <p className="text-xs uppercase tracking-widest text-ink/60">Admin</p>
          <h1 className="font-serif text-3xl">Entrar</h1>
        </header>
        <div className="space-y-1">
          <label className="text-xs uppercase tracking-widest text-ink/60">Usuário</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-ink/20 bg-paper px-3 py-2 outline-none focus:border-ink"
            autoComplete="username"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs uppercase tracking-widest text-ink/60">Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-ink/20 bg-paper px-3 py-2 outline-none focus:border-ink"
            autoComplete="current-password"
          />
        </div>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full border border-ink bg-ink px-6 py-3 text-sm uppercase tracking-widest text-paper transition hover:bg-paper hover:text-ink disabled:opacity-50"
        >
          {loading ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </main>
  );
}
