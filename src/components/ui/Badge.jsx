const TAG_COLORS = {
  Writing:  'bg-[#58A6FF20] text-[#58A6FF] border-[#58A6FF30]',
  Code:     'bg-[#3FB95020] text-[#3FB950] border-[#3FB95030]',
  Analysis: 'bg-[#D2992220] text-[#D29922] border-[#D2992230]',
  Chat:     'bg-[#BC8CFF20] text-[#BC8CFF] border-[#BC8CFF30]',
  Creative: 'bg-[#F8514920] text-[#F85149] border-[#F8514930]',
}

export function TagBadge({ tag, className = '' }) {
  const colors = TAG_COLORS[tag] || 'bg-[#30363D] text-[#8B949E] border-[#3D444D]'
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-lg font-mono rounded border ${colors} ${className}`}>
      {tag}
    </span>
  )
}

export function StatusBadge({ status }) {
  const map = {
    idle:    { cls: 'text-[#8B949E]',               icon: '○', label: 'Ready' },
    running: { cls: 'text-[#3FB950] animate-pulse',  icon: '●', label: 'Running' },
    done:    { cls: 'text-[#3FB950]',                icon: '✓', label: 'Done' },
    error:   { cls: 'text-[#F85149]',                icon: '✗', label: 'Error' },
  }
  const { cls, icon, label } = map[status] || map.idle
  return (
    <span className={`inline-flex items-center gap-1.5 font-mono text-lg ${cls}`}>
      <span>{icon}</span>
      <span>{label}</span>
    </span>
  )
}
