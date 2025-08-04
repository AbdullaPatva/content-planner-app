import { useClient } from '@sanity/sdk-react'
import { useEffect, useState, useCallback } from 'react'

const CONFIG_ID = 'planner.config'

const QUERY = `*[_id == $id][0]{
  _id,
  "slackWebhookUrl": slackWebhookUrl,
  "reminderOffsetMinutes": reminderOffsetMinutes
}`

export interface PlannerConfig {
    slackWebhookUrl?: string
    reminderOffsetMinutes?: number
}

export function usePlannerConfig(): [
    PlannerConfig | null,
    (patch: Partial<PlannerConfig>) => Promise<void>,
    boolean,
] {
    const client = useClient({ apiVersion: '2025-07-15' })
    const [cfg, setCfg] = useState<PlannerConfig | null>(null)
    const [loading, setLoading] = useState(true)

    // initial fetch
    useEffect(() => {
        client.fetch<PlannerConfig>(QUERY, { id: CONFIG_ID }).then((c) => {
            setCfg(c ?? {})
            setLoading(false)
        })
    }, [client])

    const save = useCallback(
        async (patch: Partial<PlannerConfig>) => {
            setCfg((prev) => ({ ...(prev ?? {}), ...patch }))
            await client
                .patch(CONFIG_ID)
                .setIfMissing({ _type: 'plannerConfig' })
                .set(patch)
                .commit({ tag: 'planner-config' })
        },
        [client],
    )

    return [cfg, save, loading]
}
