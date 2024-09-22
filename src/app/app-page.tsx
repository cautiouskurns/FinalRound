'use client'

import { useState } from 'react'
import { Header } from '@/components/components-header'
import { InterviewSimulation } from '@/components/components-interview-simulation'
import { Syllabus } from '@/components/components-syllabus'   
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function Page() {
  const [activeTab, setActiveTab] = useState<'interview' | 'syllabus'>('interview')

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 p-6">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'interview' | 'syllabus')} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="interview">Interview Simulation</TabsTrigger>
            <TabsTrigger value="syllabus">Syllabus</TabsTrigger>
          </TabsList>
          <TabsContent value="interview">
            <InterviewSimulation />
          </TabsContent>
          <TabsContent value="syllabus">
            <Syllabus />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}