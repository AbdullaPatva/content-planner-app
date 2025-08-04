import {Flex, Spinner, ThemeProvider, studioTheme} from '@sanity/ui'
import {Planner} from './Planner'
import {SanityClientProvider} from './SanityClientContext'

function App() {
  function Loading() {
    return (
      <Flex justify="center" align="center" width="100vw" height="fill">
        <Spinner />
      </Flex>
    )
  }

  return (
    <ThemeProvider theme={studioTheme}>
      <SanityClientProvider>
        <Flex style={{ width: '100vw', height: '100vh' }}>
          <Planner />
        </Flex>
      </SanityClientProvider>
    </ThemeProvider>
  );
}

export default App
