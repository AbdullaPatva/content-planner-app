import React, { useState } from 'react'
import { Box, Card, Button, Text, Flex, Layer } from '@sanity/ui'
import { CloseIcon } from '@sanity/icons'
import { SimpleTextEditor } from './SimpleTextEditor'

interface ContentEditorModalProps {
  documentId: string
  fieldName: string
  onClose: () => void
  onSave: (content: string) => void
  triggerText?: string
}

export function ContentEditorModal({
  documentId,
  fieldName,
  onClose,
  onSave,
  triggerText = 'Open Content Editor'
}: ContentEditorModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleOpen = () => setIsOpen(true)
  const handleClose = () => {
    setIsOpen(false)
    onClose()
  }

  const handleSave = (content: string) => {
    onSave(content)
    setIsOpen(false)
  }

  return (
    <>
      <Button
        text={triggerText}
        tone="primary"
        onClick={handleOpen}
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none',
          transition: 'all 0.2s ease'
        }}
      />

      {isOpen && (
        <Layer>
          <Box
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}
            onClick={handleClose}
          >
            <Card
              padding={4}
              radius={3}
              shadow={3}
              style={{
                width: '90vw',
                maxWidth: '800px',
                maxHeight: '90vh',
                overflow: 'hidden',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <Flex justify="space-between" align="center" style={{ marginBottom: '16px' }}>
                <Text size={2} weight="semibold" style={{ color: '#333' }}>
                  Content Editor
                </Text>
                <Button
                  icon={CloseIcon}
                  mode="ghost"
                  onClick={handleClose}
                  style={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: '4px'
                  }}
                />
              </Flex>

              <Box style={{ height: 'calc(90vh - 120px)', overflow: 'auto' }}>
                <SimpleTextEditor
                  documentId={documentId}
                  fieldName={fieldName}
                  onSave={handleSave}
                  onCancel={handleClose}
                  title="Edit Content"
                />
              </Box>
            </Card>
          </Box>
        </Layer>
      )}
    </>
  )
} 