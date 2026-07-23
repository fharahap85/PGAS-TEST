import { Menu } from 'lucide-react'

export function Header({ onMenuClick, title }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-surface-200 bg-white/80 backdrop-blur-sm px-6">
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 text-surface-600 hover:bg-surface-100 lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>
      <h2 className="text-lg font-semibold text-surface-900">{title}</h2>
    </header>
  )
}
