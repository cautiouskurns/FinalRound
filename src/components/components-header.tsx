import React from 'react';
import Link from 'next/link';
import { Zap } from 'lucide-react'

export function Header() {
  return (
    <header className="flex items-center justify-between h-16 px-6 bg-[#1e2337] text-white">
      <div className="flex items-center gap-4">
        <Zap className="h-6 w-6 text-[#ff3366]" />
        <span className="text-xl font-semibold">FinalRound</span>
      </div>
      <nav className="flex-grow">
        <ul className="flex justify-center space-x-8">
          <li className="relative group">
            <span className="cursor-pointer hover:text-gray-300">Features</span>
            <ul className="absolute hidden group-hover:block bg-[#1e2337] text-white mt-2 py-2 w-48 rounded-md shadow-lg">
              <li><Link href="/features/interview-prep" className="block px-4 py-2 hover:bg-[#2a305e]">Interview Prep</Link></li>
              <li><Link href="/features/coding-challenges" className="block px-4 py-2 hover:bg-[#2a305e]">Coding Challenges</Link></li>
              <li><Link href="/features/mock-interviews" className="block px-4 py-2 hover:bg-[#2a305e]">Mock Interviews</Link></li>
            </ul>
          </li>
          <li className="relative group">
            <span className="cursor-pointer hover:text-gray-300">Solutions</span>
            <ul className="absolute hidden group-hover:block bg-[#1e2337] text-white mt-2 py-2 w-48 rounded-md shadow-lg">
              <li><Link href="/solutions/for-individuals" className="block px-4 py-2 hover:bg-[#2a305e]">For Individuals</Link></li>
              <li><Link href="/solutions/for-teams" className="block px-4 py-2 hover:bg-[#2a305e]">For Teams</Link></li>
              <li><Link href="/solutions/for-enterprises" className="block px-4 py-2 hover:bg-[#2a305e]">For Enterprises</Link></li>
            </ul>
          </li>
          <li><Link href="/resources" className="hover:text-gray-300">Resources</Link></li>
          <li><Link href="/customers" className="hover:text-gray-300">Customers</Link></li>
          <li><Link href="/pricing" className="hover:text-gray-300">Pricing</Link></li>
        </ul>
      </nav>
      <div className="flex items-center gap-4">
        <Link href="/trial" className="bg-[#ff3366] text-white px-4 py-2 rounded-md text-sm hover:bg-[#ff1f59]">Start free trial</Link>
        <Link href="/demo" className="bg-white text-[#1e2337] px-4 py-2 rounded-md text-sm hover:bg-gray-200">Book demo</Link>
        <Link href="/login" className="text-sm hover:text-gray-300">Log in</Link>
      </div>
    </header>
  )
}