import { useRef, useEffect, useState } from 'react'
import { highlightVariables } from '../../lib/parser'

/**
 * A prompt textarea that shows {{variable}} highlighting via a background layer.
 */
export default function PromptArea({ label, value, onChange, placeholder, minHeight = 120 }) {
  const [focused, setFocused] = useState(false)
  const textareaRef = useRef(null)
  const highlightRef = useRef(null)

  // Sync scroll between textarea and highlight layer
  const syncScroll = () => {
    if (highlightRef.current && textareaRef.current) {
      highlightRef.current.scrollTop  = textareaRef.current.scrollTop
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft
    }
  }

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <div className="flex items-center gap-2 px-1">
          <span className="text-[20px] font-mono uppercase tracking-widest text-[#3D444D]">
            {label}
          </span>
        </div>
      )}

      <div
        className="relative rounded-md overflow-hidden"
        style={{
          border: `1px solid ${focused ? '#388bfd' : '#30363D'}`,
          background: '#0D1117',
          transition: 'border-color 0.1s',
        }}
      >
        {/* Highlight layer (behind textarea) */}
        <div
          ref={highlightRef}
          aria-hidden
          className="absolute inset-0 px-3 py-2.5 font-mono text-xl text-transparent pointer-events-none overflow-hidden whitespace-pre-wrap break-words"
          style={{ minHeight, lineHeight: '1.6', wordBreak: 'break-word' }}
          dangerouslySetInnerHTML={{ __html: highlightVariables(value) + ' ' }}
        />

        {/* Actual textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={syncScroll}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          spellCheck={false}
          className="relative w-full bg-transparent text-[#E6EDF3] font-mono text-xl px-3 py-2.5 resize-none outline-none placeholder:text-[#3D444D]"
          style={{ minHeight, lineHeight: '1.6', caretColor: '#58A6FF', wordBreak: 'break-word' }}
        />
      </div>
    </div>
  )
}
