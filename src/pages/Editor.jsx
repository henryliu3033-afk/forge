import { useState } from 'react'
import { motion } from 'motion/react'
import PromptArea from '../components/editor/PromptArea'
import VariablePanel from '../components/editor/VariablePanel'
import OutputPanel from '../components/editor/OutputPanel'
import Button from '../components/ui/Button'
import { StatusBadge } from '../components/ui/Badge'
import { usePromptStore } from '../store/prompt.store'
import { useSettingsStore } from '../store/settings.store'
import { fillVariables } from '../lib/parser'
import useStream from '../hooks/useStream'

export default function Editor() {
  const { current, setCurrent, savePrompt, addHistory } = usePromptStore()
  const { model } = useSettingsStore()
  const { output, status, stats, error, run, reset } = useStream()
  const [showSavedToast, setShowSavedToast] = useState(false)
  const [showCopiedToast, setShowCopiedToast] = useState(false)
  const [systemCollapsed, setSystemCollapsed] = useState(false)

  const handleRun = async () => {
    if (status === 'running') return
    reset()

    const filledSystem = fillVariables(current.system, current.variables)
    const filledUser   = fillVariables(current.userPrompt, current.variables)

    if (!filledUser.trim()) return

    await run({
      system:   filledSystem,
      messages: [{ role: 'user', content: filledUser }],
    })

    addHistory({
      promptTitle: current.title,
      system: filledSystem,
      userPrompt: filledUser,
      variables: { ...current.variables },
    })
  }

  const handleSave = () => {
    savePrompt({ ...current })
    setShowSavedToast(true)
    setTimeout(() => setShowSavedToast(false), 2000)
  }

  const handleCopy = () => {
    setShowCopiedToast(true)
    setTimeout(() => setShowCopiedToast(false), 2000)
  }

  return (
    <div className="flex flex-col h-full">
      {/* ── Tab bar ── */}
      <div className="flex items-center h-9 border-b border-[#30363D] bg-[#161B22] flex-shrink-0">
        <div className="tab-active flex items-center gap-2 px-4 h-full text-lg font-mono border-r border-[#30363D]">
          <span className="text-[#8B949E]">⌨</span>
          <input
            value={current.title}
            onChange={(e) => setCurrent({ title: e.target.value })}
            className="bg-transparent text-[#E6EDF3] outline-none w-36 text-lg font-mono"
          />
          {showSavedToast && <span className="text-[#3FB950] text-[20px]">saved ✓</span>}
        </div>
        <div className="flex items-center gap-1.5 ml-auto px-3">
          <span className="font-mono text-[22px] text-[#3D444D]">model:</span>
          <span className="font-mono text-[22px] text-[#58A6FF]">{model.split('-')[1] || 'sonnet'}</span>
        </div>
      </div>

      {/* ── Main layout ── */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">

        {/* ── LEFT: Prompt panels ── */}
        <div className="flex flex-col border-b md:border-b-0 md:border-r border-[#30363D] overflow-y-auto md:w-[55%]">

          {/* System prompt */}
          <div className="border-b border-[#30363D]">
            <button
              className="flex items-center gap-2 w-full px-3 py-2 text-[20px] font-mono uppercase tracking-widest text-[#3D444D] hover:text-[#8B949E] hover:bg-[#21262D] transition-colors"
              onClick={() => setSystemCollapsed((v) => !v)}
            >
              <span>{systemCollapsed ? '▶' : '▼'}</span>
              <span>System Prompt</span>
              {current.system && <span className="text-[#3FB950]">●</span>}
            </button>
            {!systemCollapsed && (
              <div className="px-3 pb-3">
                <PromptArea
                  value={current.system}
                  onChange={(v) => setCurrent({ system: v })}
                  placeholder="You are a helpful assistant..."
                  minHeight={80}
                />
              </div>
            )}
          </div>

          {/* User prompt */}
          <div className="flex-1 px-3 py-3">
            <PromptArea
              label="User Prompt"
              value={current.userPrompt}
              onChange={(v) => setCurrent({ userPrompt: v })}
              placeholder={'Write your prompt here...\n\nUse {{variable}} for dynamic values.'}
              minHeight={200}
            />
          </div>

          {/* Variables panel */}
          <div className="border-t border-[#30363D]">
            <div className="px-3 py-1.5 text-[20px] font-mono uppercase tracking-widest text-[#3D444D]">
              Variables
            </div>
            <VariablePanel
              systemPrompt={current.system}
              userPrompt={current.userPrompt}
              variables={current.variables}
              onChange={(v) => setCurrent({ variables: v })}
            />
          </div>

          {/* Action bar */}
          <div className="flex items-center gap-2 px-3 py-2.5 border-t border-[#30363D] bg-[#161B22] flex-shrink-0">
            <Button
              variant="primary"
              size="md"
              onClick={handleRun}
              disabled={status === 'running' || !current.userPrompt.trim()}
              className="min-w-20"
            >
              {status === 'running' ? (
                <><span className="animate-pulse">●</span> Running</>
              ) : (
                <><span>▶</span> Run</>
              )}
            </Button>
            <Button variant="outline" size="md" onClick={handleSave}>
              💾 Save
            </Button>
            <Button
              variant="ghost"
              size="md"
              onClick={() => { setCurrent({ system: '', userPrompt: '', variables: {} }); reset() }}
            >
              ✕ Clear
            </Button>
            <div className="ml-auto">
              <StatusBadge status={status} />
            </div>
          </div>
        </div>

        {/* ── RIGHT: Output ── */}
        <div className="flex-1 overflow-hidden">
          <OutputPanel
            output={output}
            status={status}
            stats={stats}
            error={error}
            onCopy={handleCopy}
            onClear={reset}
          />
        </div>
      </div>

      {/* Copied toast */}
      {showCopiedToast && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed bottom-6 right-6 bg-[#238636] text-white text-lg font-mono px-3 py-2 rounded"
        >
          ✓ Copied to clipboard
        </motion.div>
      )}
    </div>
  )
}
