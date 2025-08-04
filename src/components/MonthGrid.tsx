import { Box } from '@sanity/ui'
import { addDays } from 'date-fns'
import { DayCell } from './DayCell'
import { dayKey } from '../lib/dates'
import { type Article } from './KanbanBoard'

interface Props {
  firstDay: Date
  totalDays: number
  articles: Article[]
  monthCursor: Date
  onOpenMeta: (id: string) => void
}

export function MonthGrid({ firstDay, totalDays, articles, monthCursor, onOpenMeta }: Props) {
  const byDay = new Map<string, (Article & { publishAt: string })[]>()
  for (const a of articles) {
    if (!a.publishAt) continue
    const k = dayKey(a.publishAt)
    if (!byDay.has(k)) byDay.set(k, [])
    byDay.get(k)!.push(a as Article & { publishAt: string })
  }

  // Generate day headers
  const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  
  return (
    <Box>
      {/* Calendar Header */}
      <Box 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '1px',
          marginBottom: '8px',
          background: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '12px',
          padding: '16px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        {dayHeaders.map(day => (
          <Box
            key={day}
            style={{
              textAlign: 'center',
              padding: '8px',
              fontWeight: '600',
              color: '#667eea',
              fontSize: '14px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            {day}
          </Box>
        ))}
      </Box>

      {/* Calendar Grid */}
      <Box 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '1px',
          background: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '12px',
          padding: '1px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}
      >
        {Array.from({ length: totalDays }, (_, i) => addDays(firstDay, i)).map(d =>
          <DayCell 
            key={dayKey(d)} 
            date={d} 
            monthCursor={monthCursor} 
            onOpenMeta={onOpenMeta} 
            articles={byDay.get(dayKey(d)) ?? []}
          />
        )}
      </Box>
    </Box>
  )
}
