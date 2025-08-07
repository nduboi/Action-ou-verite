"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Flame, ArrowLeft, User } from "lucide-react"

export default function AllChallenges() {
  const [challenges, setChallenges] = useState<any[]>([])
  const [filter, setFilter] = useState("all")
  const router = useRouter()

  useEffect(() => {
    setChallenges([])
    fetch("/api/getAllChallenge")
      .then((response) => response.json())
      .then((data) => setChallenges(data))
      .catch((error) => console.error("Error fetching challenges:", error))
  }, [])

  const filteredChallenges = challenges.filter((challenge) => filter === "all" || challenge.TYPE === filter)

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-600 to-red-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-red-600 p-4 flex items-center justify-between">
          <CardTitle className="text-2xl font-bold text-white flex items-center">
            <Flame className="mr-2" /> Tous les Défis
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={() => router.push("/")} className="text-white hover:bg-red-700">
            <ArrowLeft />
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          <RadioGroup value={filter} onValueChange={setFilter} className="flex justify-center space-x-4 mb-6">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all">Tous</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="veritee" id="truth" />
              <Label htmlFor="truth">Vérité</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="action" id="dare" />
              <Label htmlFor="dare">Action</Label>
            </div>
          </RadioGroup>
          <ScrollArea className="h-[400px] pr-4">
            {filteredChallenges.length > 0 ? (
              <div className="space-y-4">
                {filteredChallenges.map((challenge) => (
                  <div key={challenge.id} className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className={`font-semibold ${challenge.TYPE === "action" ? "text-blue-600" : "text-green-600"}`}>
                        {challenge.TYPE === "action" ? "Action" : "Vérité"}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600">
                        <User className="w-4 h-4 mr-1" />
                        {challenge.username}
                      </div>
                    </div>
                    <p className="text-gray-700">{challenge.value}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 text-lg">Aucun Challenge</p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
