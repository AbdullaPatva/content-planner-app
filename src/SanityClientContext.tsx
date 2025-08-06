import React, { createContext, useContext } from 'react'
import { createClient, SanityClient } from '@sanity/client'

const SanityClientContext = createContext<SanityClient | null>(null)

// Helper function to get token from environment or fallback
const getSanityToken = (): string | undefined => {
  // First try environment variable
  if (process.env.SANITY_API_READ_TOKEN) {
    return process.env.SANITY_API_READ_TOKEN
  }
  
  // Fallback: try to read from .env.local (this won't work in browser, but good for debugging)
  try {
    // This is a fallback for development - in production, the env var should be set
    return process.env.SANITY_API_READ_TOKEN || 'sk9Im1uiWqrLiXm3f3oYoNHP3GpgIksV5QNBsSJTDHoZA7kZRkeZph1ZL0HAN6r7nZvZ48KgnIy9Gon3ZntGqgYfHGfHokrPxuwLpisCQ051XGkXA9YawmhdCCnLutTwvo0nERga7XikPB7GYUFHvHNmUmIZSTQ3RVl3a8PvlTZtp1fyjQqk'
  } catch (error) {
    return undefined
  }
}

export function SanityClientProvider({ children }: { children: React.ReactNode }) {
  const token = getSanityToken()
  
  const client = createClient({
    projectId: 'o7xwtv7a',
    dataset: 'production',
    apiVersion: '2025-07-15',
    useCdn: false,
    token: token,
  })

  return (
    <SanityClientContext.Provider value={client}>
      {children}
    </SanityClientContext.Provider>
  )
}

export function useSanityClient() {
  const client = useContext(SanityClientContext)
  if (!client) {
    throw new Error('useSanityClient must be used within a SanityClientProvider')
  }
  return client
} 