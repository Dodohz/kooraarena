import { useState } from 'react'
import { TabType, NavItem } from '../types'

interface HeaderProps {
  darkMode: boolean
  onToggleDarkMode: () => void
  activeTab: TabType
  onTabChange: (tab: TabType) => void
  liveCount: number
}

const NAV_ITEMS: NavItem[] = [
  { id: 'live', label: 'مباشر', icon: '🔴' },
  { id: 'today', label: 'اليوم', icon: '📅' },
  { id: 'tomorrow', label: 'غداً', icon: '🗓️' },
  { id: 'yesterday', label: 'أمس', icon: '⏪' },
]

export default function Header({ darkMode, onToggleDarkMode, activeTab, onTabChange, liveCount }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="site-header">
      {/* Top Bar */}
      <div className="header-topbar">
        <div className="header-container">
          {/* Logo */}
          <div className="header-logo">
            <div className="logo-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="11" fill="url(#logoGrad)" />
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="none" stroke="white" strokeWidth="0.5" opacity="0.3"/>
                <path d="M8 7l8 5-8 5V7z" fill="white" />
                <defs>
                  <linearGradient id="logoGrad" x1="0" y1="0" x2="24" y2="24">
                    <stop offset="0%" stopColor="#22c55e"/>
                    <stop offset="100%" stopColor="#15803d"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="logo-text">
              <span className="logo-name">KooraArena</span>
              <span className="logo-subtitle">بث مباشر للمباريات</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="header-nav desktop-only">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`nav-tab ${activeTab === item.id ? 'nav-tab--active' : ''}`}
              >
                <span className="nav-tab__icon">{item.icon}</span>
                <span className="nav-tab__label">{item.label}</span>
                {item.id === 'live' && liveCount > 0 && (
                  <span className="live-count-badge">{liveCount}</span>
                )}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="header-actions">
            {/* Search */}
            <button className="icon-btn" title="بحث">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>

            {/* Notifications */}
            <button className="icon-btn icon-btn--notify" title="الإشعارات">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              {liveCount > 0 && <span className="notify-dot" />}
            </button>

            {/* Dark Mode */}
            <button
              onClick={onToggleDarkMode}
              className="icon-btn icon-btn--theme"
              title={darkMode ? 'الوضع النهاري' : 'الوضع الليلي'}
            >
              {darkMode ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5"/>
                  <line x1="12" y1="1" x2="12" y2="3"/>
                  <line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/>
                  <line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              className="icon-btn mobile-only"
              onClick={() => setMenuOpen(!menuOpen)}
              title="القائمة"
            >
              {menuOpen ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="12" x2="21" y2="12"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {menuOpen && (
        <div className="mobile-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => { onTabChange(item.id); setMenuOpen(false) }}
              className={`mobile-nav-item ${activeTab === item.id ? 'mobile-nav-item--active' : ''}`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
              {item.id === 'live' && liveCount > 0 && (
                <span className="live-count-badge">{liveCount}</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Bottom Tabs (mobile) */}
      <div className="tab-bar mobile-only">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`tab-bar-item ${activeTab === item.id ? 'tab-bar-item--active' : ''}`}
          >
            <span className="tab-bar-icon">{item.icon}</span>
            <span className="tab-bar-label">{item.label}</span>
            {item.id === 'live' && liveCount > 0 && (
              <span className="live-count-badge live-count-badge--sm">{liveCount}</span>
            )}
          </button>
        ))}
      </div>
    </header>
  )
}
