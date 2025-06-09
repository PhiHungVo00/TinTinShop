// components/MenuCard.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { COLORS } from '@/util/constant';

interface MenuCardProps {
  title: string;
  subtitle?: string;
  image?: string;
  icon?: string;
  status?: boolean | string;
  price?: number;
  onPress?: () => void;
  type?: 'product' | 'category' | 'topping';
}

export const MenuCard: React.FC<MenuCardProps> = ({
  title,
  subtitle,
  image,
  icon,
  status,
  price,
  onPress,
  type = 'product'
}) => {
  const getStatusColor = () => {
    if (typeof status === 'boolean') {
      return status ? COLORS.SUCCESS : COLORS.ERROR;
    }
    return status === 'ACTIVE' ? COLORS.SUCCESS : COLORS.ERROR;
  };

  const getStatusText = () => {
    if (typeof status === 'boolean') {
      return status ? 'Hoạt động' : 'Không hoạt động';
    }
    return status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động';
  };

  const renderImage = () => {
    if (image) {
      return (
        <Image
          source={{ uri: image }}
          style={styles.cardImage}
          resizeMode="cover"
        />
      );
    }
    
    if (icon) {
      return (
        <View style={styles.iconContainer}>
          <Ionicons name={icon as any} size={40} color={COLORS.PRIMARY} />
        </View>
      );
    }

    return (
      <View style={styles.iconContainer}>
        <Ionicons name="image-outline" size={40} color={COLORS.ITEM_TEXT} />
      </View>
    );
  };

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      {renderImage()}
      
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {title}
        </Text>
        
        {subtitle && (
          <Text style={styles.cardSubtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
        
        {price !== undefined && (
          <Text style={styles.cardPrice}>
            {price.toLocaleString('vi-VN')} ₫
          </Text>
        )}
        
        {status !== undefined && (
          <View style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor() }
          ]}>
            <Text style={styles.statusText}>
              {getStatusText()}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

// components/SectionHeader.tsx
interface SectionHeaderProps {
  title: string;
  onManage: () => void;
  count?: number;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  onManage,
  count
}) => {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.titleContainer}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {count !== undefined && (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{count}</Text>
          </View>
        )}
      </View>
      
      <TouchableOpacity
        style={styles.manageButton}
        onPress={onManage}
        activeOpacity={0.7}
      >
        <Ionicons name="settings-outline" size={20} color={COLORS.TEXT} />
        <Text style={styles.manageText}>Quản lý</Text>
      </TouchableOpacity>
    </View>
  );
};

// components/LoadingSection.tsx
interface LoadingSectionProps {
  message?: string;
}

export const LoadingSection: React.FC<LoadingSectionProps> = ({
  message = "Đang tải..."
}) => {
  return (
    <View style={styles.loadingContainer}>
      <View style={styles.loadingCard}>
        <View style={styles.loadingImage} />
        <View style={styles.loadingContent}>
          <View style={styles.loadingTitle} />
          <View style={styles.loadingSubtitle} />
        </View>
      </View>
      <View style={styles.loadingCard}>
        <View style={styles.loadingImage} />
        <View style={styles.loadingContent}>
          <View style={styles.loadingTitle} />
          <View style={styles.loadingSubtitle} />
        </View>
      </View>
    </View>
  );
};

// components/EmptySection.tsx
interface EmptySectionProps {
  message?: string;
  icon?: string;
}

export const EmptySection: React.FC<EmptySectionProps> = ({
  message = "Không có dữ liệu",
  icon = "folder-open-outline"
}) => {
  return (
    <View style={styles.emptyContainer}>
      <Ionicons name={icon as any} size={60} color={COLORS.ITEM_TEXT} />
      <Text style={styles.emptyText}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 160,
    backgroundColor: COLORS.ITEM_BACKGROUND,
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: COLORS.ITEM_BORDER,
    shadowColor: COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    marginBottom: 8,
    backgroundColor: COLORS.CONTENT_ACCORDION,
    borderRadius: 8,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: COLORS.ITEM_TEXT,
    marginBottom: 8,
  },
  cardPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.PRIMARY,
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '500',
    color: COLORS.TEXT,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.TEXT,
  },
  countBadge: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  countText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.TEXT,
  },
  manageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 8,
  },
  manageText: {
    color: COLORS.TEXT,
    fontWeight: '500',
    marginLeft: 5,
  },
  loadingContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
  },
  loadingCard: {
    width: 160,
    backgroundColor: COLORS.ITEM_BACKGROUND,
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: COLORS.ITEM_BORDER,
  },
  loadingImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    backgroundColor: COLORS.CONTENT_ACCORDION,
    marginBottom: 8,
  },
  loadingContent: {
    flex: 1,
  },
  loadingTitle: {
    height: 16,
    backgroundColor: COLORS.CONTENT_ACCORDION,
    borderRadius: 4,
    marginBottom: 8,
  },
  loadingSubtitle: {
    height: 12,
    backgroundColor: COLORS.CONTENT_ACCORDION,
    borderRadius: 4,
    width: '70%',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyText: {
    color: COLORS.ITEM_TEXT,
    marginTop: 15,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default {
  MenuCard,
  SectionHeader,
  LoadingSection,
  EmptySection,
};