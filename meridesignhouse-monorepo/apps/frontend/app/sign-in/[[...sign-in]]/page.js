import { SignIn } from "@clerk/nextjs"
import { clerkTheme } from "../../../lib/clerkTheme"

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-neutral-900 mb-2">Tekrar Hoş Geldiniz</h2>
          <p className="text-neutral-600">Hesabınıza giriş yapın</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <SignIn appearance={clerkTheme} />
        </div>
      </div>
    </div>
  )
}
