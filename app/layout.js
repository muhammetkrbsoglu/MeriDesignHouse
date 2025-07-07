import { Inter } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import { Toaster } from "sonner"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { ThemeProvider } from "next-themes"
import "./globals.css"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Meri Handmade - El Yapımı Özel Tasarım Ürünler",
  description:
    "Düğün, doğum günü ve özel günleriniz için el yapımı, kişiye özel tasarım ürünler. Davetiye, hediye, dekorasyon ve daha fazlası.",
  keywords: "el yapımı, handmade, düğün davetiyesi, doğum günü kartı, özel tasarım, hediye, dekorasyon",
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="tr" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster position="top-right" />
            <SpeedInsights />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
