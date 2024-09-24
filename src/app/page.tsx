'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/components-header'
import { InterviewSimulation } from '@/components/components-interview-simulation'
import { Syllabus } from '@/components/components-syllabus'
import { Dashboard } from '@/components/Dashboard'
import { Settings as SettingsComponent } from '@/components/settings'
import { Home as HomeIcon, BookOpen, MessageSquare, Settings as SettingsIcon, LayoutDashboard, Mic } from 'lucide-react'
import { Home } from '@/components/home'
import React from 'react'
import SpeechToText from '@/components/advanced-interview-simulation'
import ClientSpeechToText from '@/components/advanced-interview-simulation'

// Remove or comment out these lines:
// const HomePage = () => <div>Home Page Content</div>
// const SettingsPage = () => <div>Settings Page Content</div>

export default function Page() {
  const [activeTab, setActiveTab] = useState<'home' | 'interview' | 'syllabus' | 'settings' | 'dashboard' | 'speechToText'>('home')

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
              <HomeIcon className="h-4 w-4" />
              Home
            </Link>

            <Link
              href="#"
              onClick={() => setActiveTab('interview')}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition-all hover:text-primary 
                ${activeTab === 'interview' ? 'bg-muted text-primary' : 'text-muted-foreground'}`}
            >
              <MessageSquare className="h-4 w-4" />
              Test Questions
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
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition-all hover:text-primary 
                ${activeTab === 'dashboard' ? 'bg-muted text-primary' : 'text-muted-foreground'}`}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>

            <Link
              href="#"
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition-all hover:text-primary 
                ${activeTab === 'settings' ? 'bg-muted text-primary' : 'text-muted-foreground'}`}
            >
              <SettingsIcon className="h-4 w-4" />
              Settings
            </Link>

            <Link
              href="#"
              onClick={() => setActiveTab('speechToText')}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition-all hover:text-primary 
                ${activeTab === 'speechToText' ? 'bg-muted text-primary' : 'text-muted-foreground'}`}
            >
              <Mic className="h-4 w-4" />
              Speech to Text
            </Link>
          </nav>
        </aside>

        <main className="flex-1 p-6">
          {activeTab === 'home' && <Home />}
          {activeTab === 'interview' && <InterviewSimulation />}
          {activeTab === 'syllabus' && <Syllabus />}
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'settings' && <SettingsComponent />}
          {activeTab === 'speechToText' && <ClientSpeechToText />}
        </main>
      </div>
    </div>
  )
}

