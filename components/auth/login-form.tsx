"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, Lock, User, ArrowRight } from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
  username: z.string().min(3, "Username minimal 3 karakter"),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const { login } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.username, data.password);
      const rawFrom = searchParams.get("from") ?? "/dashboard";
      // Jika from adalah root "/" atau "/login", arahkan ke dashboard
      // (root page selalu redirect ke /login sehingga akan loop)
      const from =
        !rawFrom || rawFrom === "/" || rawFrom.startsWith("/login")
          ? "/dashboard"
          : rawFrom;
      // Gunakan hard navigation agar cookie terbaca ulang oleh proxy
      window.location.href = from;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Kredensial tidak valid");
    }
  };

  return (
    <div className="w-full max-w-[400px]">
      {/* Mobile Header */}
      <div className="flex flex-col items-center gap-4 mb-8 lg:hidden">
        <Image
          src="/pict.png"
          alt="Logo"
          width={80}
          height={80}
          className="h-24 w-auto object-contain drop-shadow-md"
          unoptimized
        />
        <div className="text-center">
          <h1 className="text-2xl font-extrabold text-brand-navy tracking-tight">Dashboard PAD</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Daerah</p>
        </div>
      </div>

      {/* Modern Premium Card */}
      <div className="bg-white/95 backdrop-blur-xl border border-gray-100/80 rounded-[28px] p-8 shadow-2xl shadow-blue-900/5 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 rounded-full blur-3xl -z-10" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-brand-navy/5 rounded-full blur-3xl -z-10" />

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Selamat Datang</h2>
          <p className="text-sm text-gray-500 mt-1.5 font-medium">Masuk untuk mengelola Dashboard PAD</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Username */}
          <div className="space-y-2">
            <label
              htmlFor="username"
              className="block text-xs font-bold text-gray-700 uppercase tracking-wider"
            >
              Username
            </label>
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-navy transition-colors">
                <User className="w-5 h-5" strokeWidth={2} />
              </div>
              <input
                id="username"
                type="text"
                autoComplete="username"
                placeholder="Masukkan username"
                {...register("username")}
                className={cn(
                  "w-full pl-10 pr-4 py-3 rounded-2xl text-sm font-medium",
                  "bg-gray-50/50 border-2 text-gray-900 placeholder:text-gray-400/80",
                  "focus:outline-none focus:ring-4 focus:ring-brand-navy/10 focus:border-brand-navy focus:bg-white",
                  "transition-all duration-300",
                  errors.username ? "border-red-400 focus:border-red-500" : "border-gray-100 hover:border-gray-200"
                )}
              />
            </div>
            {errors.username && (
              <p className="text-xs text-red-500 font-medium pl-1 flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-red-500" />
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-xs font-bold text-gray-700 uppercase tracking-wider"
            >
              Password
            </label>
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-navy transition-colors">
                <Lock className="w-5 h-5" strokeWidth={2} />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                {...register("password")}
                className={cn(
                  "w-full pl-10 pr-12 py-3 rounded-2xl text-sm font-medium",
                  "bg-gray-50/50 border-2 text-gray-900 placeholder:text-gray-400/80",
                  "focus:outline-none focus:ring-4 focus:ring-brand-navy/10 focus:border-brand-navy focus:bg-white",
                  "transition-all duration-300",
                  errors.password ? "border-red-400 focus:border-red-500" : "border-gray-100 hover:border-gray-200"
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100 transition-all focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 font-medium pl-1 flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-red-500" />
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Spacer */}
          <div className="pt-2" />

          {/* Submit */}
          <button
            type="submit"
            id="btn-login"
            disabled={isSubmitting}
            className={cn(
              "group w-full flex items-center justify-between",
              "p-1 pl-6 rounded-2xl font-bold text-sm",
              "bg-brand-navy hover:bg-brand-navy-dark",
              "text-white transition-all duration-300",
              "disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0",
              "shadow-xl shadow-brand-navy/20 hover:shadow-brand-navy/30",
              "hover:-translate-y-0.5"
            )}
          >
            <span>{isSubmitting ? "Memverifikasi..." : "Masuk ke Sistem"}</span>
            <div className="bg-white/20 p-3 rounded-xl ml-4 group-hover:bg-white/30 transition-colors">
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin text-white" />
              ) : (
                <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
              )}
            </div>
          </button>
        </form>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-400 mt-6 pt-4 border-t border-gray-100">
          Akses hanya untuk pengguna terdaftar
        </p>
      </div>
    </div>
  );
}
