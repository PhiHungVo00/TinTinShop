import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Stack } from 'expo-router';

// Import your API functions and types
import {
  callGetProductSizesByProductId,
  callUpdateProductSize,
  callGetProductById,
} from '@/config/api';
import { COLORS } from '@/util/constant';
import { IProductSizeReq, IProductSizeRes } from '@/types/productSize';
import { IProductResponseDTO } from '@/types/product';
import { ProductSizeStatus } from '@/types/enums/ProductSizeStatus.enum';

interface RestockItem extends IProductSizeRes {
  newStock: number;
  isSelected: boolean;
  isUpdating: boolean;
}

const QuickRestock: React.FC = () => {
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const router = useRouter();
  
  const [product, setProduct] = useState<IProductResponseDTO | null>(null);
  const [restockItems, setRestockItems] = useState<RestockItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [defaultRestockAmount, setDefaultRestockAmount] = useState('20');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCount, setSelectedCount] = useState(0);

  useEffect(() => {
    if (!productId) {
      Alert.alert('Lỗi', 'Không tìm thấy ID sản phẩm', [
        { text: 'OK', onPress: () => router.back() }
      ]);
      return;
    }
    loadInitialData();
  }, [productId]);

  useEffect(() => {
    const count = restockItems.filter(item => item.isSelected).length;
    setSelectedCount(count);
  }, [restockItems]);

  const loadInitialData = async () => {
    if (!productId) return;
    
    setLoading(true);
    try {
      await Promise.all([
        loadProduct(),
        loadProductSizes(),
      ]);
    } catch (error) {
      console.error('Error loading initial data:', error);
      Alert.alert('Lỗi', 'Không thể tải dữ liệu sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const loadProduct = async () => {
    if (!productId) return;
    
    try {
      const response = await callGetProductById(productId);
      if (response.data) {
        setProduct(response.data);
      }
    } catch (error) {
      console.error('Error loading product:', error);
    }
  };

  const loadProductSizes = async () => {
    if (!productId) return;
    
    try {
      const response = await callGetProductSizesByProductId(productId);
      if (response.data) {
        const productSizes = response.data || [];
        const activeSizes = productSizes.filter(size => size.status === ProductSizeStatus.ACTIVE);
        
        const restockData: RestockItem[] = activeSizes.map(size => ({
          ...size,
          newStock: parseInt(defaultRestockAmount),
          isSelected: true, // Mặc định chọn tất cả active sizes
          isUpdating: false,
        }));
        
        setRestockItems(restockData);
      }
    } catch (error) {
      console.error('Error loading product sizes:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProductSizes();
    setRefreshing(false);
  };

  const handleSelectAll = () => {
    const allSelected = restockItems.every(item => item.isSelected);
    setRestockItems(items =>
      items.map(item => ({
        ...item,
        isSelected: !allSelected,
      }))
    );
  };

  const handleSelectItem = (itemId: string) => {
    setRestockItems(items =>
      items.map(item =>
        item.id === itemId
          ? { ...item, isSelected: !item.isSelected }
          : item
      )
    );
  };

  const handleUpdateStockAmount = (itemId: string, newAmount: string) => {
    const amount = parseInt(newAmount) || 0;
    setRestockItems(items =>
      items.map(item =>
        item.id === itemId
          ? { ...item, newStock: amount }
          : item
      )
    );
  };

  const handleSetAllAmount = () => {
    const amount = parseInt(defaultRestockAmount) || 0;
    setRestockItems(items =>
      items.map(item => ({
        ...item,
        newStock: amount,
      }))
    );
  };

  const handleQuickRestock = async () => {
    const selectedItems = restockItems.filter(item => item.isSelected);
    
    if (selectedItems.length === 0) {
      Alert.alert('Thông báo', 'Vui lòng chọn ít nhất một size để restock');
      return;
    }

    Alert.alert(
      'Xác nhận Restock',
      `Bạn có chắc chắn muốn cập nhật tồn kho cho ${selectedItems.length} size đã chọn?`,
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Xác nhận', onPress: performRestock },
      ]
    );
  };

  const performRestock = async () => {
    const selectedItems = restockItems.filter(item => item.isSelected);
    setIsProcessing(true);

    let successCount = 0;
    let failCount = 0;

    for (const item of selectedItems) {
      try {
        // Cập nhật trạng thái đang xử lý
        setRestockItems(items =>
          items.map(i =>
            i.id === item.id ? { ...i, isUpdating: true } : i
          )
        );

        const updateRequest: IProductSizeReq = {
          sizeId: item.sizeId,
          price: item.price,
          stockQuantity: item.stockQuantity + item.newStock, // Cộng thêm vào số hiện tại
          status: item.status,
        };

        await callUpdateProductSize(item.id, updateRequest);
        successCount++;

        // Cập nhật dữ liệu local
        setRestockItems(items =>
          items.map(i =>
            i.id === item.id
              ? {
                  ...i,
                  stockQuantity: i.stockQuantity + i.newStock,
                  isUpdating: false,
                  isSelected: false, // Bỏ chọn sau khi cập nhật thành công
                }
              : i
          )
        );
      } catch (error) {
        console.error(`Error updating size ${item.sizeName}:`, error);
        failCount++;
        
        // Cập nhật trạng thái lỗi
        setRestockItems(items =>
          items.map(i =>
            i.id === item.id ? { ...i, isUpdating: false } : i
          )
        );
      }
    }

    setIsProcessing(false);

    // Hiển thị kết quả
    if (successCount > 0 && failCount === 0) {
      Alert.alert('Thành công', `Đã cập nhật tồn kho cho ${successCount} size`);
    } else if (successCount > 0 && failCount > 0) {
      Alert.alert(
        'Hoàn thành một phần',
        `Thành công: ${successCount} size\nThất bại: ${failCount} size`
      );
    } else {
      Alert.alert('Lỗi', 'Không thể cập nhật tồn kho cho bất kỳ size nào');
    }
  };

  const getTotalNewStock = () => {
    return restockItems
      .filter(item => item.isSelected)
      .reduce((total, item) => total + item.newStock, 0);
  };

  const renderRestockItem = ({ item }: { item: RestockItem }) => (
    <View style={[
      styles.itemContainer,
      item.isSelected && styles.itemContainerSelected
    ]}>
      <View style={styles.itemHeader}>
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => handleSelectItem(item.id)}
        >
          <View style={[
            styles.checkbox,
            item.isSelected && styles.checkboxSelected
          ]}>
            {item.isSelected && (
              <Ionicons name="checkmark" size={16} color={COLORS.TEXT} />
            )}
          </View>
          <Text style={styles.sizeText}>{item.sizeName}</Text>
        </TouchableOpacity>
        
        {item.isUpdating && (
          <ActivityIndicator size="small" color={COLORS.PRIMARY} />
        )}
      </View>

      <View style={styles.itemDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.labelText}>Tồn kho hiện tại:</Text>
          <Text style={styles.valueText}>{item.stockQuantity}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.labelText}>Số lượng thêm:</Text>
          <TextInput
            style={[
              styles.stockInput,
              !item.isSelected && styles.stockInputDisabled
            ]}
            value={item.newStock.toString()}
            onChangeText={(text) => handleUpdateStockAmount(item.id, text)}
            keyboardType="numeric"
            editable={item.isSelected && !item.isUpdating}
            selectTextOnFocus
          />
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.labelText}>Tồn kho sau cập nhật:</Text>
          <Text style={[styles.valueText, styles.newStockText]}>
            {item.stockQuantity + (item.isSelected ? item.newStock : 0)}
          </Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <>
        <Stack.Screen 
          options={{ 
            title: 'Restock Nhanh',
            headerBackTitle: 'Quay lại'
          }} 
        />
        <View style={[styles.container, styles.centerContainer]}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
          <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
        </View>
      </>
    );
  }

  return (
 <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color={COLORS.TEXT} />
            </TouchableOpacity>
          <View style={{marginLeft:30}}>
            <Text style={styles.title}>Restock Nhanh</Text>
            {product && (
              <Text style={styles.subtitle}>{product.name}</Text>
            )}
          </View>
        </View>

        <View style={styles.controlPanel}>
          <View style={styles.quickSetContainer}>
            <Text style={styles.quickSetLabel}>Đặt nhanh cho tất cả:</Text>
            <View style={styles.quickSetRow}>
              <TextInput
                style={styles.quickSetInput}
                value={defaultRestockAmount}
                onChangeText={setDefaultRestockAmount}
                keyboardType="numeric"
                placeholder="20"
                placeholderTextColor={COLORS.ITEM_TEXT}
              />
              <TouchableOpacity
                style={styles.quickSetButton}
                onPress={handleSetAllAmount}
              >
                <Text style={styles.quickSetButtonText}>Áp dụng</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.selectionContainer}>
            <TouchableOpacity
              style={styles.selectAllButton}
              onPress={handleSelectAll}
            >
              <Ionicons
                name={selectedCount === restockItems.length ? "checkbox" : "square-outline"}
                size={20}
                color={COLORS.PRIMARY}
              />
              <Text style={styles.selectAllText}>
                Chọn tất cả ({selectedCount}/{restockItems.length})
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          data={restockItems}
          keyExtractor={(item) => item.id}
          renderItem={renderRestockItem}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.PRIMARY}
            />
          }
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="cube-outline" size={64} color={COLORS.ITEM_TEXT} />
              <Text style={styles.emptyText}>
                Không có size nào đang hoạt động để restock
              </Text>
            </View>
          }
        />

        {restockItems.length > 0 && (
          <View style={styles.bottomPanel}>
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryText}>
                Đã chọn: {selectedCount} size
              </Text>
              <Text style={styles.summaryText}>
                Tổng số lượng thêm: {getTotalNewStock()}
              </Text>
            </View>
            
            <TouchableOpacity
              style={[
                styles.restockButton,
                (selectedCount === 0 || isProcessing) && styles.restockButtonDisabled
              ]}
              onPress={handleQuickRestock}
              disabled={selectedCount === 0 || isProcessing}
            >
              {isProcessing ? (
                <ActivityIndicator size="small" color={COLORS.TEXT} />
              ) : (
                <Ionicons name="add-circle" size={24} color={COLORS.TEXT} />
              )}
              <Text style={styles.restockButtonText}>
                {isProcessing ? 'Đang xử lý...' : `Restock ${selectedCount} Size`}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.ITEM_TEXT,
    marginTop: 12,
  },
  header: {
    marginTop: 30,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.ITEM_BORDER,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.ITEM_TEXT,
    marginTop: 4,
  },
  controlPanel: {
    backgroundColor: COLORS.ITEM_BACKGROUND,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.ITEM_BORDER,
  },
  quickSetContainer: {
    marginBottom: 16,
  },
  quickSetLabel: {
    fontSize: 16,
    color: COLORS.TEXT,
    marginBottom: 8,
    fontWeight: '600',
  },
  quickSetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quickSetInput: {
    backgroundColor: COLORS.INPUT_DROPDOWN,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: COLORS.TEXT,
    borderWidth: 1,
    borderColor: COLORS.ITEM_BORDER,
    width: 80,
    textAlign: 'center',
  },
  quickSetButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  quickSetButtonText: {
    color: COLORS.TEXT,
    fontSize: 16,
    fontWeight: '600',
  },
  selectionContainer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.ITEM_BORDER,
    paddingTop: 16,
  },
  selectAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  selectAllText: {
    fontSize: 16,
    color: COLORS.TEXT,
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  itemContainer: {
    backgroundColor: COLORS.ITEM_BACKGROUND,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.ITEM_BORDER,
  },
  itemContainerSelected: {
    borderColor: COLORS.PRIMARY,
    backgroundColor: COLORS.CONTENT_ACCORDION,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.ITEM_BORDER,
    backgroundColor: COLORS.INPUT_DROPDOWN,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },
  sizeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT,
  },
  itemDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelText: {
    fontSize: 16,
    color: COLORS.ITEM_TEXT,
  },
  valueText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT,
  },
  newStockText: {
    color: COLORS.SUCCESS,
  },
  stockInput: {
    backgroundColor: COLORS.INPUT_DROPDOWN,
    borderRadius: 6,
    padding: 8,
    fontSize: 16,
    color: COLORS.TEXT,
    borderWidth: 1,
    borderColor: COLORS.ITEM_BORDER,
    width: 80,
    textAlign: 'center',
  },
  stockInputDisabled: {
    backgroundColor: COLORS.DISABLED_BACKGROUND,
    color: COLORS.DISABLED_TEXT,
    borderColor: COLORS.DISABLED_BORDER,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.ITEM_TEXT,
    marginTop: 16,
    textAlign: 'center',
  },
  bottomPanel: {
    backgroundColor: COLORS.ITEM_BACKGROUND,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.ITEM_BORDER,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryText: {
    fontSize: 14,
    color: COLORS.ITEM_TEXT,
    fontWeight: '600',
  },
  restockButton: {
    backgroundColor: COLORS.SUCCESS,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  restockButtonDisabled: {
    backgroundColor: COLORS.DISABLED_BACKGROUND,
  },
  restockButtonText: {
    color: COLORS.TEXT,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default QuickRestock;