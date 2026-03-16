import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Login — Dashboard PAD Kabupaten Klaten",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50/50">
      {/* Left Panel - Brand / Graphic */}
      <div className="hidden lg:flex flex-1 flex-col items-center justify-center bg-linear-to-br from-brand-navy to-[#1a4a8a] text-white p-12 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute -bottom-[20%] -left-[10%] w-[500px] h-[500px] rounded-full bg-white/5 blur-3xl" />
        <div className="absolute top-[10%] -right-[10%] w-[400px] h-[400px] rounded-full bg-[#f59e0b]/10 blur-3xl" />
        
        <div className="relative z-10 flex flex-col items-center text-center max-w-md">
            <Image
              src="/pict.png"
              alt="Logo Klaten"
              width={80}
              height={80}
              className="h-24 w-auto object-contain mb-8 drop-shadow-2xl"
            />
            <h1 className="text-4xl font-bold tracking-tight mb-4">
               Dashboard PAD
            </h1>
            <p className="text-lg text-blue-100/90 leading-relaxed">
               Sistem Monitoring Realisasi Pendapatan Asli Daerah Kabupaten Klaten
            </p>
        </div>
      </div>

      {/* Right Panel - Login Form Container */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12">
        {children}
      </div>
    </div>
  );
}
