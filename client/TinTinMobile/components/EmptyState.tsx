import React from 'react';
import { View, Text, useColorScheme, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export default function EmptyState({
  title = 'Không có dữ liệu',
  description = 'Hiện tại không có thông tin để hiển thị.',
}: EmptyStateProps) {
  const isDark = useColorScheme() === 'dark';

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <AntDesign
        name="inbox"
        size={48}
        color={isDark ? '#888' : '#555'}
        style={styles.icon}
      />
      <Text style={[styles.title, isDark && styles.titleDark]}>{title}</Text>
      <Text style={[styles.description, isDark && styles.descriptionDark]}>
        {description}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#ccc',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f8f8',
  },
  containerDark: {
    backgroundColor: '#1a1a1a',
    borderColor: '#444',
  },
  icon: {
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
  },
  titleDark: {
    color: '#eee',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  descriptionDark: {
    color: '#aaa',
  },
});
