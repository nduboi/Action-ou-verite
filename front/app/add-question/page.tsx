"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { Flame, ArrowLeft } from "lucide-react"

export default function AddQuestion() {
  const [challenge, setChallenge] = useState("")
  const [type, setType] = useState<"1" | "2">("1")
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null);

  const checkToken = async (token: string | null) => {
    try {
      const response = await fetch("http://localhost:8002/checkToken", {
        method: "GET",
        headers: {
          "Authorization": `${token}`,
        },
      })
      if (response.status !== 200) {
        toast({
          title: "Erreur",
          description: "You need to be logged in to access this page.",
        })
        router.push("/login")
      }
    } catch (error) {
      console.error("Error checking token:", error)
      router.push("/login")
    }
  }
  
  useEffect(() => {
    const storedToken = sessionStorage.getItem("Token");
    setToken(storedToken);
    checkToken(storedToken);
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await checkToken(token);
    if (!challenge) {
      toast({
        title: "Erreur",
        description: "Le défi ne peut pas être vide",
      })
      return
    }
    const addChallenge = async (challenge: string, type: "1" | "2") => {
      try {
        let token = sessionStorage.getItem("Token");
        console.log("Token:", token)
        const response = await fetch("http://localhost:8002/addChallenge", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `${token}`,
          },
          body: JSON.stringify({ challenge, type }),
        })

        console.log("Response:", response)
        const data = await response.json()
        if (!response.ok) {
          toast({
            title: "Erreur",
            description: data.error,
          })
          return null;
        }
        toast({
          title: "Success",
          description: "Challenge added successfully",
        })
        return data
      } catch (error) {
        console.error("Error adding challenge:", error)
        toast({
          title: "Erreur",
          description: "Une erreur s'est produite lors de l'ajout du défi.",
        })
      }
    }
    await addChallenge(challenge, type)
    setChallenge("")
    setType("1")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-600 to-red-800 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-red-600 p-4 flex items-center justify-between">
          <CardTitle className="text-2xl font-bold text-white flex items-center">
            <Flame className="mr-2" /> Ajout de Défi
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={() => router.push("/")} className="text-white hover:bg-red-700">
            <ArrowLeft />
          </Button>
        </div>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="challenge-type" className="text-lg font-semibold text-gray-700">
                Type de Défi
              </Label>
              <RadioGroup
                id="challenge-type"
                value={type}
                onValueChange={(value) => setType(value as "1" | "2")}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1" id="action" className="text-red-600" />
                  <Label htmlFor="action" className="text-gray-700">
                    Action
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="2" id="verite" className="text-red-600" />
                  <Label htmlFor="verite" className="text-gray-700">
                    Vérité
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label htmlFor="defi" className="text-lg font-semibold text-gray-700">
                Votre Défi
              </Label>
              <Input
                id="defi"
                placeholder="Entrez votre défi ici"
                value={challenge}
                onChange={(e) => setChallenge(e.target.value)}
                className="border-gray-300 focus:border-red-500 focus:ring-red-500"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold transition-colors duration-200"
            >
              Ajouter le Défi
            </Button>
          </form>
        </CardContent>
      </Card>
      <div className="mt-4 text-white text-center">
        <p className="font-bold">
          Created by{" "}
          <a href="https://github.com/nduboi" className="underline hover:text-red-300">
            @nduboi
          </a>
        </p>
      </div>
    </div>
  )
}

