import { useDraggable } from '@dnd-kit/core'
import { Card, Text } from '@sanity/ui'
import { CSS } from '@dnd-kit/utilities'
import { Box } from '@sanity/ui'

interface Props { 
  id: string
  title: string
  style?: React.CSSProperties
  onDoubleClick?: () => void 
}

export function ArticleCard({ id, title, onDoubleClick }: Props) {
  const { setNodeRef, listeners, attributes, transform, isDragging } = useDraggable({ id })
  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
  }
  
  return (
    <Card 
      ref={setNodeRef} 
      {...listeners} 
      onDoubleClick={onDoubleClick} 
      {...attributes} 
      padding={2} 
      radius={2} 
      style={{
        ...style,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        border: 'none',
        boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
        transition: 'all 0.2s ease',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '32px',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <Text 
        size={1} 
        style={{
          color: 'white',
          fontWeight: '500',
          fontSize: '12px',
          lineHeight: '1.4',
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          width: '100%'
        }}
      >
        {title}
      </Text>
      
      {/* Hover effect overlay */}
      <Box
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255, 255, 255, 0.1)',
          opacity: 0,
          transition: 'opacity 0.2s ease',
          pointerEvents: 'none'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '1'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '0'
        }}
      />
    </Card>
  )
}
