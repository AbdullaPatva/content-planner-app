import {defineApp} from 'sanity/app'
import {Planner} from './src/Planner'
import {PlannerSettings} from './src/PlannerSettings'
import {plannerSchemaPlugin} from './plugins/planner-schema'

export default defineApp({
  name: 'Planner',
  components: {
    main: Planner,
    settings: PlannerSettings,
  },
  plugins: [plannerSchemaPlugin],
})
