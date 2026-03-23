// ── Extract {{variable}} names from a prompt string ─────────
export const extractVariables = (text) => {
  const matches = text.match(/\{\{(\w+)\}\}/g) || []
  const names = matches.map((m) => m.slice(2, -2))
  return [...new Set(names)] // deduplicate
}

// ── Replace {{variables}} with provided values ───────────────
export const fillVariables = (text, vars) => {
  return text.replace(/\{\{(\w+)\}\}/g, (match, name) => {
    return vars[name] !== undefined && vars[name] !== '' ? vars[name] : match
  })
}

// ── Highlight {{variables}} in plain text → HTML string ──────
export const highlightVariables = (text) => {
  return text.replace(
    /\{\{(\w+)\}\}/g,
    '<span class="var-highlight">{{$1}}</span>'
  )
}

// ── Count tokens (rough estimate: ~4 chars per token) ────────
export const estimateTokens = (text) => Math.ceil((text || '').length / 4)
