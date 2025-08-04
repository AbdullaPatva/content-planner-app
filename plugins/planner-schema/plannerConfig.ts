import { defineType, defineField } from 'sanity'

export default defineType({
    name: 'plannerConfig',
    title: 'Planner Config',
    type: 'document',
    __experimental_form: { clientId: 'planner-app' },
    fields: [
        defineField({
            name: 'slackWebhookUrl',
            title: 'Slack Webhook URL',
            type: 'url',
            description: 'Paste a Slack Incoming-Webhook URL',
            validation: (R) => R.uri({ scheme: ['https'] }),
        }),
        defineField({
            name: 'reminderOffsetMinutes',
            title: 'Reminder offset (minutes before publishAt)',
            type: 'number',
            initialValue: 60,
            validation: (R) => R.integer().min(1),
        }),
    ],
})
