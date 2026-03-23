import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useSettingsStore = create(
  persist(
    (set) => ({
      apiKey:    '',
      model:     'claude-sonnet-4-20250514',
      theme:     'dark',
      fontSize:  14,
      setApiKey: (apiKey) => set({ apiKey }),
      setModel:  (model)  => set({ model }),
      setFontSize: (fontSize) => set({ fontSize }),
    }),
    { name: 'forge-settings' }
  )
)
