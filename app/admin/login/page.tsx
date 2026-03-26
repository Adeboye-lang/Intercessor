"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Invalid email or password");
        setLoading(false);
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg bg-sacred-grid px-4 md:px-8">
      <div className="w-full max-w-sm bg-white p-8 rounded-3xl shadow-sm border border-olive/10 relative overflow-hidden">
        {/* Decorative flair */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-brand/10 rounded-full blur-2xl pointer-events-none" />

        <div className="mb-8 text-center relative z-10">
          <Link href="/" className="inline-flex items-center justify-center gap-2 mb-6">
            <span className="w-10 h-10 rounded-full bg-olive text-white flex items-center justify-center text-lg font-sans">I</span>
          </Link>
          <h1 className="text-2xl font-serif text-olive tracking-tight">Admin Portal</h1>
          <p className="text-sm text-text-muted mt-2">Sign in to manage Intercessor</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl relative">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block ml-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-4 py-3 rounded-xl border border-olive/10 bg-white text-olive focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all outline-none"
              placeholder="admin@intercessor.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block ml-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-4 py-3 rounded-xl border border-olive/10 bg-white text-olive focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-4 bg-olive text-white rounded-xl text-sm font-semibold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-brand hover:-translate-y-0.5 transition-all duration-300 shadow-lg shadow-brand/10 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:bg-olive"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
