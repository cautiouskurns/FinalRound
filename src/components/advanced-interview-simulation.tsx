'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { User, Bot } from 'lucide-react'

interface Message {
  text: string;
  isUser: boolean;
}

const SpeechToText: React.FC = () => {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [conversation, setConversation] = useState<Message[]>([])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        try {
          const recognitionInstance = new SpeechRecognition()
          recognitionInstance.continuous = true
          recognitionInstance.interimResults = true
          recognitionInstance.lang = 'en-US'

          recognitionInstance.onresult = (event) => {
            let currentTranscript = ''
            for (let i = 0; i < event.results.length; i++) {
              if (event.results[i].isFinal) {
                currentTranscript += event.results[i][0].transcript + ' '
              }
            }
            setTranscript(currentTranscript)
          }

          recognitionInstance.onend = () => {
            if (isListening) {
              recognitionInstance.start()
            }
          }

          setRecognition(recognitionInstance)
        } catch (err) {
          setError(`Error initializing speech recognition: ${err}`)
        }
      } else {
        setError('Speech recognition not supported in this browser')
      }
    }
  }, [isListening])

  const startListening = useCallback(() => {
    if (recognition) {
      recognition.start()
      setIsListening(true)
      setTranscript('')
    }
  }, [recognition])

  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop()
      setIsListening(false)
      if (transcript.trim()) {
        setConversation(prev => [...prev, { text: transcript.trim(), isUser: true }])
        // Simulate interviewer response (replace with actual logic later)
        setTimeout(() => {
          setConversation(prev => [...prev, { text: "Thank you for your response. Let's move on to the next question.", isUser: false }])
        }, 1000)
      }
    }
  }, [recognition, transcript])

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Interview Simulation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          <div className="w-1/4">
            <Avatar className="w-32 h-32 mx-auto">
              <AvatarImage src="/placeholder-avatar.png" alt="Interviewer" />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
          </div>
          <div className="w-3/4">
            <ScrollArea className="h-[400px] border rounded-md p-4">
              {conversation.map((message, index) => (
                <div key={index} className={`flex items-start mb-4 ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-start ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`rounded-full p-2 ${message.isUser ? 'bg-blue-500' : 'bg-gray-300'} mr-2`}>
                      {message.isUser ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-gray-700" />}
                    </div>
                    <div className={`max-w-[70%] rounded-lg p-3 ${message.isUser ? 'bg-blue-100 text-right' : 'bg-gray-100'}`}>
                      <p className={message.isUser ? 'text-blue-800' : 'text-gray-800'}>{message.text}</p>
                    </div>
                  </div>
                </div>
              ))}
              {isListening && (
                <div className="flex items-start justify-end mb-4">
                  <div className="flex items-start flex-row-reverse">
                    <div className="rounded-full p-2 bg-blue-500 mr-2">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="max-w-[70%] rounded-lg p-3 bg-blue-100 text-right">
                      <p className="text-blue-800">{transcript}</p>
                    </div>
                  </div>
                </div>
              )}
            </ScrollArea>
            <div className="mt-4 flex gap-2">
              <Button onClick={startListening} disabled={isListening}>
                {isListening ? 'Listening...' : 'Start Speaking'}
              </Button>
              <Button onClick={stopListening} disabled={!isListening} variant="secondary">
                Stop Speaking
              </Button>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default SpeechToText
