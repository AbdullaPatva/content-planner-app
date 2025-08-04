import {useEffect, useState} from 'react'
import {useClient} from '@sanity/sdk-react'

export interface PlannerSettings {
  _id: string
  _type: string
  defaultView: 'calendar' | 'board'
  weekStartsOn: 0 | 1
}

const QUERY = /* groq */ `*[_type=="plannerSettings"][0]`

/** Returns settings doc (creates one if missing) and a save() helper */
export function usePlannerSettings() {
  const client = useClient({apiVersion: '2025-07-15'})
  const [settings, setSettings] = useState<PlannerSettings | null>(null)

  useEffect(() => {
    let sub: any
    ;(async () => {
      const doc =
        (await client.fetch<PlannerSettings | null>(QUERY)) ??
        (await client
          .create<PlannerSettings>({
            _type: 'plannerSettings',
            _id: 'planner.settings',
            defaultView: 'calendar',
            weekStartsOn: 1,
          }))
      setSettings(doc)

      // live updates so multiple editors stay in sync
      sub = client
        .listen<PlannerSettings>(`*[_id=="${doc._id}"]`, {}, {includeResult: true})
        .subscribe((e: any) => {
          if (e.result) {
            setSettings({
              _id: e.result._id,
              _type: e.result._type,
              defaultView: e.result.defaultView,
              weekStartsOn: e.result.weekStartsOn
            })
          }
        })
    })()
    return () => sub?.unsubscribe()
  }, [client])

  /** Patch helper */
  const save = (patch: Partial<PlannerSettings>) =>
    settings &&
    client
      .patch(settings._id)
      .set(patch)
      .commit({tag: 'planner-settings'})
      .then((res) => setSettings({
        _id: res._id,
        _type: res._type,
        defaultView: res.defaultView,
        weekStartsOn: res.weekStartsOn
      }))

  return {settings, save}
}
