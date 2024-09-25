'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { User, Bot } from 'lucide-react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { InterviewerAvatar } from './InterviewerAvatar'
import { Scene, SceneProps } from './scene'

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
  const [isSpeaking, setIsSpeaking] = useState(false)
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null)

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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      speechSynthesisRef.current = window.speechSynthesis
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices()
        setVoices(availableVoices)
        // Optionally set a default voice
        setSelectedVoice(availableVoices.find(voice => voice.lang === 'en-US') || availableVoices[0])
      }

      loadVoices()
      window.speechSynthesis.onvoiceschanged = loadVoices
    }
  }, [])

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

  const speakMessage = useCallback((text: string) => {
    if (speechSynthesisRef.current && selectedVoice) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.voice = selectedVoice
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      speechSynthesisRef.current.speak(utterance)
    }
  }, [selectedVoice])

  useEffect(() => {
    const lastMessage = conversation[conversation.length - 1]
    if (lastMessage && !lastMessage.isUser) {
      speakMessage(lastMessage.text)
    }
  }, [conversation, speakMessage])

  return (
    <Card className="w-full max-w-6xl mx-auto"> {/* Increased max-width */}
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Interview Simulation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4"> {/* Changed to column layout on small screens */}
          <div className="w-full md:w-1/2 h-[600px]"> {/* Increased width and height */}
            <Scene isSpeaking={isSpeaking} />
          </div>
          <div className="w-full md:w-1/2"> {/* Adjusted width */}
            <ScrollArea className="h-[600px] border rounded-md p-4"> {/* Increased height */}
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
            <div className="mt-4 flex gap-2 flex-wrap">
              <Button onClick={startListening} disabled={isListening}>
                {isListening ? 'Listening...' : 'Start Speaking'}
              </Button>
              <Button onClick={stopListening} disabled={!isListening} variant="secondary">
                Stop Speaking
              </Button>
              <select 
                value={selectedVoice?.name || ''}
                onChange={(e) => setSelectedVoice(voices.find(v => v.name === e.target.value) || null)}
                className="border rounded px-2 py-1"
              >
                {voices.map((voice) => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default SpeechToText
