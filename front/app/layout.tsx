import "./globals.css"
import { Inter } from "next/font/google"
import type React from "react"
import { Toaster } from "@/components/ui/toaster" // Import the Toaster component

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Action ou Vérité",
  description: "Un jeu moderne d'Action ou Vérité construit avec Next.js et React",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster/>
      </body>
    </html>
  )
}