import { useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router'
import { AnimatePresence } from 'motion/react'
import Sidebar from './components/layout/Sidebar'
import Home       from './pages/Home'
import Editor     from './pages/Editor'
import Library    from './pages/Library'
import Templates  from './pages/Templates'
import Playground from './pages/Playground'
import Settings   from './pages/Settings'

const MOB_NAV = [
  { to: '/editor',     icon: '⌨', label: 'Editor' },
  { to: '/library',    icon: '📚', label: 'Library' },
  { to: '/templates',  icon: '✦',  label: 'Templates' },
  { to: '/playground', icon: '▶',  label: 'Play' },
  { to: '/settings',   icon: '⚙',  label: 'Settings' },
]

function AppLayout() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <div className="flex h-screen overflow-hidden bg-[#0D1117]">
      {/* Desktop sidebar — hidden on home and on mobile */}
      {!isHome && (
        <div className="hidden md:flex">
          <Sidebar />
        </div>
      )}

      {/* Main area */}
      <main className="flex-1 overflow-hidden flex flex-col">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/"           element={<Home />} />
            <Route path="/editor"     element={<Editor />} />
            <Route path="/library"    element={<Library />} />
            <Route path="/templates"  element={<Templates />} />
            <Route path="/playground" element={<Playground />} />
            <Route path="/settings"   element={<Settings />} />
          </Routes>
        </AnimatePresence>

        {/* Mobile bottom nav — only shown when not on home */}
        {!isHome && (
          <nav className="md:hidden flex border-t border-[#30363D] bg-[#161B22] flex-shrink-0"
            style={{ height: '56px' }}>
            {MOB_NAV.map(({ to, icon, label }) => {
              const active = location.pathname.startsWith(to)
              return (
                <Link key={to} to={to}
                  className="flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors"
                  style={{ color: active ? '#58A6FF' : '#8B949E' }}>
                  <span className="text-2xl leading-none">{icon}</span>
                  <span className="text-[18px] font-mono">{label}</span>
                </Link>
              )
            })}
          </nav>
        )}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  )
}
