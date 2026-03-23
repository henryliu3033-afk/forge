import { useEffect } from 'react'
import { extractVariables } from '../../lib/parser'

export default function VariablePanel({ systemPrompt, userPrompt, variables, onChange }) {
  const allVars = [
    ...extractVariables(systemPrompt || ''),
    ...extractVariables(userPrompt || ''),
  ]
  const uniqueVars = [...new Set(allVars)]

  // Auto-add new variables when detected
  useEffect(() => {
    const updated = { ...variables }
    let changed = false
    uniqueVars.forEach((v) => {
      if (!(v in updated)) { updated[v] = ''; changed = true }
    })
    // Remove variables no longer in prompts
    Object.keys(updated).forEach((k) => {
      if (!uniqueVars.includes(k)) { delete updated[k]; changed = true }
    })
    if (changed) onChange(updated)
  }, [systemPrompt, userPrompt])

  if (uniqueVars.length === 0) {
    return (
      <div className="px-3 py-4 text-center">
        <p className="font-mono text-lg text-[#3D444D]">No variables detected.</p>
        <p className="font-mono text-lg text-[#3D444D] mt-1">
          Use <span className="text-[#D29922]">{'{{variable_name}}'}</span> in your prompts.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 px-3 py-3">
      <div className="text-[20px] font-mono uppercase tracking-widest text-[#3D444D]">
        Variables ({uniqueVars.length})
      </div>
      {uniqueVars.map((name) => (
        <div key={name} className="flex flex-col gap-1">
          <label className="font-mono text-lg text-[#D29922]">
            {'{{'}{name}{'}}'}
          </label>
          <input
            type="text"
            value={variables[name] ?? ''}
            onChange={(e) => onChange({ ...variables, [name]: e.target.value })}
            placeholder={`Enter ${name}...`}
            className="w-full bg-[#161B22] border border-[#30363D] text-[#E6EDF3] font-mono text-lg px-2.5 py-1.5 rounded outline-none focus:border-[#388bfd] placeholder:text-[#3D444D] transition-colors"
          />
        </div>
      ))}
    </div>
  )
}
