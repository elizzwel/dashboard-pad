import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-white/60" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
