'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/components-header'
import { InterviewSimulation } from '@/components/components-interview-simulation'
import { Syllabus } from '@/components/components-syllabus'
import { Home, BookOpen, MessageSquare, Settings } from 'lucide-react'

// Placeholder components for Home and Settings
const HomePage = () => <div>Home Page Content</div>
const SettingsPage = () => <div>Settings Page Content</div>

export default function Page() {
  const [activeTab, setActiveTab] = useState<'home' | 'interview' | 'syllabus' | 'settings'>('home')

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <div className="flex-1 flex">
        <aside className="w-64 border-r">
          <nav className="grid items-start gap-2 px-4 py-4">
            <Link
              href="#"
              onClick={() => setActiveTab('home')}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition-all hover:text-primary 
                ${activeTab === 'home' ? 'bg-muted text-primary' : 'text-muted-foreground'}`}
            >
              <Home className="h-4 w-4" />
              Home
            </Link>

            <Link
              href="#"
              onClick={() => setActiveTab('interview')}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition-all hover:text-primary 
                ${activeTab === 'interview' ? 'bg-muted text-primary' : 'text-muted-foreground'}`}
            >
              <MessageSquare className="h-4 w-4" />
              Interview Simulation
            </Link>

            <Link
              href="#"
              onClick={() => setActiveTab('syllabus')}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition-all hover:text-primary 
                ${activeTab === 'syllabus' ? 'bg-muted text-primary' : 'text-muted-foreground'}`}
            >
              <BookOpen className="h-4 w-4" />
              Syllabus
            </Link>

            <Link
              href="#"
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition-all hover:text-primary 
                ${activeTab === 'settings' ? 'bg-muted text-primary' : 'text-muted-foreground'}`}
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </nav>
        </aside>

        <main className="flex-1 p-6">
          {activeTab === 'home' && <HomePage />}
          {activeTab === 'interview' && <InterviewSimulation />}
          {activeTab === 'syllabus' && <Syllabus />}
          {activeTab === 'settings' && <SettingsPage />}
        </main>
      </div>
    </div>
  )
}

