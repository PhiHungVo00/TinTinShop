import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { COLORS } from '@/util/constant';
interface AppHeaderProps {
  title: string;
  rightComponent?: React.ReactNode;
  leftComponent?: React.ReactNode;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  rightComponent,
  leftComponent,
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>{leftComponent}</View>

      <View style={styles.headerCenter}>
        <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
      </View>

      <View style={styles.headerRight}>{rightComponent}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.BACKGROUND,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.ITEM_BORDER,
  },
  headerLeft: {
    width: 50,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRight: {
    width: 50,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.TEXT,
  },
});

export default AppHeader;
