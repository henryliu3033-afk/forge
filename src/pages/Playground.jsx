import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useSettingsStore } from '../store/settings.store'
import { streamMessage, MODELS } from '../lib/claude'
import Button from '../components/ui/Button'

function Message({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {/* Avatar */}
      <div
        className="w-6 h-6 rounded flex items-center justify-center text-[20px] font-mono flex-shrink-0 mt-0.5"
        style={{
          background: isUser ? '#1F6FEB' : '#238636',
          color: '#fff',
        }}
      >
        {isUser ? 'U' : 'AI'}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[75%] rounded-md px-3 py-2 font-mono text-xl whitespace-pre-wrap break-words ${
          isUser
            ? 'bg-[#1F6FEB20] border border-[#1F6FEB30] text-[#E6EDF3]'
            : 'bg-[#161B22] border border-[#30363D] text-[#E6EDF3]'
        }`}
      >
        {msg.content}
        {msg.streaming && <span className="cursor-blink ml-0.5" />}
      </div>
    </motion.div>
  )
}

export default function Playground() {
  const { apiKey, model, setModel } = useSettingsStore()
  const [messages, setMessages] = useState([])
  const [systemPrompt, setSystemPrompt] = useState('You are a helpful assistant.')
  const [input, setInput] = useState('')
  const [running, setRunning] = useState(false)
  const [showSystem, setShowSystem] = useState(false)
  const scrollRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const send = async () => {
    if (!input.trim() || running) return

    const userMsg = { role: 'user', content: input.trim() }
    const history = [...messages, userMsg]
    setMessages(history)
    setInput('')
    setRunning(true)

    // Add streaming assistant placeholder
    setMessages((prev) => [
      ...prev,
      { role: 'assistant', content: '', streaming: true },
    ])

    let accumulated = ''

    await streamMessage({
      system: systemPrompt,
      messages: history.map((m) => ({ role: m.role, content: m.content })),
      model,
      apiKey,
      onChunk: (chunk) => {
        accumulated += chunk
        setMessages((prev) =>
          prev.map((m, i) =>
            i === prev.length - 1 ? { ...m, content: accumulated } : m
          )
        )
      },
      onDone: () => {
        setMessages((prev) =>
          prev.map((m, i) =>
            i === prev.length - 1 ? { ...m, streaming: false } : m
          )
        )
        setRunning(false)
        inputRef.current?.focus()
      },
      onError: (err) => {
        setMessages((prev) =>
          prev.map((m, i) =>
            i === prev.length - 1
              ? { ...m, content: `[Error: ${err}]`, streaming: false }
              : m
          )
        )
        setRunning(false)
      },
    })
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-[#30363D] flex-shrink-0">
        <span className="font-mono text-xl text-[#E6EDF3] font-medium">▶ Playground</span>
        <div className="flex items-center gap-2 ml-auto">
          {/* Model selector */}
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="bg-[#21262D] border border-[#30363D] text-[#8B949E] font-mono text-lg px-2 py-1 rounded outline-none focus:border-[#388bfd]"
          >
            {MODELS.map((m) => (
              <option key={m.id} value={m.id}>{m.label}</option>
            ))}
          </select>
          <Button
            size="xs"
            variant="ghost"
            onClick={() => setShowSystem((v) => !v)}
          >
            ⚙ System
          </Button>
          <Button
            size="xs"
            variant="ghost"
            onClick={() => setMessages([])}
            disabled={messages.length === 0}
          >
            ✕ Clear
          </Button>
        </div>
      </div>

      {/* System prompt editor (collapsible) */}
      <AnimatePresence>
        {showSystem && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-[#30363D] flex-shrink-0"
          >
            <div className="px-4 py-3 bg-[#161B22]">
              <label className="block text-[20px] font-mono uppercase tracking-widest text-[#3D444D] mb-1.5">
                System Prompt
              </label>
              <textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                rows={3}
                className="w-full bg-[#0D1117] border border-[#30363D] text-[#E6EDF3] font-mono text-lg px-3 py-2 rounded outline-none focus:border-[#388bfd] resize-none placeholder:text-[#3D444D]"
                placeholder="You are a helpful assistant..."
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
            <div className="text-4xl opacity-10">▶</div>
            <p className="font-mono text-lg text-[#3D444D]">
              Start a conversation. Press <kbd className="px-1 py-0.5 bg-[#21262D] rounded text-[#8B949E]">Enter</kbd> to send.
            </p>
            <p className="font-mono text-lg text-[#3D444D]">
              <kbd className="px-1 py-0.5 bg-[#21262D] rounded text-[#8B949E]">Shift+Enter</kbd> for newline.
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {messages.map((msg, i) => (
              <Message key={i} msg={msg} />
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Input bar */}
      <div
        className="flex items-end gap-2 px-4 py-3 border-t border-[#30363D] flex-shrink-0"
        style={{ background: '#161B22' }}
      >
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message... (Enter to send, Shift+Enter for newline)"
          rows={1}
          className="flex-1 bg-[#0D1117] border border-[#30363D] text-[#E6EDF3] font-mono text-xl px-3 py-2 rounded outline-none focus:border-[#388bfd] resize-none placeholder:text-[#3D444D] transition-colors"
          style={{ maxHeight: '120px', minHeight: '38px' }}
        />
        <Button
          variant="primary"
          size="md"
          onClick={send}
          disabled={!input.trim() || running}
          className="flex-shrink-0"
        >
          {running ? <span className="animate-pulse">●</span> : '↑'}
        </Button>
      </div>
    </div>
  )
}
