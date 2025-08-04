import { useSanityClient } from './SanityClientContext'
import { Box, Card, Flex, Spinner, Stack, Text, Button } from '@sanity/ui'
import { ChevronLeftIcon, ChevronRightIcon, CogIcon, CalendarIcon, ThListIcon } from '@sanity/icons'
import {
  DndContext, PointerSensor, useSensor, useSensors, DragEndEvent,
} from '@dnd-kit/core'
import {
  startOfMonth, startOfWeek, endOfMonth, endOfWeek,
  differenceInCalendarDays, addMonths, format,
} from 'date-fns'
import { useEffect, useState } from 'react'
import { MonthGrid } from './components/MonthGrid'
import { dayKey } from './lib/dates'
import { KanbanBoard } from './components/KanbanBoard'
import { SettingsPanel } from './components/SettingsPanel'
import { usePlannerSettings } from './lib/usePlannerSettings'
import { MetaPanel } from './components/MetaPanel'
import { Overview } from './components/Overview'

type Article = { _id: string; title: string; publishAt: string }

const QUERY = /* groq */`*[_type=="article" && defined(publishAt)]{_id,title,publishAt}`

export function Planner() {
  const client = useSanityClient()
  const [cursor, setCursor] = useState(startOfMonth(new Date()))
  const [articles, setArticles] = useState<Article[]>([])
  const [busy, setBusy] = useState(true)
  const { settings } = usePlannerSettings()
  const weekStart = settings?.weekStartsOn ?? 1
  const [view, setView] = useState<'calendar' | 'board' | 'overview'>(() => settings?.defaultView ?? 'calendar')

  useEffect(() => {
    if (settings) setView(settings.defaultView)
  }, [settings])

  const [showSettings, setShowSettings] = useState(false)

  /* initial load */
  useEffect(() => {
    client.fetch<Article[]>(QUERY).then(r => { setArticles(r); setBusy(false) })
  }, [client])

  /* realtime */
  useEffect(() => {
    const sub = client.listen<Article>(QUERY, {}, { includeResult: true })
      .subscribe((evt: any) => {
        if (!evt.result) return
        setArticles(prev => {
          const cp = [...prev]
          const i = cp.findIndex(a => a._id === evt.result._id)
          i === -1 ? cp.push(evt.result) : cp[i] = evt.result
          return cp
        })
      })
    return () => sub.unsubscribe()
  }, [client])

  const firstCell = startOfWeek(cursor, { weekStartsOn: weekStart })
  const lastCell = endOfWeek(endOfMonth(cursor), { weekStartsOn: weekStart })
  const totalCells = differenceInCalendarDays(lastCell, firstCell) + 1

  /* DnD */
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }))
  const handleDragEnd = async (ev: DragEndEvent) => {
    if (!ev.over) return
    const target = (ev.over.id as string).replace('day-', '')
    const id = ev.active.id as string
    const doc = articles.find(a => a._id === id)
    if (!doc || dayKey(doc.publishAt) === target) return
    const iso = `${target}T10:00:00Z`
    setArticles(p => p.map(a => a._id === id ? { ...a, publishAt: iso } : a))
    try { await client.patch(id).set({ publishAt: iso }).commit({ tag: 'planner-move' }) }
    catch (err) { console.error('patch failed', err) }
  }
  const [metaTarget, setMetaTarget] = useState<string | null>(null)
  const openMeta = (id: string) => setMetaTarget(id)
  
  if (busy) return (
    <Box 
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}
    >
      <Spinner size={4} />
    </Box>
  )

  return (
    <Box 
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}
    >
      {/* Header */}
      <Box 
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}
      >
        <Flex 
          justify="space-between" 
          align="center" 
          padding={4}
          style={{ maxWidth: '1400px', margin: '0 auto' }}
        >
          {/* Left side - Title and Navigation */}
          <Flex gap={4} align="center">
            <Text 
              size={3} 
              weight="bold"
              style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Content Planner
            </Text>
            
            {/* Navigation Tabs */}
            <Flex gap={1} align="center">
              <Button
                mode="ghost"
                padding={3}
                radius={2}
                onClick={() => setView('calendar')}
                style={{
                  background: view === 'calendar' ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
                  color: view === 'calendar' ? '#667eea' : '#666',
                  border: view === 'calendar' ? '1px solid rgba(102, 126, 234, 0.3)' : '1px solid transparent',
                  transition: 'all 0.2s ease'
                }}
              >
                <CalendarIcon style={{ marginRight: '8px' }} />
                Calendar
              </Button>
              
              <Button
                mode="ghost"
                padding={3}
                radius={2}
                onClick={() => setView('board')}
                style={{
                  background: view === 'board' ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
                  color: view === 'board' ? '#667eea' : '#666',
                  border: view === 'board' ? '1px solid rgba(102, 126, 234, 0.3)' : '1px solid transparent',
                  transition: 'all 0.2s ease'
                }}
              >
                <ThListIcon style={{ marginRight: '8px' }} />
                Board
              </Button>
              
              <Button
                mode="ghost"
                padding={3}
                radius={2}
                onClick={() => setView('overview')}
                style={{
                  background: view === 'overview' ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
                  color: view === 'overview' ? '#667eea' : '#666',
                  border: view === 'overview' ? '1px solid rgba(102, 126, 234, 0.3)' : '1px solid transparent',
                  transition: 'all 0.2s ease'
                }}
              >
                <ThListIcon style={{ marginRight: '8px' }} />
                Overview
              </Button>
            </Flex>
          </Flex>

          {/* Right side - Month Navigation and Settings */}
          <Flex gap={2} align="center">
            {view === 'calendar' && (
              <Flex gap={1} align="center">
                <Button
                  mode="ghost"
                  padding={2}
                  radius={2}
                  onClick={() => setCursor(d => addMonths(d, -1))}
                  style={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <ChevronLeftIcon />
                </Button>
                
                <Text 
                  size={2} 
                  weight="semibold"
                  style={{ 
                    minWidth: '120px',
                    textAlign: 'center',
                    color: '#333'
                  }}
                >
                  {format(cursor, 'MMMM yyyy')}
                </Text>
                
                <Button
                  mode="ghost"
                  padding={2}
                  radius={2}
                  onClick={() => setCursor(d => addMonths(d, 1))}
                  style={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <ChevronRightIcon />
                </Button>
              </Flex>
            )}
            
            <Button
              mode="ghost"
              padding={2}
              radius={2}
              onClick={() => setShowSettings(true)}
              style={{
                background: 'rgba(255, 255, 255, 0.8)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s ease'
              }}
            >
              <CogIcon />
            </Button>
          </Flex>
        </Flex>
      </Box>

      {/* Main Content */}
      <Box 
        padding={4}
        style={{ 
          maxWidth: '1400px', 
          margin: '0 auto',
          minHeight: 'calc(100vh - 80px)'
        }}
      >
        {view === 'calendar' && (
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <MonthGrid
              firstDay={firstCell}
              totalDays={totalCells}
              articles={articles}
              monthCursor={cursor}
              onOpenMeta={openMeta}
            />
          </DndContext>
        )}

        {view === 'board' && <KanbanBoard onOpenMeta={openMeta} />}

        {view === 'overview' && <Overview />}
      </Box>

      {/* Settings Modal */}
      {showSettings && (
        <Box
          style={{
            position: 'fixed', 
            inset: 0, 
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(5px)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowSettings(false)}
        >
          <SettingsPanel onClose={() => setShowSettings(false)} />
        </Box>
      )}

      {/* Meta Panel Modal */}
      {metaTarget && (
        <Box
          style={{
            position: 'fixed', 
            inset: 0, 
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(5px)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            zIndex: 1000
          }}
          onClick={() => setMetaTarget(null)}
        >
          <MetaPanel id={metaTarget} onClose={() => setMetaTarget(null)} />
        </Box>
      )}
    </Box>
  )
}
