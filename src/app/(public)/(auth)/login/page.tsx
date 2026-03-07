import LoginBanner from "@/app/(public)/(auth)/login/login-banner";
import LoginForm from "@/app/(public)/(auth)/login/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex bg-cream">
      <div className="hidden lg:flex lg:w-5/12 bg-dark relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-linear-to-b from-dark/50 via-dark/30 to-dark/70" />
        <LoginBanner />
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-32">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}