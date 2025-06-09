import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/util/constant';
import { router } from 'expo-router';

interface RestockButtonProps {
  productId: string;
  navigation: any;
  style?: ViewStyle;
  textStyle?: TextStyle;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  showIcon?: boolean;
  title?: string;
}

const RestockButton: React.FC<RestockButtonProps> = ({
  productId,
  navigation,
  style,
  textStyle,
  size = 'medium',
  variant = 'primary',
  disabled = false,
  showIcon = true,
  title = 'Restock'
}) => {
  const handlePress = () => {
    if (disabled) return;
    
    router.push({
      pathname: '/management/products/variants/QuickRestock',
      params: {
        productId: productId,
      },
    });
  };

  const getButtonStyle = () => {
    let baseStyle = [styles.button];
    
    // Size styles
    switch (size) {
      case 'small':
        baseStyle.push(styles.buttonSmall as any);
        break;
      case 'large':
        baseStyle.push(styles.buttonLarge as any);
        break;
      default:
        baseStyle.push(styles.buttonMedium as any);
    }
    
    // Variant styles
    switch (variant) {
      case 'secondary':
        baseStyle.push(styles.buttonSecondary as any);
        break;
      case 'outline':
        baseStyle.push(styles.buttonOutline as any);
        break;
      default:
        baseStyle.push(styles.buttonPrimary as any);
    }
    
    // Disabled style
    if (disabled) {
      baseStyle.push(styles.buttonDisabled as any);
    }
    
    // Custom style
    if (style) {
      baseStyle.push(style as any);
    }
    
    return baseStyle;
  };

  const getTextStyle = () => {
    let baseTextStyle = [styles.buttonText];
    
    // Size text styles
    switch (size) {
      case 'small':
        baseTextStyle.push(styles.buttonTextSmall as any);
        break;
      case 'large':
        baseTextStyle.push(styles.buttonTextLarge as any);
        break;
      default:
        baseTextStyle.push(styles.buttonTextMedium as any);
    }
    
    // Variant text styles
    switch (variant) {
      case 'outline':
        baseTextStyle.push(styles.buttonTextOutline as any);
        break;
      default:
        baseTextStyle.push(styles.buttonTextDefault as any);
    }
    
    // Disabled text style
    if (disabled) {
      baseTextStyle.push(styles.buttonTextDisabled as any);
    }
    
    // Custom text style
    if (textStyle) {
      baseTextStyle.push(textStyle as any);
    }
    
    return baseTextStyle;
  };

  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 16;
      case 'large':
        return 28;
      default:
        return 20;
    }
  };

  const getIconColor = () => {
    if (disabled) {
      return COLORS.DISABLED_TEXT;
    }
    
    switch (variant) {
      case 'outline':
        return COLORS.PRIMARY;
      default:
        return COLORS.TEXT;
    }
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={disabled ? 1 : 0.7}
    >
      {showIcon && (
        <Ionicons
          name="add-circle"
          size={getIconSize()}
          color={getIconColor()}
        />
      )}
      <Text style={getTextStyle()}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    gap: 6,
  },
  
  // Size styles
  buttonSmall: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  buttonMedium: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  buttonLarge: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 10,
  },
  
  // Variant styles
  buttonPrimary: {
    backgroundColor: COLORS.SUCCESS,
  },
  buttonSecondary: {
    backgroundColor: COLORS.PRIMARY,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
  },
  buttonDisabled: {
    backgroundColor: COLORS.DISABLED_BACKGROUND,
    borderColor: COLORS.DISABLED_BORDER,
  },
  
  // Text styles
  buttonText: {
    fontWeight: '600',
  },
  buttonTextSmall: {
    fontSize: 12,
  },
  buttonTextMedium: {
    fontSize: 14,
  },
  buttonTextLarge: {
    fontSize: 16,
  },
  buttonTextDefault: {
    color: COLORS.TEXT,
  },
  buttonTextOutline: {
    color: COLORS.PRIMARY,
  },
  buttonTextDisabled: {
    color: COLORS.DISABLED_TEXT,
  },
});

export default RestockButton;