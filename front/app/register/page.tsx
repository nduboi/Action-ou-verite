"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"

export default function Register() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, username }),
      })

      const responseBody = await res.json()

      if (res.status !== 200) {
        toast({
          title: "Inscription échouée",
          description: responseBody.error,
        })
        return
      }

      toast({
        title: "Inscription réussie",
        description: "Vous avez été inscrit avec succès.",
      })

      sessionStorage.setItem("Token", responseBody.token)
      router.push("/add-question")
    } catch (error) {
      console.error("Error during registration:", error)
      toast({
        title: "Inscription échouée",
        description: "Une erreur inattendue s'est produite.",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-600 to-red-800 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Inscription</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <Input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Input
              type="text"
              placeholder="Nom d'utilisateur"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <Button type="submit" className="w-full">
              Inscription
            </Button>
          </form>
          <Button onClick={() => router.push("/login")} className="w-full mt-2" variant="outline">
            Vous avez déjà un compte ?
          </Button>
          <Button onClick={() => router.push("/")} className="w-full mt-4" variant="secondary">
            Retour au Menu
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}