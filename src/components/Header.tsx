import { useState } from 'react'

interface HeaderProps {
  darkMode: boolean
  onToggleDarkMode: () => void
}

export default function Header({ darkMode, onToggleDarkMode }: HeaderProps) {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-lg transition-colors">
      <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-4xl">⚽</span>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              KooraArena
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              المباريات المباشرة
            </p>
          </div>
        </div>
        <button
          onClick={onToggleDarkMode}
          className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          aria-label="Toggle dark mode"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  )
}
