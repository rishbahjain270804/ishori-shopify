// Centralized feature flags for the Ishori app
// Read from environment variables where available, with safe defaults

const toBool = (v, d = false) => {
  if (v === undefined || v === null) return d
  const s = String(v).trim().toLowerCase()
  return ['1', 'true', 'yes', 'on', 'enabled'].includes(s)
}

export function getFeatures() {
  // GPT-5 is a placeholder feature flag for AI capabilities.
  // When integrating a real model/provider, wire its config here.
  const gpt5Enabled = toBool(process.env.FEATURE_GPT5_ENABLED, true)

  return {
    ai: {
      gpt5: {
        enabled: gpt5Enabled,
        rollout: '100%',
        // model and provider are placeholders; update when integrating a real service
        model: process.env.AI_MODEL || 'gpt-5',
        provider: process.env.AI_PROVIDER || 'placeholder',
        notes: 'Global flag: when true, AI features are available to all clients.'
      }
    }
  }
}
