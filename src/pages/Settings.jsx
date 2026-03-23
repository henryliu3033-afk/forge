import { useState } from 'react'
import { useSettingsStore } from '../store/settings.store'
import { MODELS } from '../lib/claude'
import Button from '../components/ui/Button'

function Section({ title, children }) {
  return (
    <div className="border border-[#30363D] rounded-md overflow-hidden mb-4">
      <div className="px-4 py-2.5 bg-[#161B22] border-b border-[#30363D]">
        <h3 className="font-mono text-xl font-medium text-[#E6EDF3]">{title}</h3>
      </div>
      <div className="p-4 bg-[#0D1117]">{children}</div>
    </div>
  )
}

function Field({ label, hint, children }) {
  return (
    <div className="flex flex-col gap-1.5 mb-4 last:mb-0">
      <label className="font-mono text-lg text-[#E6EDF3] font-medium">{label}</label>
      {hint && <p className="font-mono text-lg text-[#8B949E]">{hint}</p>}
      {children}
    </div>
  )
}

export default function Settings() {
  const { apiKey, setApiKey, model, setModel, fontSize, setFontSize } = useSettingsStore()
  const [keyVisible, setKeyVisible] = useState(false)
  const [saved, setSaved] = useState(false)
  const [keyInput, setKeyInput] = useState(apiKey)

  const handleSaveKey = () => {
    setApiKey(keyInput.trim())
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const maskKey = (key) => {
    if (!key) return ''
    return key.slice(0, 12) + '•'.repeat(Math.max(0, key.length - 16)) + key.slice(-4)
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center px-4 py-3 border-b border-[#30363D] flex-shrink-0">
        <span className="font-mono text-xl text-[#E6EDF3] font-medium">⚙ Settings</span>
      </div>

      <div className="flex-1 p-4 max-w-2xl">

        {/* API Configuration */}
        <Section title="API Configuration">
          <Field
            label="Anthropic API Key"
            hint="Your key is stored locally in your browser and never sent to any server other than Anthropic."
          >
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type={keyVisible ? 'text' : 'password'}
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  placeholder="sk-ant-api03-..."
                  className="w-full bg-[#161B22] border border-[#30363D] text-[#E6EDF3] font-mono text-lg px-3 py-2 rounded outline-none focus:border-[#388bfd] placeholder:text-[#3D444D]"
                />
                <button
                  onClick={() => setKeyVisible((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#3D444D] hover:text-[#8B949E] text-lg font-mono"
                >
                  {keyVisible ? 'hide' : 'show'}
                </button>
              </div>
              <Button variant="primary" size="md" onClick={handleSaveKey}>
                {saved ? '✓ Saved' : 'Save'}
              </Button>
            </div>

            {/* Key status */}
            <div className="mt-2 flex items-center gap-2">
              {apiKey ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-[#3FB950] inline-block" />
                  <span className="font-mono text-lg text-[#3FB950]">Key configured</span>
                  <span className="font-mono text-lg text-[#3D444D]">({maskKey(apiKey)})</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-[#D29922] inline-block" />
                  <span className="font-mono text-lg text-[#D29922]">No key — using Artifacts mode (Claude.ai only)</span>
                </>
              )}
            </div>
          </Field>

          <div className="p-3 rounded bg-[#1F6FEB10] border border-[#1F6FEB30] mt-3">
            <p className="font-mono text-lg text-[#8B949E]">
              <span className="text-[#58A6FF] font-medium">Artifacts mode:</span> When no API key is set,
              Forge uses the Anthropic API directly through the Claude.ai environment — no key needed.
              This only works when running inside Claude.ai.
            </p>
            <p className="font-mono text-lg text-[#8B949E] mt-1.5">
              <span className="text-[#58A6FF] font-medium">API Key mode:</span> Works anywhere — your
              local dev server, deployed app, etc.
            </p>
          </div>
        </Section>

        {/* Model */}
        <Section title="Model">
          <Field label="Default Model" hint="Used for all Editor and Playground requests.">
            <div className="grid grid-cols-1 gap-2">
              {MODELS.map((m) => (
                <label
                  key={m.id}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded border cursor-pointer transition-colors ${
                    model === m.id
                      ? 'border-[#388bfd] bg-[#1F6FEB10]'
                      : 'border-[#30363D] hover:border-[#3D444D] bg-[#161B22]'
                  }`}
                >
                  <input
                    type="radio"
                    name="model"
                    value={m.id}
                    checked={model === m.id}
                    onChange={() => setModel(m.id)}
                    className="accent-[#388bfd]"
                  />
                  <div>
                    <p className="font-mono text-xl text-[#E6EDF3]">{m.label}</p>
                    <p className="font-mono text-lg text-[#3D444D]">{m.id}</p>
                  </div>
                  {m.id.includes('sonnet') && (
                    <span className="ml-auto font-mono text-[20px] px-1.5 py-0.5 bg-[#3FB95015] text-[#3FB950] border border-[#3FB95025] rounded">
                      recommended
                    </span>
                  )}
                </label>
              ))}
            </div>
          </Field>
        </Section>

        {/* Editor preferences */}
        <Section title="Editor Preferences">
          <Field label="Font Size" hint="Applies to the prompt editor and output panel.">
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={11}
                max={18}
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="flex-1 accent-[#388bfd]"
              />
              <span className="font-mono text-xl text-[#58A6FF] w-10 text-right">{fontSize}px</span>
            </div>
          </Field>
        </Section>

        {/* Keyboard shortcuts */}
        <Section title="Keyboard Shortcuts">
          <div className="grid grid-cols-2 gap-2">
            {[
              ['Run prompt',      'Ctrl / ⌘ + Enter'],
              ['Save prompt',     'Ctrl / ⌘ + S'],
              ['Clear output',    'Ctrl / ⌘ + K'],
              ['New prompt',      'Ctrl / ⌘ + N'],
              ['Toggle sidebar',  'Ctrl / ⌘ + B'],
              ['Open templates',  'Ctrl / ⌘ + T'],
            ].map(([action, key]) => (
              <div key={action} className="flex items-center justify-between py-1.5">
                <span className="font-mono text-lg text-[#8B949E]">{action}</span>
                <kbd className="font-mono text-lg px-2 py-0.5 bg-[#21262D] border border-[#30363D] rounded text-[#E6EDF3]">
                  {key}
                </kbd>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  )
}
