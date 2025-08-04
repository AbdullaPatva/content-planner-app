import { useDroppable } from '@dnd-kit/core'
import { Card, Stack, Text, Box } from '@sanity/ui'
import { ArticleCard } from './ArticleCard'
import { Status } from '../lib/useStatuses'

type Article = { _id: string; title: string; status: { _ref: string } }

interface StatusColumnProps {
  status: Status
  articles: Article[]
  onOpenMeta: (id: string) => void
}

export function StatusColumn({ status, articles, onOpenMeta }: StatusColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: 'status-' + status._id })

  // Color mapping for status colors
  const getStatusColor = (color: string) => {
    const colors: Record<string, { bg: string; border: string; text: string }> = {
      gray: { bg: 'rgba(156, 163, 175, 0.1)', border: 'rgba(156, 163, 175, 0.3)', text: '#6b7280' },
      blue: { bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.3)', text: '#3b82f6' },
      green: { bg: 'rgba(34, 197, 94, 0.1)', border: 'rgba(34, 197, 94, 0.3)', text: '#22c55e' },
      yellow: { bg: 'rgba(234, 179, 8, 0.1)', border: 'rgba(234, 179, 8, 0.3)', text: '#eab308' },
      red: { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.3)', text: '#ef4444' }
    }
    return colors[color] || colors.gray
  }

  const statusColor = getStatusColor(status.color)

  return (
    <Card
      ref={setNodeRef}
      radius={3}
      padding={4}
      style={{
        minWidth: '280px',
        maxWidth: '320px',
        height: 'fit-content',
        maxHeight: 'calc(100vh - 250px)',
        background: isOver 
          ? 'rgba(102, 126, 234, 0.1)' 
          : 'rgba(255, 255, 255, 0.9)',
        border: isOver 
          ? '2px solid rgba(102, 126, 234, 0.5)' 
          : `1px solid ${statusColor.border}`,
        transition: 'all 0.2s ease',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
        position: 'relative'
      }}
    >
      <Stack space={3}>
        {/* Status Header */}
        <Box
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            background: statusColor.bg,
            borderRadius: '8px',
            border: `1px solid ${statusColor.border}`,
            marginBottom: '8px'
          }}
        >
          <Text 
            weight="semibold" 
            size={1}
            style={{
              color: statusColor.text,
              fontSize: '14px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            {status.title}
          </Text>
          
          <Box
            style={{
              background: statusColor.text,
              color: 'white',
              borderRadius: '12px',
              padding: '4px 8px',
              fontSize: '12px',
              fontWeight: '600',
              minWidth: '20px',
              textAlign: 'center'
            }}
          >
            {articles.length}
          </Box>
        </Box>

        {/* Articles List */}
        <Box 
          style={{ 
            overflowY: 'auto',
            maxHeight: 'calc(100vh - 350px)',
            padding: '4px'
          }}
        >
          <Stack space={2}>
            {articles.map(article => (
              <ArticleCard 
                key={article._id} 
                id={article._id} 
                title={article.title} 
                onDoubleClick={() => onOpenMeta(article._id)} 
              />
            ))}
            
            {articles.length === 0 && (
              <Box
                style={{
                  padding: '24px 16px',
                  textAlign: 'center',
                  color: '#999',
                  fontSize: '14px',
                  fontStyle: 'italic'
                }}
              >
                No articles in this status
              </Box>
            )}
          </Stack>
        </Box>
      </Stack>
    </Card>
  )
}
