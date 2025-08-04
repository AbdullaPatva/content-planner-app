import React, { useState, useEffect } from 'react'
import { Box, Card, Button, Text, Flex, Spinner } from '@sanity/ui'
import { useSanityClient } from '../SanityClientContext'
import { SaveIcon, XIcon } from '@sanity/icons'

interface PortableTextEditorProps {
  documentId: string
  fieldName: string
  initialValue?: any
  onSave?: (value: any) => void
  onCancel?: () => void
  title?: string
}

export function PortableTextEditorComponent({
  documentId,
  fieldName,
  initialValue = [],
  onSave,
  onCancel,
  title = 'Edit Content'
}: PortableTextEditorProps) {
  const client = useSanityClient()
  const [value, setValue] = useState(initialValue)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  // Load initial content
  useEffect(() => {
    const loadContent = async () => {
      try {
        const doc = await client.fetch(`*[_id == $id][0]{${fieldName}}`, { id: documentId })
        if (doc && doc[fieldName]) {
          setValue(doc[fieldName])
        }
      } catch (error) {
        console.error('Failed to load content:', error)
      } finally {
        setLoading(false)
      }
    }
    loadContent()
  }, [client, documentId, fieldName])

  const handleSave = async () => {
    setSaving(true)
    try {
      // Update the document in Sanity
      await client
        .patch(documentId)
        .set({ [fieldName]: value })
        .commit({ tag: 'content-edit' })

      // Call the onSave callback if provided
      if (onSave) {
        onSave(value)
      }
    } catch (error) {
      console.error('Failed to save content:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    }
  }

  if (loading) {
    return (
      <Box
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '200px',
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '8px'
        }}
      >
        <Spinner size={3} />
      </Box>
    )
  }

  return (
    <Card
      padding={0}
      radius={3}
      shadow={3}
      style={{
        maxWidth: '800px',
        width: '100%',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}
    >
      {/* Header */}
      <Box
        style={{
          padding: '20px 24px',
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
          background: 'rgba(102, 126, 234, 0.05)'
        }}
      >
        <Flex justify="space-between" align="center">
          <Text size={2} weight="semibold" style={{ color: '#333' }}>
            {title}
          </Text>
          
          <Flex gap={2}>
            <Button
              mode="ghost"
              text="Cancel"
              onClick={handleCancel}
              style={{
                background: 'rgba(255, 255, 255, 0.8)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s ease'
              }}
            />
            <Button
              text={saving ? "Saving..." : "Save"}
              tone="primary"
              onClick={handleSave}
              disabled={saving}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                transition: 'all 0.2s ease'
              }}
            />
          </Flex>
        </Flex>
      </Box>

      {/* Editor */}
      <Box
        style={{
          padding: '24px',
          minHeight: '400px',
          background: 'white'
        }}
      >
        <Box
          style={{
            minHeight: '350px',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            borderRadius: '6px',
            padding: '16px',
            background: 'white'
          }}
        >
          <Text size={1} style={{ color: '#666', marginBottom: '16px' }}>
            Portable Text Editor - Content editing will be implemented here
          </Text>
          
          <Box
            style={{
              minHeight: '300px',
              border: '1px dashed rgba(0, 0, 0, 0.2)',
              borderRadius: '4px',
              padding: '16px',
              background: 'rgba(0, 0, 0, 0.02)'
            }}
          >
            <Text size={1} style={{ color: '#999' }}>
              This is where the rich text editor would be integrated.
              <br />
              Content: {JSON.stringify(value, null, 2)}
            </Text>
          </Box>
        </Box>
      </Box>
    </Card>
  )
} 