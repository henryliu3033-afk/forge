import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const newPrompt = (overrides = {}) => ({
  id:          `p_${Date.now()}`,
  title:       'Untitled Prompt',
  system:      '',
  userPrompt:  '',
  variables:   {},      // { name: defaultValue }
  tags:        [],
  pinned:      false,
  createdAt:   new Date().toISOString(),
  updatedAt:   new Date().toISOString(),
  ...overrides,
})

export const usePromptStore = create(
  persist(
    (set, get) => ({
      // ── Saved library ──────────────────────────────────────
      prompts: [],

      savePrompt: (data) => {
        const existing = get().prompts.find((p) => p.id === data.id)
        if (existing) {
          set((s) => ({
            prompts: s.prompts.map((p) =>
              p.id === data.id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p
            ),
          }))
        } else {
          const p = newPrompt(data)
          set((s) => ({ prompts: [p, ...s.prompts] }))
          return p
        }
      },

      deletePrompt: (id) =>
        set((s) => ({ prompts: s.prompts.filter((p) => p.id !== id) })),

      togglePin: (id) =>
        set((s) => ({
          prompts: s.prompts.map((p) =>
            p.id === id ? { ...p, pinned: !p.pinned } : p
          ),
        })),

      // ── Current editor state (not persisted to library) ────
      current: newPrompt(),
      setCurrent: (data) =>
        set((s) => ({ current: { ...s.current, ...data } })),
      resetCurrent: () =>
        set({ current: newPrompt() }),
      loadPrompt: (prompt) =>
        set({ current: { ...prompt } }),

      // ── History (last 20 runs) ─────────────────────────────
      history: [],
      addHistory: (entry) =>
        set((s) => ({
          history: [
            { ...entry, id: `h_${Date.now()}`, runAt: new Date().toISOString() },
            ...s.history.slice(0, 19),
          ],
        })),
    }),
    {
      name: 'forge-prompts',
      partialize: (s) => ({ prompts: s.prompts, history: s.history }),
    }
  )
)
