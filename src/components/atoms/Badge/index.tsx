import { ReactNode } from 'react';
import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

type BadgeVariant =
  | 'default'
  | 'success'
  | 'warning'
  | 'info'
  | 'error'
  | 'destructive'
  | 'outline';

type Props = {
  children: ReactNode;
  variant?: BadgeVariant;
  style?: StyleProp<ViewStyle>;
};

const colors = {
  text: '#101828',
  muted: '#667085',
  border: '#E4E7EC',
  primary: '#0F7A4F',
  primarySoft: 'rgba(15, 122, 79, 0.10)',
  accent: '#F97316',
  accentSoft: 'rgba(249, 115, 22, 0.10)',
  info: '#2563EB',
  infoSoft: 'rgba(37, 99, 235, 0.10)',
  success: '#12B76A',
  successSoft: 'rgba(18, 183, 106, 0.10)',
  danger: '#F04438',
  dangerSoft: 'rgba(240, 68, 56, 0.10)',
};

const variantStyles: Record<
  BadgeVariant,
  { container: ViewStyle; text: TextStyle }
> = {
  default: {
    container: {
      backgroundColor: colors.primarySoft,
    },
    text: {
      color: colors.primary,
    },
  },
  success: {
    container: {
      backgroundColor: colors.successSoft,
    },
    text: {
      color: colors.success,
    },
  },
  warning: {
    container: {
      backgroundColor: colors.accentSoft,
    },
    text: {
      color: colors.accent,
    },
  },
  info: {
    container: {
      backgroundColor: colors.infoSoft,
    },
    text: {
      color: colors.info,
    },
  },
  error: {
    container: {
      backgroundColor: colors.dangerSoft,
    },
    text: {
      color: colors.danger,
    },
  },
  destructive: {
    container: {
      backgroundColor: colors.danger,
    },
    text: {
      color: '#FFFFFF',
    },
  },
  outline: {
    container: {
      backgroundColor: 'transparent',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    text: {
      color: colors.text,
    },
  },
};

export function Badge({ children, variant = 'default', style }: Props) {
  const selectedVariant = variantStyles[variant];

  return (
    <View style={[styles.container, selectedVariant.container, style]}>
      <Text style={[styles.text, selectedVariant.text]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 28,
    paddingHorizontal: 10,
    borderRadius: 999,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
});
