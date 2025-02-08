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
      const res = await fetch("http://localhost:8002/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, username }),
      })

      const responseBody = await res.json()

      if (res.status !== 200) {
        toast({
          title: "Register Failed",
          description: responseBody.error,
        })
        return
      }

      toast({
        title: "Register Successful",
        description: "You have been registered successfully.",
      })

      sessionStorage.setItem("Token", responseBody.token)
      router.push("/add-question")
    } catch (error) {
      console.error("Error during registration:", error)
      toast({
        title: "Register Failed",
        description: "An unexpected error occurred.",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-600 to-red-800 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Register</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Input
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <Button type="submit" className="w-full">
              Register
            </Button>
          </form>
          <Button onClick={() => router.push("/login")} className="w-full mt-2" variant="outline">
            Already have an account? Login
          </Button>
          <Button onClick={() => router.push("/")} className="w-full mt-4" variant="secondary">
            Return to Hub
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}