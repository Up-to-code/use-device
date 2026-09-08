import { useLocales, type Locale } from 'expo-localization';
import { useMemo } from 'react';
import {
  Platform,
  useColorScheme,
  useWindowDimensions,
  type ColorSchemeName,
  type PlatformOSType,
} from 'react-native';

export type DeviceTheme = 'light' | 'dark';

export type DeviceSnapshot = {
  /** Current app-window width in logical pixels. */
  width: number;
  /** Current app-window height in logical pixels. */
  height: number;
  /** Physical pixels per logical pixel. */
  scale: number;
  /** User font-size multiplier. */
  fontScale: number;
  portrait: boolean;
  landscape: boolean;
  platform: PlatformOSType;
  ios: boolean;
  android: boolean;
  web: boolean;
  native: boolean;
  /** The OS preference. It can be null when no preference is available. */
  colorScheme: ColorSchemeName;
  /** A non-null theme, falling back to light when the OS has no preference. */
  theme: DeviceTheme;
  dark: boolean;
  light: boolean;
  /** Locales in the user's preference order. */
  locales: Locale[];
  /** The first preferred BCP-47 language tag, or `en` as a safe fallback. */
  languageTag: string;
  /** The first preferred language code, or `en` as a safe fallback. */
  languageCode: string;
  regionCode: string | null;
  textDirection: Locale['textDirection'];
  rtl: boolean;
};

/**
 * Returns a reactive snapshot of the current Expo environment.
 *
 * It updates for window-size, font-scale, color-scheme, and locale changes.
 * Width and height describe the app window, which is more useful for responsive
 * layout than the physical display size on split-screen and desktop platforms.
 */
export function useDevice(): DeviceSnapshot {
  const { width, height, scale, fontScale } = useWindowDimensions();
  const colorScheme = useColorScheme();
  const locales = useLocales();
  const primaryLocale = locales[0];
  const platform = Platform.OS;

  return useMemo(() => {
    const theme: DeviceTheme = colorScheme === 'dark' ? 'dark' : 'light';

    return {
      width,
      height,
      scale,
      fontScale,
      portrait: height >= width,
      landscape: width > height,
      platform,
      ios: platform === 'ios',
      android: platform === 'android',
      web: platform === 'web',
      native: platform !== 'web',
      colorScheme,
      theme,
      dark: theme === 'dark',
      light: theme === 'light',
      locales,
      languageTag: primaryLocale?.languageTag ?? 'en',
      languageCode: primaryLocale?.languageCode?.toLowerCase() ?? 'en',
      regionCode: primaryLocale?.regionCode ?? null,
      textDirection: primaryLocale?.textDirection ?? null,
      rtl: primaryLocale?.textDirection === 'rtl',
    };
  }, [
    colorScheme,
    fontScale,
    height,
    locales,
    platform,
    primaryLocale,
    scale,
    width,
  ]);
}
