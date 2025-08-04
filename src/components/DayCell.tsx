import { useDroppable } from '@dnd-kit/core'
import { Card, Stack, Text, Box } from '@sanity/ui'
import { isSameMonth, format } from 'date-fns'
import { ArticleCard } from './ArticleCard'
import { dayKey } from '../lib/dates'

type Article = { _id: string; title: string; publishAt: string, status?: { _ref: string } }

interface Props {
  date: Date
  monthCursor: Date
  articles: Article[]
  onOpenMeta: (id: string) => void
}

export function DayCell({ date, monthCursor, articles, onOpenMeta }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: 'day-' + dayKey(date) })
  const dim = !isSameMonth(date, monthCursor)
  const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  
  return (
    <Card 
      ref={setNodeRef} 
      padding={3} 
      radius={2} 
      shadow={1}
      style={{
        minHeight: '120px',
        background: isOver 
          ? 'rgba(102, 126, 234, 0.1)' 
          : dim 
            ? 'rgba(255, 255, 255, 0.3)' 
            : 'rgba(255, 255, 255, 0.9)',
        border: isToday 
          ? '2px solid #667eea' 
          : isOver 
            ? '2px solid rgba(102, 126, 234, 0.5)' 
            : '1px solid rgba(255, 255, 255, 0.3)',
        transition: 'all 0.2s ease',
        backdropFilter: 'blur(10px)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Stack space={2}>
        <Text 
          size={1} 
          weight="medium" 
          style={{
            color: dim ? '#999' : isToday ? '#667eea' : '#333',
            fontSize: '14px',
            fontWeight: isToday ? '700' : '600',
            textAlign: 'center',
            padding: '4px 8px',
            borderRadius: '6px',
            background: isToday ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
            marginBottom: '8px'
          }}
        >
          {format(date, 'd')}
        </Text>
        
        <Box style={{ flex: 1, overflowY: 'auto' }}>
          <Stack space={1}>
            {articles.map(a => (
              <ArticleCard 
                key={a._id} 
                id={a._id} 
                title={a.title} 
                onDoubleClick={() => onOpenMeta(a._id)} 
              />
            ))}
          </Stack>
        </Box>
      </Stack>
    </Card>
  )
}
