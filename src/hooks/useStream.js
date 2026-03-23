import { useState, useRef, useCallback } from 'react'
import { streamMessage } from '../lib/claude'
import { useSettingsStore } from '../store/settings.store'

export default function useStream() {
  const [output,    setOutput]   = useState('')
  const [status,    setStatus]   = useState('idle')  // idle | running | done | error
  const [stats,     setStats]    = useState(null)     // { inputTokens, outputTokens, duration }
  const [error,     setError]    = useState('')
  const startRef = useRef(null)
  const { apiKey, model } = useSettingsStore()

  const run = useCallback(async ({ system, messages }) => {
    setOutput('')
    setError('')
    setStats(null)
    setStatus('running')
    startRef.current = Date.now()

    await streamMessage({
      system,
      messages,
      model,
      apiKey,
      onChunk: (chunk) => {
        setOutput((prev) => prev + chunk)
      },
      onDone: ({ inputTokens, outputTokens }) => {
        const duration = ((Date.now() - startRef.current) / 1000).toFixed(1)
        setStats({ inputTokens, outputTokens, duration })
        setStatus('done')
      },
      onError: (msg) => {
        setError(msg)
        setStatus('error')
      },
    })
  }, [apiKey, model])

  const reset = useCallback(() => {
    setOutput('')
    setStatus('idle')
    setStats(null)
    setError('')
  }, [])

  return { output, status, stats, error, run, reset }
}
