import {useEffect, useState} from 'react'
import {useSanityClient} from '../SanityClientContext'

export type Status = {_id: string; title: string; color: string; order: number}

const QUERY = /* groq */`*[_type=="workflowStatus"]|order(order asc){_id,title,color,order}`

export function useStatuses() {
  const client = useSanityClient()
  const [statuses, setStatuses] = useState<Status[]>([])
  useEffect(() => { client.fetch<Status[]>(QUERY).then(setStatuses) }, [client])
  return statuses
}
