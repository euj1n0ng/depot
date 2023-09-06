import { ReduxProvider } from "@/redux/provider"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import SessionProvider from "./SessionProvider"
import Navbar from "./Navbar/Navbar"
import Footer from "./Footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Depot",
  description: "A simplified e-commerce app that integrates with DWN",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <ReduxProvider>
            <Navbar />
            <main className="p-4 max-w-7xl m-auto min-w-[300px]">
              {children}
            </main>
            <Footer />
          </ReduxProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
