import {type SanityConfig} from '@sanity/sdk'
import {SanityApp} from '@sanity/sdk-react'
import {Flex, Spinner} from '@sanity/ui'
import {Planner} from './Planner'
import {SanityUI} from './SanityUI'

function App() {
  const sanityConfigs: SanityConfig[] = [
    {
      projectId: 'o7xwtv7a',
      dataset: 'production',
    }
  ]

  function Loading() {
    return (
      <Flex justify="center" align="center" width="100vw" height="fill">
        <Spinner />
      </Flex>
    )
  }

  return (
    <SanityUI>
      <SanityApp config={sanityConfigs} fallback={<Loading />}>
        <Planner />
      </SanityApp>
    </SanityUI>
  );
}

export default App
