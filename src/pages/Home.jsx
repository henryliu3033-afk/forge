import { Link } from 'react-router'
import { motion } from 'motion/react'
import { usePromptStore } from '../store/prompt.store'
import { useSettingsStore } from '../store/settings.store'
import { TEMPLATES } from '../constants/templates'
import { TagBadge } from '../components/ui/Badge'
import Button from '../components/ui/Button'

const FEATURES = [
  {
    icon: '⌨',
    title: 'Smart Editor',
    desc: '{{variable}} syntax, auto-detection, and inline filling. Write prompts that are reusable by design.',
    color: '#58A6FF',
  },
  {
    icon: '▶',
    title: 'Live Streaming',
    desc: 'Run prompts and watch results stream in real-time. No waiting for the full response.',
    color: '#3FB950',
  },
  {
    icon: '✦',
    title: '20+ Templates',
    desc: 'Start fast with battle-tested templates for writing, code, analysis, and more.',
    color: '#D29922',
  },
  {
    icon: '💾',
    title: 'Local Library',
    desc: 'All your prompts stored locally. Pin favorites, search, organize with tags.',
    color: '#BC8CFF',
  },
]

export default function Home() {
  const { prompts, history } = usePromptStore()
  const { apiKey, model } = useSettingsStore()
  const recentHistory = history.slice(0, 3)
  const featuredTemplates = TEMPLATES.slice(0, 6)

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-lg text-[#3D444D]">v1.0.0</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#3FB950]" />
            <span className="font-mono text-lg text-[#3FB950]">ready</span>
          </div>
          <h1 className="font-mono text-5xl font-bold text-[#E6EDF3] mb-2">
            ⚒ Forge
          </h1>
          <p className="font-mono text-xl text-[#8B949E] max-w-lg mb-5">
            AI prompt engineering studio. Write smarter prompts with variables,
            test against Claude, and build your personal prompt library.
          </p>
          <div className="flex items-center gap-3">
            <Link to="/editor">
              <Button variant="primary" size="lg">Open Editor ↗</Button>
            </Link>
            <Link to="/templates">
              <Button variant="outline" size="lg">Browse Templates</Button>
            </Link>
          </div>
        </motion.div>

        {/* Status bar */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: 'Saved Prompts', val: prompts.length, icon: '📚' },
            { label: 'Runs Today',    val: history.length, icon: '▶' },
            { label: 'API Mode',      val: apiKey ? 'Key' : 'Artifacts', icon: '⚡' },
          ].map(({ label, val, icon }) => (
            <div key={label} className="flex items-center gap-3 px-4 py-3 rounded-md border border-[#30363D] bg-[#161B22]">
              <span className="text-3xl">{icon}</span>
              <div>
                <p className="font-mono text-3xl text-[#58A6FF] font-semibold leading-none">{val}</p>
                <p className="font-mono text-lg text-[#3D444D] mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Features grid */}
        <div className="mb-8">
          <h2 className="font-mono text-lg uppercase tracking-widest text-[#3D444D] mb-4">Features</h2>
          <div className="grid grid-cols-2 gap-3">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                className="p-4 rounded-md border border-[#30363D] bg-[#161B22]"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{f.icon}</span>
                  <span className="font-mono text-xl font-medium" style={{ color: f.color }}>{f.title}</span>
                </div>
                <p className="font-mono text-lg text-[#8B949E] leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        {recentHistory.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-mono text-lg uppercase tracking-widest text-[#3D444D]">Recent Runs</h2>
              <Link to="/library" className="font-mono text-lg text-[#58A6FF] hover:underline">View library →</Link>
            </div>
            <div className="flex flex-col gap-2">
              {recentHistory.map((h) => (
                <div key={h.id} className="flex items-center gap-3 px-3 py-2 rounded border border-[#30363D] bg-[#161B22]">
                  <span className="text-[#3FB950] text-lg">✓</span>
                  <span className="font-mono text-lg text-[#E6EDF3] truncate flex-1">{h.promptTitle}</span>
                  <span className="font-mono text-[20px] text-[#3D444D]">
                    {new Date(h.runAt).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Featured templates */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-mono text-lg uppercase tracking-widest text-[#3D444D]">Quick Templates</h2>
            <Link to="/templates" className="font-mono text-lg text-[#58A6FF] hover:underline">All {TEMPLATES.length} templates →</Link>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {featuredTemplates.map((tpl) => (
              <Link
                key={tpl.id}
                to="/templates"
                className="flex items-center gap-3 px-3 py-2.5 rounded border border-[#30363D] bg-[#161B22] hover:border-[#3D444D] hover:bg-[#21262D] transition-colors group"
              >
                <TagBadge tag={tpl.tag} />
                <span className="font-mono text-lg text-[#8B949E] group-hover:text-[#E6EDF3] transition-colors truncate">
                  {tpl.title}
                </span>
                <span className="ml-auto text-[#3D444D] group-hover:text-[#8B949E] text-lg">→</span>
              </Link>
            ))}
          </div>
        </div>

        {/* API Key reminder if not set */}
        {!apiKey && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 rounded-md border border-[#D2992230] bg-[#D2992210]"
          >
            <div className="flex items-start gap-3">
              <span className="text-[#D29922]">⚠</span>
              <div>
                <p className="font-mono text-xl text-[#D29922] font-medium mb-1">No API Key</p>
                <p className="font-mono text-lg text-[#8B949E] mb-2">
                  Running in Artifacts mode — works inside Claude.ai only.
                  Add your API key to use Forge anywhere.
                </p>
                <Link to="/settings">
                  <Button variant="outline" size="sm">Add API Key →</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
