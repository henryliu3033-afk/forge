// ── Claude API wrapper ───────────────────────────────────────
// Supports two modes:
//   1. Artifacts mode  — uses window fetch to Anthropic API directly (no key needed in Claude.ai)
//   2. API Key mode    — user provides their own sk-ant-... key

const API_URL = 'https://api.anthropic.com/v1/messages'
const DEFAULT_MODEL = 'claude-sonnet-4-20250514'

/**
 * Send a prompt and stream the response.
 * @param {object} opts
 * @param {string} opts.system    - System prompt
 * @param {Array}  opts.messages  - [{role, content}] array
 * @param {string} [opts.model]   - Model ID
 * @param {string} [opts.apiKey]  - User's API key (optional, uses Artifacts mode if omitted)
 * @param {function} opts.onChunk - Called with each text chunk
 * @param {function} opts.onDone  - Called when stream ends with { totalText, inputTokens, outputTokens }
 * @param {function} opts.onError - Called with error message
 */
export async function streamMessage({ system, messages, model, apiKey, onChunk, onDone, onError }) {
  const headers = {
    'Content-Type': 'application/json',
  }

  // Add auth header only when user provides their own key
  if (apiKey && apiKey.startsWith('sk-ant-')) {
    headers['x-api-key'] = apiKey
    headers['anthropic-version'] = '2023-06-01'
  }

  const body = {
    model: model || DEFAULT_MODEL,
    max_tokens: 2048,
    stream: true,
    messages,
    ...(system ? { system } : {}),
  }

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      onError?.(err?.error?.message || `HTTP ${res.status}`)
      return
    }

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let totalText = ''
    let inputTokens = 0
    let outputTokens = 0

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value, { stream: true })
      const lines = chunk.split('\n').filter(Boolean)

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue
        const data = line.slice(6)
        if (data === '[DONE]') continue

        try {
          const event = JSON.parse(data)

          if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta') {
            const text = event.delta.text
            totalText += text
            onChunk?.(text)
          }

          if (event.type === 'message_start') {
            inputTokens = event.message?.usage?.input_tokens || 0
          }

          if (event.type === 'message_delta') {
            outputTokens = event.usage?.output_tokens || 0
          }
        } catch { /* skip malformed lines */ }
      }
    }

    onDone?.({ totalText, inputTokens, outputTokens })
  } catch (err) {
    onError?.(err.message || 'Network error')
  }
}

// ── Non-streaming version (for simple use cases) ─────────────
export async function sendMessage({ system, messages, model, apiKey }) {
  const headers = { 'Content-Type': 'application/json' }
  if (apiKey?.startsWith('sk-ant-')) {
    headers['x-api-key'] = apiKey
    headers['anthropic-version'] = '2023-06-01'
  }

  const res = await fetch(API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: model || DEFAULT_MODEL,
      max_tokens: 2048,
      messages,
      ...(system ? { system } : {}),
    }),
  })

  const data = await res.json()
  return data.content?.[0]?.text || ''
}

export const MODELS = [
  { id: 'claude-sonnet-4-20250514', label: 'Claude Sonnet 4' },
  { id: 'claude-opus-4-6',         label: 'Claude Opus 4' },
  { id: 'claude-haiku-4-5-20251001', label: 'Claude Haiku 4.5' },
]
