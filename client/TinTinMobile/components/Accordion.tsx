import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  LayoutAnimation,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/util/constant';

type AccordionProps = {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  iconColor?: string;
  iconSize?: number;
};

const Accordion = ({
  title,
  children,
  defaultOpen = false,
  containerStyle,
  titleStyle,
  iconColor = '#1F2937',
  iconSize = 20,
}: AccordionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggleOpen = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsOpen((prev) => !prev);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity onPress={toggleOpen} activeOpacity={0.7} style={styles.header}>
        <Text style={[styles.title, titleStyle]}>{title}</Text>
        <Ionicons
          name={isOpen ? 'chevron-up-outline' : 'chevron-down-outline'}
          size={iconSize}
          color={COLORS.ITEM_TEXT}
        />
      </TouchableOpacity>

      {isOpen && <View >{children}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    
    backgroundColor: COLORS.ITEM_BACKGROUND,
    shadowColor: COLORS.ITEM_BORDER,
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    marginVertical: 6,
    overflow: 'hidden',
  },
  header: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.ITEM_BACKGROUND,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.ITEM_TEXT,
  },

});

export default Accordion;
