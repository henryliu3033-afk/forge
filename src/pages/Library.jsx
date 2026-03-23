import { useState, useMemo } from 'react'
import { Link } from 'react-router'
import { motion, AnimatePresence } from 'motion/react'
import { usePromptStore } from '../store/prompt.store'
import { TagBadge } from '../components/ui/Badge'
import Button from '../components/ui/Button'

function PromptCard({ prompt, onLoad, onDelete, onPin }) {
  const [confirm, setConfirm] = useState(false)
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="group rounded-md border border-[#30363D] bg-[#161B22] hover:border-[#3D444D] transition-colors overflow-hidden"
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-mono text-xl text-[#E6EDF3] font-medium truncate">{prompt.title}</h3>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
            <button
              onClick={() => onPin(prompt.id)}
              className="text-[#3D444D] hover:text-[#D29922] transition-colors text-lg"
              title={prompt.pinned ? 'Unpin' : 'Pin'}
            >
              {prompt.pinned ? '📌' : '○'}
            </button>
            {!confirm ? (
              <button onClick={() => setConfirm(true)} className="text-[#3D444D] hover:text-[#F85149] transition-colors text-lg" title="Delete">✕</button>
            ) : (
              <span className="flex items-center gap-1">
                <button onClick={() => onDelete(prompt.id)} className="text-[#F85149] text-[20px] font-mono hover:underline">del?</button>
                <button onClick={() => setConfirm(false)} className="text-[#3D444D] text-[20px] font-mono">no</button>
              </span>
            )}
          </div>
        </div>

        {/* Preview */}
        <p className="font-mono text-lg text-[#8B949E] line-clamp-2 mb-3">
          {prompt.userPrompt || prompt.system || 'Empty prompt'}
        </p>

        {/* Tags row */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5 flex-wrap">
            {prompt.tags?.map((t) => <TagBadge key={t} tag={t} />)}
          </div>
          <span className="font-mono text-[20px] text-[#3D444D]">
            {new Date(prompt.updatedAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="border-t border-[#30363D] flex">
        <Link to="/editor" onClick={() => onLoad(prompt)}
          className="flex-1 text-center py-2 font-mono text-lg text-[#58A6FF] hover:bg-[#1F6FEB15] transition-colors">
          Open in Editor →
        </Link>
      </div>
    </motion.div>
  )
}

export default function Library() {
  const { prompts, deletePrompt, togglePin, loadPrompt } = usePromptStore()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const filtered = useMemo(() => {
    let list = prompts
    if (filter === 'pinned') list = list.filter((p) => p.pinned)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((p) =>
        p.title.toLowerCase().includes(q) ||
        p.userPrompt?.toLowerCase().includes(q) ||
        p.system?.toLowerCase().includes(q)
      )
    }
    return list
  }, [prompts, search, filter])

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[#30363D] flex-shrink-0">
        <span className="font-mono text-xl text-[#E6EDF3] font-medium">My Library</span>
        <span className="font-mono text-lg text-[#3D444D]">({prompts.length} prompts)</span>
        <div className="ml-auto flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[#3D444D] text-lg">⌕</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="pl-6 pr-3 py-1 bg-[#0D1117] border border-[#30363D] text-[#E6EDF3] font-mono text-lg rounded outline-none focus:border-[#388bfd] w-44 placeholder:text-[#3D444D]"
            />
          </div>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}
            className="bg-[#21262D] border border-[#30363D] text-[#8B949E] font-mono text-lg px-2 py-1 rounded outline-none">
            <option value="all">All</option>
            <option value="pinned">Pinned</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
            <div className="text-5xl opacity-10">📚</div>
            <p className="font-mono text-xl text-[#3D444D]">
              {prompts.length === 0 ? 'No saved prompts yet.' : 'No prompts match your search.'}
            </p>
            {prompts.length === 0 && (
              <Link to="/editor" className="font-mono text-lg text-[#58A6FF] hover:underline">
                Open Editor to create your first prompt →
              </Link>
            )}
          </div>
        ) : (
          <AnimatePresence>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {filtered.map((p) => (
                <PromptCard key={p.id} prompt={p} onLoad={loadPrompt} onDelete={deletePrompt} onPin={togglePin} />
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
