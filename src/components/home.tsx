'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Home as HomeIcon, BookOpen, MessageSquare, Settings, LayoutDashboard, Users } from 'lucide-react'

export function Home() {
  const [activeTab, setActiveTab] = useState<'home' | 'interview' | 'syllabus' | 'settings' | 'dashboard'>('home')
  const [question, setQuestion] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle the interview question submission here
    console.log('Submitted question:', question)
    setQuestion('')
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Main content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-6xl font-bold mb-6 text-center">FinalRound</h1>
          <p className="text-xl text-center mb-8">Giving Candidates Confidence</p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Prepare for Success</h2>
              <p>FinalRound helps you practice and refine your interview skills in a realistic, pressure-free environment. Our AI-powered system provides personalized feedback to help you improve.</p>
              <ul className="list-disc list-inside">
              </ul>
            </div>
            <div className="relative h-64 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
              <Users size={64} className="text-primary" />
            </div>
          </div>

          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Try it Now</CardTitle>
              <CardDescription>Experience a sample interview question</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="text"
                  placeholder="Type your answer here..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
                <Button type="submit">Submit Answer</Button>
              </form>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                This is just a preview. Sign up for full access to our interview simulator.
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}