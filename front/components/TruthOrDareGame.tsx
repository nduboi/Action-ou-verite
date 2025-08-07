"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"

type Player = {
  name: string
  gender: "Homme" | "Femme"
}

type GameState = "setup" | "playing" | "finished"

export default function TruthOrDareGame() {
  const [players, setPlayers] = useState<Player[]>([])
  const [newPlayer, setNewPlayer] = useState<Player>({ name: "", gender: "Femme" })
  const [gameState, setGameState] = useState<GameState>("setup")
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null)
  const [challengeType, setChallengeType] = useState<"truth" | "dare" | null>(null)
  const [challenge, setChallenge] = useState<string>("")
  const [questionCount, setQuestionCount] = useState(0)
  const router = useRouter()

  const addPlayer = () => {
    if (newPlayer.name) {
      setPlayers([...players, newPlayer])
      setNewPlayer({ name: "", gender: "Femme" })
    }
  }

  const startGame = () => {
    if (players.length > 1) {
      setGameState("playing")
      selectRandomPlayer()
    }
  }

  const selectRandomPlayer = () => {
    const randomIndex = Math.floor(Math.random() * players.length)
    setCurrentPlayer(players[randomIndex])
    setChallengeType(null)
    setChallenge("")
  }

  const selectChallengeType = (type: "truth" | "dare") => {
    setChallengeType(type)
    // In a real app, you would fetch a challenge from an API or database here
    let params;
    if (type === "truth") {
      params = 1;
    } else {
      params = 2;
    }
    fetch(`/api/getChallenge?type=${params}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setChallenge(data.value);
      })
      .catch((error) => {
        console.error("Error fetching challenge:", error);
        setChallenge(`Failed to fetch ${type} challenge.`);
      });
  }

  const nextTurn = () => {
    const newQuestionCount = questionCount + 1
    if (newQuestionCount >= 20) {
      setGameState("finished")
    } else {
      setQuestionCount(newQuestionCount)
      selectRandomPlayer()
    }
  }

  const returnToHub = () => {
    router.push("/")
  }

  if (gameState === "setup") {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Ajouter des Joueurs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Nom du joueur"
              value={newPlayer.name}
              onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
            />
            <RadioGroup
              value={newPlayer.gender}
              onValueChange={(value) => setNewPlayer({ ...newPlayer, gender: value as "Homme" | "Femme" })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Femme" id="Femme" />
                <Label htmlFor="Femme">Femme</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Homme" id="Homme" />
                <Label htmlFor="Homme">Homme</Label>
              </div>
            </RadioGroup>
            <Button onClick={addPlayer} className="w-full">
              Ajouter un Joueur
            </Button>
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Joueurs :</h3>
              <ul>
                {players.map((player, index) => (
                  <li key={index}>
                    {player.name} ({player.gender})
                  </li>
                ))}
              </ul>
            </div>
            <Button onClick={() => router.push("/add-question")} className="w-full mt-2">
              Ajouter une Nouvelle Question
            </Button>
            <Button onClick={startGame} className="w-full" disabled={players.length < 2}>
              Démarrer le Jeu
            </Button>
            <Button onClick={returnToHub} className="w-full" variant="outline">
              Retour au Menu
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (gameState === "finished") {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Fin du Jeu</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg mb-4">Vous avez complété 20 questions !</p>
          <Button onClick={returnToHub} className="w-full">
            Retour au Menu
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{currentPlayer ? `Le joueur sélectionné est ${currentPlayer.name}` : "Choisir un Joueur"}</CardTitle>
        <p className="text-sm text-gray-500">Question {questionCount + 1} of 20</p>
      </CardHeader>
      <CardContent>
        {!challengeType ? (
          <div className="space-y-4">
            <Button onClick={() => selectChallengeType("dare")} className="w-full">
              Action
            </Button>
            <Button onClick={() => selectChallengeType("truth")} className="w-full">
              Verité
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-lg font-semibold">{challenge}</p>
            <Button onClick={nextTurn} className="w-full">
              Prochain tour
            </Button>
          </div>
        )}
        <Button onClick={returnToHub} className="w-full mt-4" variant="outline">
          Terminer le jeu et retourner au menu
        </Button>
      </CardContent>
    </Card>
  )
}

