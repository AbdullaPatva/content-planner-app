import { useSanityClient } from '../SanityClientContext'
import { Box, Spinner, Text } from '@sanity/ui'
import { useEffect, useState } from 'react'
import {
  DndContext, PointerSensor, useSensor, useSensors, DragEndEvent,
} from '@dnd-kit/core'
import { StatusColumn } from './StatusColumn'
import { useStatuses, Status } from '../lib/useStatuses'

export type Article = {
  _id: string
  title: string
  publishAt?: string
  status?: { _ref: string }
}

const QUERY = /* groq */`*[_type=="article" && defined(status)]{_id,title,status}`

export function KanbanBoard({ onOpenMeta }: { onOpenMeta: (id: string) => void }) {
  const client = useSanityClient()
  const statuses = useStatuses()
  const [articles, setArticles] = useState<Article[]>([])
  const [busy, setBusy] = useState(true)

  /* load + realtime */
  useEffect(() => {
    client.fetch<Article[]>(QUERY).then(r => { setArticles(r); setBusy(false) })
    const sub = client
      .listen<Article>(QUERY, {}, { includeResult: true })
      .subscribe((evt: any) => {
        if (!evt.result) return
        setArticles(p => {
          const cp = [...p]
          const i = cp.findIndex(a => a._id === evt.result._id)
          i === -1 ? cp.push(evt.result) : cp[i] = evt.result
          return cp
        })
      })
    return () => sub.unsubscribe()
  }, [client])

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }))
  const handleDragEnd = async (evt: DragEndEvent) => {
    if (!evt.over) return
    const articleId = evt.active.id as string
    const targetStatus = (evt.over.id as string).replace('status-', '')
    const doc = articles.find(a => a._id === articleId)
    if (!doc || doc.status?._ref === targetStatus) return

    setArticles(p => p.map(a => a._id === articleId ? { ...a, status: { _ref: targetStatus } } : a))
    try {
      await client.patch(articleId)
        .set({ status: { _type: 'reference', _ref: targetStatus } })
        .commit({ tag: 'planner-status-move' })
    } catch (err) {
      console.error('patch failed', err)
      // Revert the optimistic update on failure
      setArticles(p => p.map(a => a._id === articleId ? { ...a, status: doc.status } : a))
    }
  }

  if (busy || statuses.length === 0) return (
    <Box 
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '400px',
        background: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '12px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}
    >
      <Spinner size={4} />
    </Box>
  )

  return (
    <Box>
      {/* Board Header */}
      <Box 
        style={{
          marginBottom: '24px',
          padding: '16px 24px',
          background: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '12px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Text 
          size={2} 
          weight="semibold"
          style={{
            color: '#333',
            marginBottom: '8px',
            display: 'block'
          }}
        >
          Kanban Board
        </Text>
        <Text 
          size={1}
          style={{
            color: '#666',
            fontSize: '14px'
          }}
        >
          Drag and drop articles between status columns to manage your workflow
        </Text>
      </Box>

      {/* Board Content */}
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <Box 
          style={{
            display: 'flex',
            gap: '16px',
            overflowX: 'auto',
            padding: '8px 0',
            minHeight: 'calc(100vh - 200px)',
            alignItems: 'flex-start',
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(102, 126, 234, 0.3) transparent'
          }}
        >
          {statuses.map(st => (
            <StatusColumn
              key={st._id}
              status={st}
              articles={articles.filter(a => a.status?._ref === st._id).map(a => ({
                _id: a._id,
                title: a.title,
                status: a.status!
              }))}
              onOpenMeta={onOpenMeta}
            />
          ))}
        </Box>
      </DndContext>
    </Box>
  )
}
