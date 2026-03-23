import { useState } from 'react'
import { Link, useLocation } from 'react-router'
import { usePromptStore } from '../../store/prompt.store'

const NAV = [
  { to: '/editor',     icon: '⌨',  label: 'Editor' },
  { to: '/library',    icon: '📚', label: 'Library' },
  { to: '/templates',  icon: '✦',  label: 'Templates' },
  { to: '/playground', icon: '▶',  label: 'Playground' },
  { to: '/settings',   icon: '⚙',  label: 'Settings' },
]

export default function Sidebar() {
  const location = useLocation()
  const { prompts, loadPrompt } = usePromptStore()
  const [collapsed, setCollapsed] = useState(false)

  const pinned = prompts.filter((p) => p.pinned).slice(0, 5)
  const recent = prompts.filter((p) => !p.pinned).slice(0, 5)

  return (
    <aside
      className="flex flex-col h-full border-r border-[#30363D] bg-[#161B22] transition-all duration-200 flex-shrink-0"
      style={{ width: collapsed ? '48px' : '220px' }}
    >
      {/* Logo */}
      <div className="flex items-center border-b border-[#30363D]" style={{ height: '56px', padding: '0 12px' }}>
        {collapsed ? (
          <div className="flex items-center justify-center w-full">
            <span style={{ fontSize: '40px' }}>⚒</span>
          </div>
        ) : (
          <Link to="/" className="flex items-center gap-2.5 flex-1" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: '44px' }}>⚒</span>
            <span className="font-mono font-bold" style={{ fontSize: '40px', color: '#58A6FF', letterSpacing: '0.04em' }}>forge</span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="transition-colors flex-shrink-0"
          style={{ color: '#3D444D', background: 'none', border: 'none', fontSize: '36px', cursor: 'pointer', padding: '4px', marginLeft: collapsed ? '0' : '4px' }}
          onMouseEnter={e => e.currentTarget.style.color = '#8B949E'}
          onMouseLeave={e => e.currentTarget.style.color = '#3D444D'}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? '›' : '‹'}
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex flex-col py-2 border-b border-[#30363D]">
        {NAV.map(({ to, icon, label }) => {
          const active = location.pathname.startsWith(to)
          return (
            <Link
              key={to}
              to={to}
              title={collapsed ? label : ''}
              className={`flex items-center gap-2.5 px-3 py-2.5 text-2xl font-mono transition-colors rounded-none ${
                active
                  ? 'bg-[#1F6FEB20] text-[#58A6FF] border-l-2 border-[#58A6FF]'
                  : 'text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#21262D] border-l-2 border-transparent'
              }`}
            >
              <span className="text-4xl flex-shrink-0">{icon}</span>
              {!collapsed && <span className="truncate">{label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Library quick access */}
      {!collapsed && (
        <div className="flex-1 overflow-y-auto py-2 text-lg">
          {pinned.length > 0 && (
            <div className="mb-3">
              <div className="px-3 py-1 text-[#3D444D] font-mono uppercase tracking-widest text-[20px]">
                Pinned
              </div>
              {pinned.map((p) => (
                <Link
                  key={p.id}
                  to="/editor"
                  onClick={() => loadPrompt(p)}
                  className="flex items-center gap-2 px-3 py-1 text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#21262D] truncate font-mono"
                >
                  <span className="text-[#D29922]">📌</span>
                  <span className="truncate">{p.title}</span>
                </Link>
              ))}
            </div>
          )}

          {recent.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[#3D444D] font-mono uppercase tracking-widest text-[20px]">
                Recent
              </div>
              {recent.map((p) => (
                <Link
                  key={p.id}
                  to="/editor"
                  onClick={() => loadPrompt(p)}
                  className="flex items-center gap-2 px-3 py-1 text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#21262D] truncate font-mono"
                >
                  <span className="text-[#3D444D]">◦</span>
                  <span className="truncate">{p.title}</span>
                </Link>
              ))}
            </div>
          )}

          {prompts.length === 0 && (
            <div className="px-3 py-4 text-[#3D444D] font-mono text-[22px]">
              No saved prompts yet.<br />
              <Link to="/editor" className="text-[#58A6FF] hover:underline">Open editor →</Link>
            </div>
          )}
        </div>
      )}
    </aside>
  )
}
