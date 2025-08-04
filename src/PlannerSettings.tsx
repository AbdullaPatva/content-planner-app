import { Box, Button, Card, Stack, Text, TextInput, Spinner } from '@sanity/ui'
import { useState } from 'react'
import { usePlannerConfig } from './lib/usePlannerConfig'

export function PlannerSettings() {
    const [cfg, save, loading] = usePlannerConfig()
    const [webhook, setWebhook] = useState(cfg?.slackWebhookUrl ?? '')
    const [offset, setOffset] = useState(String(cfg?.reminderOffsetMinutes ?? 60))
    const [saving, setSaving] = useState(false)

    if (loading) return <Spinner />

    const handleSave = async () => {
        setSaving(true)
        await save({ slackWebhookUrl: webhook || undefined, reminderOffsetMinutes: Number(offset) })
        setSaving(false)
    }

    return (
        <Box padding={4} style={{ maxWidth: 560 }}>
            <Stack space={5}>
                <Text size={3} weight="bold">
                    Planner Settings
                </Text>

                <Card padding={4} radius={2} shadow={1}>
                    <Stack space={4}>
                        <Stack space={2}>
                            <Text size={1} weight="medium">
                                Slack Webhook URL
                            </Text>
                            <TextInput
                                value={webhook}
                                onChange={(e) => setWebhook(e.currentTarget.value)}
                                placeholder="https://hooks.slack.com/services/…"
                            />
                        </Stack>

                        <Stack space={2}>
                            <Text size={1} weight="medium">
                                Reminder offset (minutes before publish)
                            </Text>
                            <TextInput
                                type="number"
                                value={offset}
                                onChange={(e) => setOffset(e.currentTarget.value)}
                                style={{ width: 120 }}
                            />
                        </Stack>

                        <Button tone="primary" text="Save" disabled={saving} onClick={handleSave} />
                        {saving && <Text size={1}>Saving…</Text>}
                    </Stack>
                </Card>
            </Stack>
        </Box>
    )
}
