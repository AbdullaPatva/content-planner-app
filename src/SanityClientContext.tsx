import React, { createContext, useContext } from 'react'
import { createClient, SanityClient } from '@sanity/client'

const SanityClientContext = createContext<SanityClient | null>(null)

export function SanityClientProvider({ children }: { children: React.ReactNode }) {
  const client = createClient({
    projectId: 'o7xwtv7a',
    dataset: 'production',
    apiVersion: '2025-07-15',
    useCdn: false,
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