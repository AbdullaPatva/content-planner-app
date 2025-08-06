import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'o7xwtv7a',
    dataset: 'production',
  },
  app: {
    id: 'eoxcb2jkvstsjz53b4nztwar',
    organizationId: 'oopxIC4jC',
    entry: './src/App.tsx',
  },
})
