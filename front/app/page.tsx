import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"
import { IoGameController } from "react-icons/io5";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-600 to-red-800 text-white flex flex-col items-center justify-center">
      <header className="mb-8">
        <h1 className="text-4xl font-bold">🔥 Action ou Vérité 🔥</h1>
      </header>
      <main className="space-y-6 w-64">
        <Link href="/game" className="block">
          <Button className="w-full text-lg bg-green-600 hover:bg-green-700">
            <IoGameController className="w-5 h-5 mr-2" />
            Jouer
          </Button>
        </Link>
        <Link href="/login" className="block">
          <Button className="w-full text-lg bg-blue-500 hover:bg-blue-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5 mr-2"
            >
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            Connexion
          </Button>
        </Link>
        <Link href="/register" className="block">
          <Button className="w-full text-lg bg-purple-500 hover:bg-purple-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5 mr-2"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" />
              <line x1="23" y1="11" x2="17" y2="11" />
            </svg>
            S'inscrire
          </Button>
        </Link>
        <Link href="/add-question" className="block">
          <Button className="w-full text-lg bg-purple-500 hover:bg-purple-600">
            <Pencil className="w-5 h-5 mr-2" />
            Ajouter un Défi
          </Button>
        </Link>
        <Link href="/all-challenges" className="block">
          <Button className="w-full text-lg bg-purple-500 hover:bg-purple-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5 mr-2"
            >
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            Tous les Défis
          </Button>
        </Link>
      </main>
      <footer className="mt-8 text-sm">
        Created by{" "}
        <a href="https://github.com/nduboi" className="underline">
          @nduboi
        </a>
      </footer>
    </div>
  )
}

