import { useRef, useEffect } from 'react'
import { motion } from 'motion/react'
import { StatusBadge } from '../ui/Badge'
import Button from '../ui/Button'

export default function OutputPanel({ output, status, stats, error, onCopy, onClear }) {
  const scrollRef = useRef(null)

  // Auto-scroll to bottom while streaming
  useEffect(() => {
    if (status === 'running' && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [output, status])

  const handleCopy = () => {
    navigator.clipboard.writeText(output)
    onCopy?.()
  }

  return (
    <div className="flex flex-col h-full">
      {/* Output header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#30363D] flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-[20px] font-mono uppercase tracking-widest text-[#3D444D]">Output</span>
          <StatusBadge status={status} />
        </div>
        <div className="flex items-center gap-1">
          {output && (
            <>
              <Button size="xs" variant="ghost" onClick={handleCopy} title="Copy output">
                📋 Copy
              </Button>
              <Button size="xs" variant="ghost" onClick={onClear} title="Clear output">
                ✕
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Output content */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-3 font-mono text-xl text-[#E6EDF3] leading-relaxed"
        style={{ background: '#0D1117' }}
      >
        {status === 'idle' && !output && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
            <div className="text-4xl opacity-20">▶</div>
            <p className="text-[#3D444D] text-lg font-mono">
              Fill in your prompt and click Run to see output here.
            </p>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 p-3 rounded bg-[#F8514910] border border-[#F8514940] text-[#F85149] text-lg font-mono">
            <span>✗</span>
            <div>
              <p className="font-semibold mb-1">Error</p>
              <p>{error}</p>
              {error.includes('API key') || error.includes('401') ? (
                <p className="mt-2 text-[#8B949E]">
                  Set your API key in{' '}
                  <a href="/settings" className="text-[#58A6FF] underline">Settings</a>.
                </p>
              ) : null}
            </div>
          </div>
        )}

        {output && (
          <div className="whitespace-pre-wrap break-words">
            {output}
            {status === 'running' && <span className="cursor-blink" />}
          </div>
        )}
      </div>

      {/* Stats bar */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 px-3 py-1.5 border-t border-[#30363D] flex-shrink-0"
        >
          {[
            { label: 'in',  val: stats.inputTokens  },
            { label: 'out', val: stats.outputTokens },
            { label: 'sec', val: stats.duration     },
          ].map(({ label, val }) => (
            <div key={label} className="flex items-center gap-1 font-mono text-[22px]">
              <span className="text-[#3D444D]">{label}</span>
              <span className="text-[#58A6FF]">{val}</span>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
