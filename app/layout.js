import { Inter } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import { Toaster } from "sonner"
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
      <html lang="tr">
        <body className={inter.className}>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster position="top-right" />
        </body>
      </html>
    </ClerkProvider>
  )
}
