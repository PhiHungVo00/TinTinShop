import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from '@expo/vector-icons/MaterialIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';

import {
  callGetProductSizesByProductId,
  callCreateProductSize,
  callUpdateProductSize,
  callGetSizes,
  callGetProductById,
  callDeleteProductSize,
} from '@/config/api';
import { IProductSizeReq, IProductSizeRes } from '@/types/productSize';
import { IProductResponseDTO } from '@/types/product';
import { ISize } from '@/types/backend';
import { ProductSizeStatus } from '@/types/enums/ProductSizeStatus.enum';
import { COLORS } from '@/util/constant';
import { Entypo } from '@expo/vector-icons';
import RestockButton from '@/components/RestockButton';

const ProductSizeManagement: React.FC = () => {
  const router = useRouter();
  const { productId } = useLocalSearchParams<{ productId: string }>();

  const [productSizes, setProductSizes] = useState<IProductSizeRes[]>([]);
  const [product, setProduct] = useState<IProductResponseDTO | null>(null);
  const [availableSizes, setAvailableSizes] = useState<ISize[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<IProductSizeRes | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [selectedSizeId, setSelectedSizeId] = useState('');
  const [price, setPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [status, setStatus] = useState<ProductSizeStatus>(ProductSizeStatus.ACTIVE);

  useEffect(() => {
    if (productId) {
      loadInitialData();
    }
  }, [productId]);

  const loadInitialData = async () => {
    if (!productId) {
      Alert.alert('Lỗi', 'Không tìm thấy ID sản phẩm');
      return;
    }

    try {
      setLoading(true);
      await Promise.all([
        loadProductSizes(),
        loadProduct(),
        loadAvailableSizes(),
      ]);
    } catch (error) {
      console.error('Error loading initial data:', error);
      Alert.alert('Lỗi', 'Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const loadProductSizes = async () => {
    if (!productId) return;
    
    try {
      const response = await callGetProductSizesByProductId(productId);
      if (response.data) {
        setProductSizes(response.data || []);
      }
    } catch (error) {
      console.error('Error loading product sizes:', error);
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

  const loadAvailableSizes = async () => {
    try {
      const response = await callGetSizes();
      if (response.data) {
        setAvailableSizes(response.data || []);
      }
    } catch (error) {
      console.error('Error loading sizes:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProductSizes();
    setRefreshing(false);
  };

  const openModal = (item?: IProductSizeRes) => {
    if (item) {
      setEditingItem(item);
      setSelectedSizeId(item.sizeId);
      setPrice(item.price.toString());
      setStockQuantity(item.stockQuantity.toString());
      setStatus(item.status);
    } else {
      setEditingItem(null);
      setSelectedSizeId('');
      setPrice('');
      setStockQuantity('');
      setStatus(ProductSizeStatus.ACTIVE);
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingItem(null);
  };

  const handleSubmit = async () => {
    if (!selectedSizeId || !price || !stockQuantity) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (!productId) {
      Alert.alert('Lỗi', 'Không tìm thấy ID sản phẩm');
      return;
    }

    const productSizeReq: IProductSizeReq = {
      sizeId: selectedSizeId,
      price: parseFloat(price),
      stockQuantity: parseInt(stockQuantity),
      status: status,
    };

    try {
      setSubmitting(true);
      
      if (editingItem) {
        await callUpdateProductSize(editingItem.id, productSizeReq);
        Alert.alert('Thành công', 'Cập nhật variant thành công');
      } else {
        await callCreateProductSize(productId, productSizeReq);
        Alert.alert('Thành công', 'Thêm variant thành công');
      }
      
      closeModal();
      await loadProductSizes();
    } catch (error) {
      console.error('Error submitting:', error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi lưu dữ liệu');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (item: IProductSizeRes) => {
    Alert.alert(
      'Xác nhận xóa',
      `Bạn có chắc chắn muốn xóa variant ${item.sizeName}?`,
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Xóa', 
          style: 'destructive',
          onPress: () => deleteProductSize(item.id)
        },
      ]
    );
  };

  const deleteProductSize = async (id: string) => {
    try {
      const res = await callDeleteProductSize(id);
      if (res.statusCode === 200) {
        Alert.alert('Thành công', 'Xóa variant thành công');
        await loadProductSizes();
      }
    } catch (error) {
      console.error('Error deleting:', error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi xóa');
    }
  };

  const getStatusColor = (status: ProductSizeStatus) => {
    switch (status) {
      case ProductSizeStatus.ACTIVE:
        return '#10B981'; // Green
      case ProductSizeStatus.INACTIVE:
        return '#F59E0B'; // Amber
      case ProductSizeStatus.DELETED:
        return '#EF4444'; // Red
      default:
        return COLORS.ERROR;
    }
  };

  const getStatusIcon = (status: ProductSizeStatus) => {
    switch (status) {
      case ProductSizeStatus.ACTIVE:
        return 'check-circle';
      case ProductSizeStatus.INACTIVE:
        return 'pause-circle-filled';
      case ProductSizeStatus.DELETED:
        return 'cancel';
      default:
        return 'error';
    }
  };

  const getStatusText = (status: ProductSizeStatus) => {
    switch (status) {
      case ProductSizeStatus.ACTIVE:
        return 'Hoạt động';
      case ProductSizeStatus.INACTIVE:
        return 'Tạm dừng';
      case ProductSizeStatus.DELETED:
        return 'Đã xóa';
      default:
        return 'Không xác định';
    }
  };

  const renderStatusBadge = (status: ProductSizeStatus) => (
    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(status) }]}>
      <Icon name={getStatusIcon(status)} size={14} color="white" />
      <Text style={styles.statusBadgeText}>{getStatusText(status)}</Text>
    </View>
  );

  const renderProductSizeItem = ({ item }: { item: IProductSizeRes }) => (
    <View style={[
      styles.itemContainer,
      item.status === ProductSizeStatus.DELETED && styles.deletedItemContainer
    ]}>
      <View style={styles.itemHeader}>
        <View style={styles.itemTitleSection}>
          <Text style={[
            styles.sizeName,
            item.status === ProductSizeStatus.DELETED && styles.deletedText
          ]}>
            {item.sizeName}
          </Text>
          {renderStatusBadge(item.status)}
        </View>
        
        {item.status !== ProductSizeStatus.DELETED && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.editButton]}
              onPress={() => openModal(item)}
            >
              <Icon name="edit" size={18} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => handleDelete(item)}
            >
              <Icon name="delete" size={18} color="white" />
            </TouchableOpacity>
          </View>
        )}
        
        {/* Chỉ hiện nút chỉnh sửa cho variant đã bị xóa */}
        {item.status === ProductSizeStatus.DELETED && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.editButton]}
              onPress={() => openModal(item)}
            >
              <Icon name="edit" size={18} color="white" />
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      <View style={styles.itemDetails}>
        <View style={styles.detailGrid}>
          <View style={styles.detailItem}>
            <Icon name="attach-money" size={16} color={COLORS.ITEM_TEXT} />
            <Text style={styles.detailLabel}>Giá:</Text>
            <Text style={[
              styles.detailValue,
              item.status === ProductSizeStatus.DELETED && styles.deletedText
            ]}>
              {item.price.toLocaleString()} VNĐ
            </Text>
          </View>
          
          <View style={styles.detailItem}>
            <Icon name="inventory" size={16} color={COLORS.ITEM_TEXT} />
            <Text style={styles.detailLabel}>Kho:</Text>
            <Text style={[
              styles.detailValue,
              item.status === ProductSizeStatus.DELETED && styles.deletedText
            ]}>
              {item.stockQuantity}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  }

  if (!productId) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="error" size={64} color={COLORS.ERROR} />
        <Text style={styles.errorText}>Không tìm thấy ID sản phẩm</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButtonHeader}
          onPress={() => router.back()}
        >
          <Icon name="arrow-back" size={24} color={COLORS.TEXT} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Quản lý Size</Text>
          <Text style={styles.headerSubtitle}>{product?.name}</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => openModal()}
        >
          <Entypo name="add-to-list" size={24} color={COLORS.ITEM_TEXT} />
        </TouchableOpacity>
       
      </View>
   <View style={{justifyContent:'flex-start', width:100, marginLeft:20, marginTop:10, paddingVertical: 10}}>
   <RestockButton 
  productId={productId} 
  navigation={router}
/>
   </View>

      {/* Product Sizes List */}
      <FlatList
        data={productSizes}
        keyExtractor={(item) => item.id}
        renderItem={renderProductSizeItem}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.PRIMARY]}
            progressBackgroundColor={COLORS.ITEM_BACKGROUND}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="inventory" size={64} color={COLORS.ITEM_TEXT} />
            <Text style={styles.emptyText}>Chưa có variant nào</Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => openModal()}
            >
              <Icon name="add" size={20} color="white" style={styles.emptyButtonIcon} />
              <Text style={styles.emptyButtonText}>Thêm variant đầu tiên</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Modal for Add/Edit */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingItem ? 'Sửa Variant' : 'Thêm Variant'}
              </Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={closeModal}
              >
                <Icon name="close" size={24} color={COLORS.TEXT} />
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.modalContent} 
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Size Picker */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  <Icon name="straighten" size={16} color={COLORS.TEXT} /> Size *
                </Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={selectedSizeId}
                    onValueChange={setSelectedSizeId}
                    style={styles.picker}
                    dropdownIconColor={COLORS.TEXT}
                  >
                    <Picker.Item label="Chọn size" value="" />
                    {availableSizes.map((size) => (
                      <Picker.Item
                        key={size.id}
                        label={size.name}
                        value={size.id}
                      />
                    ))}
                  </Picker>
                </View>
              </View>

              {/* Price Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  <Icon name="attach-money" size={16} color={COLORS.TEXT} /> Giá *
                </Text>
                <TextInput
                  style={styles.textInput}
                  value={price}
                  onChangeText={setPrice}
                  placeholder="Nhập giá (VNĐ)"
                  placeholderTextColor={COLORS.ITEM_TEXT}
                  keyboardType="numeric"
                />
              </View>

              {/* Stock Quantity Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  <Icon name="inventory" size={16} color={COLORS.TEXT} /> Số lượng *
                </Text>
                <TextInput
                  style={styles.textInput}
                  value={stockQuantity}
                  onChangeText={setStockQuantity}
                  placeholder="Nhập số lượng"
                  placeholderTextColor={COLORS.ITEM_TEXT}
                  keyboardType="numeric"
                />
              </View>

              {/* Status Picker */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  <Icon name="info" size={16} color={COLORS.TEXT} /> Trạng thái
                </Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={status}
                    onValueChange={setStatus}
                    style={styles.picker}
                    dropdownIconColor={COLORS.TEXT}
                  >
                    <Picker.Item label="Hoạt động" value={ProductSizeStatus.ACTIVE} />
                    <Picker.Item label="Tạm dừng" value={ProductSizeStatus.INACTIVE} />
                    <Picker.Item label="Đã xóa" value={ProductSizeStatus.DELETED} />
                  </Picker>
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={closeModal}
              >
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={handleSubmit}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.submitButtonText}>
                    {editingItem ? 'Cập nhật' : 'Thêm'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND,
  },
  loadingText: {
    color: COLORS.TEXT,
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND,
    padding: 20,
  },
  errorText: {
    color: COLORS.ERROR,
    fontSize: 16,
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: COLORS.BACKGROUND,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.ITEM_BORDER,
    marginTop: 30,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButtonHeader: {
    padding: 8,
    borderRadius: 20,
  },
  headerContent: {
    flex: 1,
    marginLeft: 16,
  },
  headerTitle: {
    color: COLORS.TEXT,
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: COLORS.ITEM_TEXT,
    fontSize: 14,
    marginTop: 2,
  },
  addButton: {
    padding: 12,
    borderRadius: 25,
    elevation: 3,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
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
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  deletedItemContainer: {
    opacity: 0.7,
    borderColor: '#EF4444',
    borderStyle: 'dashed',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  itemTitleSection: {
    flex: 1,
    marginRight: 12,
  },
  sizeName: {
    color: COLORS.TEXT,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  deletedText: {
    textDecorationLine: 'line-through',
    color: COLORS.ITEM_TEXT,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  editButton: {
    backgroundColor: COLORS.PRIMARY,
  },
  deleteButton: {
    backgroundColor: COLORS.ERROR,
  },
  itemDetails: {
    marginTop: 8,
  },
  detailGrid: {
    gap: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  detailLabel: {
    color: COLORS.ITEM_TEXT,
    fontSize: 14,
    marginLeft: 8,
    marginRight: 8,
    minWidth: 50,
  },
  detailValue: {
    color: COLORS.TEXT,
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    color: COLORS.ITEM_TEXT,
    fontSize: 16,
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  emptyButton: {
    backgroundColor: COLORS.PRIMARY,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 3,
  },
  emptyButtonIcon: {
    marginRight: 8,
  },
  emptyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: COLORS.ITEM_BACKGROUND,
    borderRadius: 16,
    width: '90%',
    maxHeight: '80%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.ITEM_BORDER,
  },
  modalTitle: {
    color: COLORS.TEXT,
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    color: COLORS.TEXT,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    backgroundColor: COLORS.INPUT_DROPDOWN,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: COLORS.TEXT,
    fontSize: 16,
    borderWidth: 1,
    borderColor: COLORS.ITEM_BORDER,
  },
  pickerContainer: {
    backgroundColor: COLORS.INPUT_DROPDOWN,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.ITEM_BORDER,
  },
  picker: {
    color: COLORS.TEXT,
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.ITEM_BORDER,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  cancelButton: {
    backgroundColor: COLORS.DISABLED_BACKGROUND,
  },
  cancelButtonText: {
    color: COLORS.TEXT,
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: COLORS.PRIMARY,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProductSizeManagement;