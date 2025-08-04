import { Card, Flex, Label, Radio, Stack, Button, Text, Box } from '@sanity/ui'
import { useState, useEffect } from 'react'
import { usePlannerSettings } from '../lib/usePlannerSettings'
import { CogIcon, CloseIcon } from '@sanity/icons'

export function SettingsPanel({ onClose }: { onClose: () => void }) {
  const { settings, save } = usePlannerSettings()
  const [defaultView, setDefaultView] = useState<'calendar' | 'board'>('calendar')
  const [weekStartsOn, setWeekStartsOn] = useState<0 | 1>(1)
  const [saving, setSaving] = useState(false)

  /* sync local form with live settings */
  useEffect(() => {
    if (!settings) return
    setDefaultView(settings.defaultView)
    setWeekStartsOn(settings.weekStartsOn)
  }, [settings])

  const handleSave = async () => {
    setSaving(true)
    await save({ defaultView, weekStartsOn })
    setSaving(false)
    onClose()
  }

  if (!settings) return null

  return (
    <Card 
      padding={0} 
      radius={3} 
      shadow={3} 
      style={{ 
        maxWidth: 480,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }} 
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <Box
        style={{
          padding: '24px 24px 16px 24px',
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
          background: 'rgba(102, 126, 234, 0.05)'
        }}
      >
        <Flex justify="space-between" align="center">
          <Flex gap={3} align="center">
            <Box
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <CogIcon style={{ color: 'white', fontSize: '18px' }} />
            </Box>
            <Box>
              <Text 
                size={2} 
                weight="semibold"
                style={{ color: '#333', marginBottom: '4px', display: 'block' }}
              >
                Planner Settings
              </Text>
              <Text 
                size={1}
                style={{ color: '#666', fontSize: '14px' }}
              >
                Customize your planning experience
              </Text>
            </Box>
          </Flex>
          
          <Button
            mode="ghost"
            padding={2}
            radius={2}
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.8)',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s ease'
            }}
          >
            <CloseIcon />
          </Button>
        </Flex>
      </Box>

      {/* Content */}
      <Box padding={4}>
        <Stack space={4}>
          {/* Default View Section */}
          <Box>
            <Label 
              size={1} 
              style={{ 
                color: '#333', 
                fontWeight: '600', 
                marginBottom: '12px',
                display: 'block',
                fontSize: '14px'
              }}
            >
              Default View
            </Label>

            <Flex direction="column" gap={2}>
              <Card
                as="label"
                htmlFor="view-calendar"
                padding={3}
                radius={2}
                style={{
                  background: defaultView === 'calendar' ? 'rgba(102, 126, 234, 0.1)' : 'rgba(255, 255, 255, 0.8)',
                  border: defaultView === 'calendar' ? '1px solid rgba(102, 126, 234, 0.3)' : '1px solid rgba(0, 0, 0, 0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <Flex gap={3} align="center">
                  <Radio
                    id="view-calendar"
                    name="view"
                    value="calendar"
                    checked={defaultView === 'calendar'}
                    onChange={() => setDefaultView('calendar')}
                  />
                  <Box>
                    <Text size={1} weight="medium" style={{ color: '#333' }}>
                      Calendar
                    </Text>
                    <Text size={1} style={{ color: '#666', fontSize: '12px' }}>
                      View content in a monthly calendar layout
                    </Text>
                  </Box>
                </Flex>
              </Card>

              <Card
                as="label"
                htmlFor="view-board"
                padding={3}
                radius={2}
                style={{
                  background: defaultView === 'board' ? 'rgba(102, 126, 234, 0.1)' : 'rgba(255, 255, 255, 0.8)',
                  border: defaultView === 'board' ? '1px solid rgba(102, 126, 234, 0.3)' : '1px solid rgba(0, 0, 0, 0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <Flex gap={3} align="center">
                  <Radio
                    id="view-board"
                    name="view"
                    value="board"
                    checked={defaultView === 'board'}
                    onChange={() => setDefaultView('board')}
                  />
                  <Box>
                    <Text size={1} weight="medium" style={{ color: '#333' }}>
                      Board
                    </Text>
                    <Text size={1} style={{ color: '#666', fontSize: '12px' }}>
                      Organize content by status in a kanban board
                    </Text>
                  </Box>
                </Flex>
              </Card>
            </Flex>
          </Box>

          {/* Week Start Section */}
          <Box>
            <Label 
              size={1} 
              style={{ 
                color: '#333', 
                fontWeight: '600', 
                marginBottom: '12px',
                display: 'block',
                fontSize: '14px'
              }}
            >
              Week Starts On
            </Label>

            <Flex direction="column" gap={2}>
              <Card
                as="label"
                htmlFor="week-sun"
                padding={3}
                radius={2}
                style={{
                  background: weekStartsOn === 0 ? 'rgba(102, 126, 234, 0.1)' : 'rgba(255, 255, 255, 0.8)',
                  border: weekStartsOn === 0 ? '1px solid rgba(102, 126, 234, 0.3)' : '1px solid rgba(0, 0, 0, 0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <Flex gap={3} align="center">
                  <Radio
                    id="week-sun"
                    name="week"
                    value="0"
                    checked={weekStartsOn === 0}
                    onChange={() => setWeekStartsOn(0)}
                  />
                  <Box>
                    <Text size={1} weight="medium" style={{ color: '#333' }}>
                      Sunday
                    </Text>
                    <Text size={1} style={{ color: '#666', fontSize: '12px' }}>
                      Calendar weeks start on Sunday
                    </Text>
                  </Box>
                </Flex>
              </Card>

              <Card
                as="label"
                htmlFor="week-mon"
                padding={3}
                radius={2}
                style={{
                  background: weekStartsOn === 1 ? 'rgba(102, 126, 234, 0.1)' : 'rgba(255, 255, 255, 0.8)',
                  border: weekStartsOn === 1 ? '1px solid rgba(102, 126, 234, 0.3)' : '1px solid rgba(0, 0, 0, 0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <Flex gap={3} align="center">
                  <Radio
                    id="week-mon"
                    name="week"
                    value="1"
                    checked={weekStartsOn === 1}
                    onChange={() => setWeekStartsOn(1)}
                  />
                  <Box>
                    <Text size={1} weight="medium" style={{ color: '#333' }}>
                      Monday
                    </Text>
                    <Text size={1} style={{ color: '#666', fontSize: '12px' }}>
                      Calendar weeks start on Monday
                    </Text>
                  </Box>
                </Flex>
              </Card>
            </Flex>
          </Box>

          {/* Actions */}
          <Flex gap={2} justify="flex-end" style={{ marginTop: '16px' }}>
            <Button
              mode="ghost"
              text="Cancel"
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.8)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s ease'
              }}
            />
            <Button
              text={saving ? "Saving..." : "Save Changes"}
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
        </Stack>
      </Box>
    </Card>
  )
}
