'use client'

import React, { useState, useEffect, useRef } from 'react'
import { ConvaiClient } from "convai-web-sdk"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

const ConvaiTest: React.FC = () => {
  const [userText, setUserText] = useState("")
  const [npcText, setNpcText] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [isTalking, setIsTalking] = useState(false)
  const [isClientReady, setIsClientReady] = useState(false)
  const convaiClient = useRef<ConvaiClient | null>(null)
  const finalizedUserText = useRef("")
  const npcTextRef = useRef("")

  useEffect(() => {
    convaiClient.current = new ConvaiClient({
      apiKey: process.env.NEXT_PUBLIC_CONVAI_API_KEY!,
      characterId: process.env.NEXT_PUBLIC_CONVAI_CHARACTER_ID!,
      enableAudio: true,
      sessionId: "test-session",
      speaker: "default", // Add this line
      speakerId: "default", // Add this line
      narrativeTemplateKeysMap: new Map<string, string>(), // Add this line
    })

    convaiClient.current.setResponseCallback((response) => {
      if (response.hasUserQuery()) {
        const transcript = response.getUserQuery()
        const isFinal = transcript.getIsFinal()
        if (isFinal) {
          finalizedUserText.current += " " + transcript.getTextData()
        }
        setUserText(finalizedUserText.current + (isFinal ? "" : transcript.getTextData()))
      }
      if (response.hasAudioResponse()) {
        const audioResponse = response.getAudioResponse()
        npcTextRef.current += " " + audioResponse.getTextData()
        setNpcText(npcTextRef.current)
      }
    })

    convaiClient.current.onAudioPlay(() => {
      setIsTalking(true)
    })

    convaiClient.current.onAudioStop(() => {
      setIsTalking(false)
    })

    setIsClientReady(true)

    return () => {
      if (convaiClient.current) {
        convaiClient.current.setResponseCallback(() => {})
        convaiClient.current.onAudioPlay(() => {})
        convaiClient.current.onAudioStop(() => {})
      }
    }
  }, [])

  const startListening = () => {
    if (!isClientReady || !convaiClient.current || isListening) return
    setIsListening(true)
    finalizedUserText.current = ""
    npcTextRef.current = ""
    setUserText("")
    setNpcText("")
    convaiClient.current.startAudioChunk()
  }

  const stopListening = () => {
    if (!isClientReady || !convaiClient.current || !isListening) return
    setIsListening(false)
    convaiClient.current.endAudioChunk()
  }

  const sendText = () => {
    if (!isClientReady || !convaiClient.current || !userText) return
    finalizedUserText.current = ""
    npcTextRef.current = ""
    setNpcText("")
    convaiClient.current.sendTextChunk(userText)
    setUserText("")
  }

  const resetSession = () => {
    if (!isClientReady || !convaiClient.current) return
    convaiClient.current.resetSession()
    setUserText("")
    setNpcText("")
    finalizedUserText.current = ""
    npcTextRef.current = ""
  }

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Convai SDK Test</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">User Input:</h3>
            <p>{userText}</p>
          </div>
          <div>
            <h3 className="font-semibold">NPC Response:</h3>
            <p>{npcText}</p>
          </div>
          <div className="flex space-x-2">
            <Button
              onMouseDown={startListening}
              onMouseUp={stopListening}
              onMouseLeave={stopListening}
              disabled={!isClientReady || isTalking}
            >
              {isListening ? 'Listening...' : 'Hold to Speak'}
            </Button>
            <Input
              type="text"
              value={userText}
              onChange={(e) => setUserText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendText()}
              placeholder="Type your message..."
              disabled={!isClientReady || isTalking}
            />
            <Button onClick={sendText} disabled={!isClientReady || isTalking}>
              Send
            </Button>
            <Button onClick={resetSession} disabled={!isClientReady}>
              Reset Session
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ConvaiTest