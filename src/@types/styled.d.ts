import 'styled-components/native'
import myTheme from '../theme'

declare module 'styled-components/native' {
  type CustomTheme = typeof myTheme

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends CustomTheme {}
}
