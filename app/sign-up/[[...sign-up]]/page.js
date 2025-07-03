import { SignUp } from "@clerk/nextjs"

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-neutral-900 mb-2">Hesap Oluştur</h2>
          <p className="text-neutral-600">El yapımı hediye topluluğumuza katılın</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <SignUp
            appearance={{
              elements: {
                formButtonPrimary: "bg-primary-600 hover:bg-primary-700 text-white",
                card: "shadow-none",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
              },
            }}
          />
        </div>
      </div>
    </div>
  )
}
