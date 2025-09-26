import 'styled-components';
import { Theme } from './styles/theme';

declare module 'styled-components' {
  // Sobrescreve a interface DefaultTheme do styled-components
  export interface DefaultTheme extends Theme {}
}