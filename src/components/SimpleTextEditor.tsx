import React, { useState, useEffect } from 'react'
import { Box, Card, Button, Text, Flex, TextArea, Spinner } from '@sanity/ui'
import { useClient } from '@sanity/sdk-react'
import { SaveIcon, XIcon, BoldIcon, ItalicIcon, ListIcon } from '@sanity/icons'

interface SimpleTextEditorProps {
  documentId: string
  fieldName: string
  initialValue?: string
  onSave?: (value: string) => void
  onCancel?: () => void
  title?: string
}

export function SimpleTextEditor({
  documentId,
  fieldName,
  initialValue = '',
  onSave,
  onCancel,
  title = 'Edit Content'
}: SimpleTextEditorProps) {
  const client = useClient({ apiVersion: '2025-07-15' })
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

  const formatText = (format: 'bold' | 'italic' | 'list') => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)

    let formattedText = ''
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`
        break
      case 'italic':
        formattedText = `*${selectedText}*`
        break
      case 'list':
        formattedText = selectedText.split('\n').map(line => `- ${line}`).join('\n')
        break
    }

    const newValue = value.substring(0, start) + formattedText + value.substring(end)
    setValue(newValue)

    // Set cursor position after the formatted text
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start, start + formattedText.length)
    }, 0)
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

      {/* Toolbar */}
      <Box
        style={{
          padding: '12px 24px',
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
          background: 'rgba(255, 255, 255, 0.8)'
        }}
      >
        <Flex gap={2}>
          <Button
            mode="ghost"
            padding={2}
            radius={2}
            onClick={() => formatText('bold')}
            style={{
              background: 'rgba(255, 255, 255, 0.8)',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s ease'
            }}
          >
            <BoldIcon />
          </Button>
          <Button
            mode="ghost"
            padding={2}
            radius={2}
            onClick={() => formatText('italic')}
            style={{
              background: 'rgba(255, 255, 255, 0.8)',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s ease'
            }}
          >
            <ItalicIcon />
          </Button>
          <Button
            mode="ghost"
            padding={2}
            radius={2}
            onClick={() => formatText('list')}
            style={{
              background: 'rgba(255, 255, 255, 0.8)',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s ease'
            }}
          >
            <ListIcon />
          </Button>
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
        <TextArea
          value={value}
          onChange={(e) => setValue(e.currentTarget.value)}
          placeholder="Start writing your content here..."
          style={{
            minHeight: '350px',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            borderRadius: '6px',
            padding: '16px',
            background: 'white',
            fontSize: '14px',
            lineHeight: '1.6',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          }}
        />
        
        <Box
          style={{
            marginTop: '16px',
            padding: '12px',
            background: 'rgba(0, 0, 0, 0.02)',
            borderRadius: '4px',
            border: '1px solid rgba(0, 0, 0, 0.05)'
          }}
        >
          <Text size={1} style={{ color: '#666', marginBottom: '8px' }}>
            <strong>Markdown Formatting:</strong>
          </Text>
          <Text size={1} style={{ color: '#999', fontSize: '12px' }}>
            • <strong>Bold:</strong> **text** or use the Bold button
            <br />
            • <em>Italic:</em> *text* or use the Italic button
            <br />
            • <strong>Lists:</strong> Use the List button or type - item
            <br />
            • <strong>Headers:</strong> # H1, ## H2, ### H3
          </Text>
        </Box>
      </Box>
    </Card>
  )
} 