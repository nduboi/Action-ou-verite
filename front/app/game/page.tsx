import TruthOrDareGame from "../../components/TruthOrDareGame"

export default function GamePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-600 to-red-800 text-white py-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold">🔥 Truth or Dare 🔥</h1>
      </header>
      <main className="container mx-auto px-4">
        <TruthOrDareGame />
      </main>
    </div>
  )
}

