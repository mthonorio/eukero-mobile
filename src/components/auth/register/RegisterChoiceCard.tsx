import { type ComponentType } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type ChoiceIcon = ComponentType<{
  color?: string;
  size?: number;
  strokeWidth?: number;
}>;

type RegisterChoiceCardProps = {
  title: string;
  description: string;
  Icon: ChoiceIcon;
  selected?: boolean;
  onPress: () => void;
};

export function RegisterChoiceCard({
  title,
  description,
  Icon,
  selected,
  onPress,
}: RegisterChoiceCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        selected ? styles.cardSelected : null,
        pressed ? styles.cardPressed : null,
      ]}
    >
      <View style={styles.iconWrap}>
        <Icon color='#640000ff' size={24} strokeWidth={2} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#e5d2d2',
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 14,
    padding: 18,
  },
  cardSelected: {
    borderColor: '#640000ff',
    shadowColor: '#640000ff',
    shadowOpacity: 0.14,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
    elevation: 2,
  },
  cardPressed: {
    transform: [{ scale: 0.99 }],
  },
  iconWrap: {
    alignItems: 'center',
    backgroundColor: '#f9efef',
    borderRadius: 999,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: '#111111',
    fontSize: 17,
    fontWeight: '700',
  },
  description: {
    color: '#666666',
    fontSize: 13,
    lineHeight: 18,
  },
});
