import { definePlugin } from 'sanity'
import article from '../../../sanity-planner/schemaTypes/article'
import workflowStatus from '../../../sanity-planner/schemaTypes/workflowStatus'
import editorialComment from '../../../sanity-planner/schemaTypes/editorialComment'
import author from '../../../sanity-planner/schemaTypes/author'
import plannerConfig from './plannerConfig'
import plannerSettings from '../../../sanity-planner/schemaTypes/plannerSettings'
import category from '../../../sanity-planner/schemaTypes/category'

export const plannerSchemaPlugin = definePlugin({
    name: 'planner-schema',
    schema: {
        types: [article, workflowStatus, editorialComment, author, plannerConfig, plannerSettings, category],
    },
})
