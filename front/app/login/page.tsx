"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then(async (res) => {
        const responseBody = await res.json()
        if (res.status !== 200) {
          toast({
            title: "Login Failed",
            description: responseBody.error,
          })
          return null
        }
        return responseBody
      })
      .then((data) => {
        if (data === null)
          return
        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté.",
        })
        sessionStorage.setItem("Token", data.token)
        router.push("/add-question")
      })
      .catch((error) => {
        console.error("Error during login:", error)
        toast({
          title: "Échec de la connexion",
          description: "Une erreur s'est produite. Veuillez réessayer.",
        })
      })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-600 to-red-800 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Connexion</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" className="w-full">
              Connexion
            </Button>
          </form>
          <Button
            onClick={() => router.push("/register")}
            className="w-full mt-2"
            variant="outline"
          >
            Vous n'avez pas de compte ?
          </Button>
          <Button
            onClick={() => router.push("/")}
            className="w-full mt-4"
            variant="secondary"
          >
            Retour au Menu
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}