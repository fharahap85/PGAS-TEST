import { Menu } from 'lucide-react'

export function Header({ onMenuClick, title }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-surface-200/50 bg-white/70 backdrop-blur-md px-6">
      <button
        onClick={onMenuClick}
        className="rounded-xl p-2 text-surface-600 hover:bg-surface-100/80 transition-colors lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>
      <h2 className="text-base font-extrabold text-surface-900 tracking-tight">{title}</h2>
    </header>
  )
}
