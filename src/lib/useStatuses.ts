import {useEffect, useState} from 'react'
import {useClient} from '@sanity/sdk-react'

export type Status = {_id: string; title: string; color: string; order: number}

const QUERY = /* groq */`*[_type=="workflowStatus"]|order(order asc){_id,title,color,order}`

export function useStatuses() {
  const client = useClient({apiVersion: '2025-07-15'})
  const [statuses, setStatuses] = useState<Status[]>([])
  useEffect(() => { client.fetch<Status[]>(QUERY).then(setStatuses) }, [client])
  return statuses
}
