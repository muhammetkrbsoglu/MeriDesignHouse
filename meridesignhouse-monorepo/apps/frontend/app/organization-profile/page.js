import { OrganizationProfile } from "@clerk/nextjs"
import { clerkTheme } from "../../lib/clerkTheme"

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full">
        <OrganizationProfile appearance={clerkTheme} />
      </div>
    </div>
  )
}


