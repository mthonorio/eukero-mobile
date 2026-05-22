// Tipos para as cores do design system

export type PrincipalColors = 'green' | 'light' | 'magent' | 'orange';
export type SecondaryColors = 'black' | 'lightGreen' | 'red' | 'white';
export type ColorScale = 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100;

export interface ColorPalette {
  principal: Record<PrincipalColors, string>;
  secondary: Record<SecondaryColors, string>;
  magent: Record<ColorScale, string>;
  green: Record<ColorScale, string>;
  orange: Record<ColorScale, string>;
  light: Record<ColorScale, string>;
}

// Tipo para acessar cores de forma type-safe
export type ColorPath =
  | `principal.${PrincipalColors}`
  | `secondary.${SecondaryColors}`
  | `magent.${ColorScale}`
  | `green.${ColorScale}`
  | `orange.${ColorScale}`
  | `light.${ColorScale}`;
