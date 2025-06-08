import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '@/util/constant';
import { ICategory } from '@/types/backend';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface ItemCategoryProps {
  category: ICategory;
  editPress: () => void;
  deletePress: () => void;
}

const ItemCategory: React.FC<ItemCategoryProps> = ({ 
  category, 
  editPress, 
  deletePress 
}) => {
  const getStatusColor = (active: boolean) => {
    return active ? COLORS.SUCCESS || '#4CAF50' : COLORS.ERROR || '#F44336';
  };

  const getStatusText = (active: boolean) => {
    return active ? 'Hoạt động' : 'Không hoạt động';
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        {/* Category Header */}
        <View style={styles.headerRow}>
          <View style={styles.idContainer}>
            <Text style={styles.idText}>#{category.id}</Text>
          </View>
          <View style={[
            styles.statusBadge, 
            { backgroundColor: getStatusColor(category.active || false) }
          ]}>
            <Text style={styles.statusText}>
              {getStatusText(category.active || false)}
            </Text>
          </View>
        </View>

        {/* Category Name */}
        <Text style={styles.categoryName} numberOfLines={2}>
          {category.name || 'Không có tên'}
        </Text>

        {/* Category Description */}
        {category.description && (
          <Text style={styles.categoryDescription} numberOfLines={3}>
            {category.description}
          </Text>
        )}

        {/* Additional Info Row */}
        <View style={styles.infoRow}>
          {category.createdAt && (
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={14} color={COLORS.ITEM_TEXT_SECONDARY || '#666'} />
              <Text style={styles.infoText}>
                {new Date(category.createdAt).toLocaleDateString('vi-VN')}
              </Text>
            </View>
          )}
          
       
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.editButton]} 
          onPress={editPress}
          activeOpacity={0.7}
        >
          <Ionicons name="create-outline" size={20} color={COLORS.BLUE_LIGHT || '#2196F3'} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]} 
          onPress={deletePress}
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={20} color={COLORS.ERROR || '#F44336'} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.ITEM_BACKGROUND || '#FFFFFF',
    borderRadius: 12,
    marginVertical: 6,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: COLORS.ITEM_BORDER || '#E0E0E0',
  },
  contentContainer: {
    flex: 1,
    marginRight: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  idContainer: {
    backgroundColor: COLORS.BACKGROUND || '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  idText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.ITEM_TEXT || '#333333',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.ITEM_TEXT || '#333333',
    marginBottom: 6,
    lineHeight: 22,
  },
  categoryDescription: {
    fontSize: 14,
    color: COLORS.ITEM_TEXT_SECONDARY || '#666666',
    marginBottom: 8,
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 12,
    color: COLORS.ITEM_TEXT_SECONDARY || '#666666',
  },
  actionContainer: {
    flexDirection: 'column',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  editButton: {
    backgroundColor: COLORS.BLUE_LIGHT_BACKGROUND || '#E3F2FD',
    borderColor: COLORS.BLUE_LIGHT || '#2196F3',
  },
  deleteButton: {
    backgroundColor: COLORS.ERROR_BACKGROUND || '#FFEBEE',
    borderColor: COLORS.ERROR || '#F44336',
  },
});

export default ItemCategory;