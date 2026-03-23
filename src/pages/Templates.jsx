import { useState } from 'react'
import { Link } from 'react-router'
import { motion } from 'motion/react'
import { TEMPLATES, TEMPLATE_TAGS, getTemplatesByTag } from '../constants/templates'
import { usePromptStore } from '../store/prompt.store'
import { TagBadge } from '../components/ui/Badge'
import Button from '../components/ui/Button'

function TemplateCard({ tpl, onFork, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="group rounded-md border border-[#30363D] bg-[#161B22] hover:border-[#3D444D] transition-all overflow-hidden flex flex-col"
    >
      <div className="p-4 flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-mono text-xl text-[#E6EDF3] font-medium">{tpl.title}</h3>
          <TagBadge tag={tpl.tag} />
        </div>
        <p className="font-mono text-lg text-[#8B949E] mb-3 line-clamp-2">
          {tpl.description}
        </p>
        {/* Variable preview */}
        {Object.keys(tpl.variables).length > 0 && (
          <div className="flex flex-wrap gap-1">
            {Object.keys(tpl.variables).map((v) => (
              <span key={v} className="font-mono text-[20px] px-1.5 py-0.5 rounded bg-[#D2992215] text-[#D29922] border border-[#D2992225]">
                {'{{'}{v}{'}}'}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="border-t border-[#30363D] flex">
        <Link
          to="/editor"
          onClick={() => onFork(tpl)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 font-mono text-lg text-[#58A6FF] hover:bg-[#1F6FEB15] transition-colors"
        >
          ⎋ Fork to Editor
        </Link>
      </div>
    </motion.div>
  )
}

export default function Templates() {
  const [activeTag, setActiveTag] = useState('All')
  const [search, setSearch] = useState('')
  const { setCurrent, resetCurrent } = usePromptStore()

  const handleFork = (tpl) => {
    setCurrent({
      title:       tpl.title + ' (fork)',
      system:      tpl.system,
      userPrompt:  tpl.userPrompt,
      variables:   { ...tpl.variables },
      tags:        [tpl.tag],
    })
  }

  const templates = getTemplatesByTag(activeTag).filter((t) =>
    !search.trim() ||
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#30363D] flex-shrink-0">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div>
            <span className="font-mono text-xl text-[#E6EDF3] font-medium">Template Library</span>
            <span className="font-mono text-lg text-[#3D444D] ml-2">({TEMPLATES.length} templates)</span>
          </div>
          <div className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[#3D444D] text-lg">⌕</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search templates..."
              className="pl-6 pr-3 py-1 bg-[#0D1117] border border-[#30363D] text-[#E6EDF3] font-mono text-lg rounded outline-none focus:border-[#388bfd] w-48 placeholder:text-[#3D444D]"
            />
          </div>
        </div>
        {/* Tag filters */}
        <div className="flex gap-1.5 flex-wrap">
          {TEMPLATE_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-3 py-1 font-mono text-lg rounded border transition-colors ${
                activeTag === tag
                  ? 'bg-[#1F6FEB] text-white border-[#1F6FEB]'
                  : 'bg-transparent text-[#8B949E] border-[#30363D] hover:border-[#3D444D] hover:text-[#E6EDF3]'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {templates.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 gap-2">
            <p className="font-mono text-lg text-[#3D444D]">No templates found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {templates.map((tpl, i) => (
              <TemplateCard key={tpl.id} tpl={tpl} onFork={handleFork} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
