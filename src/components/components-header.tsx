import { Zap, UserCircle } from 'lucide-react'

export function Header() {
  return (
    <header className="flex items-center justify-between h-14 px-4 border-b shrink-0 md:px-6 bg-black text-white">
      <div className="flex items-center gap-2">
        <Zap className="h-6 w-6 text-primary" />
        <span className="text-lg font-semibold">FinalRound</span>
      </div>
      <div>
        <UserCircle className="h-6 w-6 cursor-pointer" />
      </div>
    </header>
  )
}