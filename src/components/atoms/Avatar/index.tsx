import { Image, StyleSheet, View } from 'react-native';
import type { ImageStyle, StyleProp, ViewStyle } from 'react-native';
import { User } from 'lucide-react-native';

type AvatarProps = {
  uri?: string | null;
  size?: number;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  iconColor?: string;
  iconSize?: number;
};

export function Avatar({
  uri,
  size = 40,
  style,
  imageStyle,
  iconColor = '#98A2B3',
  iconSize,
}: AvatarProps) {
  const resolvedIconSize = iconSize ?? Math.round(size * 0.55);

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      {uri ? (
        <Image
          source={{ uri }}
          style={[styles.image, { width: size, height: size }, imageStyle]}
          resizeMode='cover'
        />
      ) : (
        <User color={iconColor} size={resolvedIconSize} strokeWidth={2} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 999,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F4F7',
  },
  image: {
    borderRadius: 999,
  },
});

export default Avatar;
