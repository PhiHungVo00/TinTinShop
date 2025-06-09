// TODO: API Integration Notes
// 1. Cart API:
//    - GET /api/cart - Lấy thông tin giỏ hàng
//    - POST /api/cart/add - Thêm sản phẩm vào giỏ hàng
//    - PUT /api/cart/update - Cập nhật số lượng sản phẩm
//    - DELETE /api/cart/remove/{itemId} - Xóa sản phẩm khỏi giỏ hàng

// 2. Address API:
//    - GET /api/addresses - Lấy danh sách địa chỉ
//    - POST /api/addresses - Thêm địa chỉ mới
//    - PUT /api/addresses/{id} - Cập nhật địa chỉ
//    - DELETE /api/addresses/{id} - Xóa địa chỉ
//    - PUT /api/addresses/{id}/default - Đặt địa chỉ mặc định

// 3. Order API:
//    - POST /api/orders - Tạo đơn hàng mới
//    - GET /api/orders/{id} - Lấy thông tin đơn hàng
//    - GET /api/orders - Lấy danh sách đơn hàng

// 4. Payment API:
//    - POST /api/payments - Tạo thanh toán
//    - GET /api/payments/{id} - Lấy trạng thái thanh toán

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/util/constant';
import { AntDesign, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCart } from '@/context/CartContext';
import { useDiscount } from '@/context/DiscountContext';
import Toast from 'react-native-toast-message';
import { useAppContext } from '@/context/AppContext';
import { callGetUser, getAllAddressOfUser, createAddress } from '@/config/api';
import { IUser, IAddressUser, ICoupon } from '@/types/backend';
import { DiscountType } from '@/types/enums/DiscountType.enum';

const discountData: ICoupon[] = [
  {
    id: '1',
    code: 'TINTIN10',
    description: 'Giảm giá 10% cho đơn hàng',
    image: '',
    discountType: DiscountType.PERCENT,
    discountValue: 10,
    maxDiscount: 100000,
    minOrderValue: 0,
    quantity: 100,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    isActive: true
  },
  {
    id: '2',
    code: 'TINTIN20',
    description: 'Giảm giá 20% cho đơn hàng',
    image: '',
    discountType: DiscountType.PERCENT,
    discountValue: 20,
    maxDiscount: 200000,
    minOrderValue: 0,
    quantity: 50,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    isActive: true
  },
  {
    id: '3',
    code: 'TINTIN50K',
    description: 'Giảm giá 50.000 VNĐ cho đơn hàng',
    image: '',
    discountType: DiscountType.AMOUNT,
    discountValue: 50000,
    maxDiscount: 50000,
    minOrderValue: 0,
    quantity: 30,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    isActive: true
  }
];

const CartScreen = () => {
  const { items, removeItem, updateItemQuantity, getTotalPrice } = useCart();
  const { user } = useAppContext();
  const { discountData, appliedDiscount, setAppliedDiscount } = useDiscount();
  const [discountCode, setDiscountCode] = useState('');
  const [showDiscountList, setShowDiscountList] = useState(false);
  const [showAddressList, setShowAddressList] = useState(false);
  const [addresses, setAddresses] = useState<IAddressUser[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<IAddressUser | null>(null);
  const [deliveryAddress, setDeliveryAddress] = useState({
    name: '',
    phone: '',
    address: '',
    note: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.user.id) {
        try {
          const [userRes, addressesRes] = await Promise.all([
            callGetUser(user.user.id),
            getAllAddressOfUser(user.user.id)
          ]);
          
          if (userRes.data) {
            const userData: IUser = userRes.data;
            setDeliveryAddress(prev => ({
              ...prev,
              name: userData.name || '',
              phone: userData.phone || '',
            }));
          }

          if (addressesRes.data) {
            const addressList: IAddressUser[] = addressesRes.data;
            setAddresses(addressList);
            
            // Tìm địa chỉ mặc định
            const defaultAddress = addressList.find(addr => addr.defaultAddress);
            if (defaultAddress) {
              setSelectedAddress(defaultAddress);
              setDeliveryAddress(prev => ({
                ...prev,
                name: defaultAddress.receiverName,
                phone: defaultAddress.receiverPhone,
                address: `${defaultAddress.addressLine}, ${defaultAddress.ward}, ${defaultAddress.district}, ${defaultAddress.province}`,
              }));
    }
          }
        } catch (error) {
          console.error('Error fetching data:', error);
          Toast.show({
            type: 'error',
            text1: 'Không thể tải thông tin',
            position: 'bottom',
            visibilityTime: 2000,
          });
        }
      }
    };

    fetchUserData();
  }, [user?.user.id]);

  const calculateTotal = () => {
    const total = getTotalPrice();
    if (appliedDiscount) {
      const discountAmount = appliedDiscount.discountType === 'PERCENT' 
        ? (total * appliedDiscount.discountValue) / 100
        : appliedDiscount.discountValue;
      return {
        originalTotal: total,
        discountAmount: Math.min(discountAmount, appliedDiscount.maxDiscount),
        finalTotal: total - Math.min(discountAmount, appliedDiscount.maxDiscount)
      };
    }
    return {
      originalTotal: total,
      discountAmount: 0,
      finalTotal: total
    };
  };

  const handleApplyDiscount = () => {
    const foundDiscount = discountData.find(d => d.code === discountCode);
    if (foundDiscount) {
      setAppliedDiscount(foundDiscount);
      Toast.show({
        type: 'success',
        text1: 'Áp dụng mã giảm giá thành công',
        position: 'bottom',
        visibilityTime: 2000,
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Mã giảm giá không hợp lệ',
        position: 'bottom',
        visibilityTime: 2000,
      });
    }
  };

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null);
    setDiscountCode('');
  };

  const handlePayment = () => {
    if (!validateForm()) return;

    const { finalTotal } = calculateTotal();
    router.push({
      pathname: '/(user)/payment',
      params: { 
        total: finalTotal.toString(),
        discountCode: appliedDiscount?.code || '',
        discountAmount: appliedDiscount ? 
          (appliedDiscount.discountType === 'PERCENT' 
            ? (getTotalPrice() * appliedDiscount.discountValue / 100)
            : appliedDiscount.discountValue).toString() 
          : '0'
      }
    });
  };

  const validateForm = () => {
    const newErrors = {
      name: '',
      phone: '',
      address: ''
    };
    let isValid = true;

    if (!deliveryAddress.name.trim()) {
      newErrors.name = 'Vui lòng nhập họ tên';
      isValid = false;
    }

    if (!deliveryAddress.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
      isValid = false;
    } else if (!/^[0-9]{10}$/.test(deliveryAddress.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
      isValid = false;
    }

    if (!deliveryAddress.address.trim()) {
      newErrors.address = 'Vui lòng nhập địa chỉ';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSaveAddress = async () => {
    if (!validateForm()) return;

    try {
      const newAddress: IAddressUser = {
        addressLine: deliveryAddress.address,
        ward: '', // Cần thêm logic để lấy thông tin này
        district: '', // Cần thêm logic để lấy thông tin này
        province: '', // Cần thêm logic để lấy thông tin này
        receiverName: deliveryAddress.name,
        receiverPhone: deliveryAddress.phone,
        description: deliveryAddress.note,
        defaultAddress: addresses.length === 0, // Đặt làm mặc định nếu là địa chỉ đầu tiên
        user: {
          id: user?.user.id || ''
        }
      };

      const res = await createAddress(newAddress);
      if (res.data) {
        Toast.show({
          type: 'success',
          text1: 'Lưu địa chỉ thành công',
          position: 'bottom',
          visibilityTime: 2000,
        });
        const newAddressList = [...addresses, res.data];
        setAddresses(newAddressList);
        setSelectedAddress(res.data);
      }
    } catch (error) {
      console.error('Error saving address:', error);
      Toast.show({
        type: 'error',
        text1: 'Không thể lưu địa chỉ',
        position: 'bottom',
        visibilityTime: 2000,
      });
    }
  };

  const renderDiscountList = () => {
    return (
      <Modal
        visible={showDiscountList}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDiscountList(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Danh sách mã giảm giá</Text>
              <TouchableOpacity onPress={() => setShowDiscountList(false)}>
                <Ionicons name="close" size={24} color={COLORS.TEXT} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={discountData}
              keyExtractor={(item) => item.id || ''}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.discountListItem}
                  onPress={() => {
                    setDiscountCode(item.code);
                    setShowDiscountList(false);
                  }}
                >
                  <View style={styles.discountListInfo}>
                    <Text style={styles.discountListCode}>{item.code}</Text>
                    <Text style={styles.discountListDetails}>{item.description}</Text>
                    <View style={styles.discountListFooter}>
                      <View style={styles.statusContainer}>
                        <View style={[styles.statusDot, { backgroundColor: item.isActive ? '#4CAF50' : '#FF5252' }]} />
                        <Text style={styles.statusText}>{item.isActive ? 'Còn hạn' : 'Hết hạn'}</Text>
                      </View>
                      <Text style={styles.expiryDate}>HSD: {item.endDate}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    );
  };

  const renderAddressList = () => {
    return (
      <Modal
        visible={showAddressList}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddressList(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chọn địa chỉ giao hàng</Text>
              <TouchableOpacity onPress={() => setShowAddressList(false)}>
                <Ionicons name="close" size={24} color={COLORS.TEXT} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={addresses}
              keyExtractor={(item) => item.id || ''}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.addressItem,
                    selectedAddress?.id === item.id && styles.selectedAddressItem
                  ]}
                  onPress={() => {
                    setSelectedAddress(item);
                    setDeliveryAddress({
                      name: item.receiverName,
                      phone: item.receiverPhone,
                      address: `${item.addressLine}, ${item.ward}, ${item.district}, ${item.province}`,
                      note: item.description
                    });
                    setShowAddressList(false);
                  }}
                >
                  <View style={styles.addressItemContent}>
                    <Text style={styles.addressItemName}>{item.receiverName}</Text>
                    <Text style={styles.addressItemPhone}>{item.receiverPhone}</Text>
                    <Text style={styles.addressItemAddress}>
                      {`${item.addressLine}, ${item.ward}, ${item.district}, ${item.province}`}
                    </Text>
                    {item.defaultAddress && (
                      <View style={styles.defaultAddressBadge}>
                        <Text style={styles.defaultAddressText}>Mặc định</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View style={styles.emptyAddressList}>
                  <Text style={styles.emptyAddressText}>Chưa có địa chỉ nào</Text>
                </View>
              }
            />
          </View>
        </View>
      </Modal>
    );
  };

  const renderDeliverySection = () => {
    return (
      <View style={styles.deliverySection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Địa chỉ giao hàng</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => setShowAddressList(true)}
            >
              <MaterialIcons name="list" size={20} color={COLORS.PRIMARY} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => router.push('/address')}
            >
              <MaterialIcons name="edit" size={20} color={COLORS.PRIMARY} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.deliveryForm}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Họ và tên</Text>
            <TextInput
              style={[styles.deliveryInput, errors.name ? styles.inputError : null]}
              value={deliveryAddress.name}
              onChangeText={(text) => {
                setDeliveryAddress({...deliveryAddress, name: text});
                setErrors(prev => ({...prev, name: ''}));
              }}
            />
            {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Số điện thoại</Text>
            <TextInput
              style={[styles.deliveryInput, errors.phone ? styles.inputError : null]}
              value={deliveryAddress.phone}
              onChangeText={(text) => {
                setDeliveryAddress({...deliveryAddress, phone: text});
                setErrors(prev => ({...prev, phone: ''}));
              }}
              keyboardType="phone-pad"
            />
            {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Địa chỉ</Text>
            <TextInput
              style={[styles.deliveryInput, styles.addressInput, errors.address ? styles.inputError : null]}
              value={deliveryAddress.address}
              onChangeText={(text) => {
                setDeliveryAddress({...deliveryAddress, address: text});
                setErrors(prev => ({...prev, address: ''}));
              }}
              multiline
              numberOfLines={3}
            />
            {errors.address ? <Text style={styles.errorText}>{errors.address}</Text> : null}
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Ghi chú</Text>
            <TextInput
              style={[styles.deliveryInput, styles.noteInput]}
              value={deliveryAddress.note}
              onChangeText={(text) => setDeliveryAddress({...deliveryAddress, note: text})}
              multiline
              numberOfLines={2}
            />
          </View>
          <TouchableOpacity 
            style={styles.saveAddressButton}
            onPress={handleSaveAddress}
          >
            <Text style={styles.saveAddressButtonText}>Lưu địa chỉ mới</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={{ width: 24 }} />
        <Text style={styles.headerTitle}>Xác nhận đơn hàng</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {items.length > 0 ? (
          <>
          <View style={styles.itemsList}>
            {items.map((item) => (
              <View key={item.id} style={styles.cartItem}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemDetails}>
                    Size: {item.size} | Đá: {item.ice} | Đường: {item.sugar}
                  </Text>
                  {item.toppings.length > 0 && (
                    <Text style={styles.itemToppings}>
                      Topping: {item.toppings.join(', ')}
                    </Text>
                  )}
                  <Text style={styles.itemPrice}>
                    {parseFloat(item.price.replace(/[^\d]/g, '')) * item.quantity + (item.toppingPrice * item.quantity)} VNĐ
                  </Text>
                </View>

                <View style={styles.itemActions}>
                  <View style={styles.quantityControl}>
                    <TouchableOpacity
                      onPress={() => updateItemQuantity(item.id, Math.max(1, item.quantity - 1))}
                      style={styles.quantityButton}
                    >
                      <AntDesign name="minus" size={16} color={COLORS.TEXT} />
                    </TouchableOpacity>
                    <Text style={styles.quantity}>{item.quantity}</Text>
                    <TouchableOpacity
                      onPress={() => updateItemQuantity(item.id, item.quantity + 1)}
                      style={styles.quantityButton}
                    >
                      <AntDesign name="plus" size={16} color={COLORS.TEXT} />
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    onPress={() => removeItem(item.id)}
                    style={styles.removeButton}
                  >
                    <AntDesign name="delete" size={20} color={COLORS.ERROR} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

            {renderDeliverySection()}

            <View style={styles.discountSection}>
              <Text style={styles.sectionTitle}>Mã giảm giá</Text>
              <View style={styles.discountInputContainer}>
                <TextInput
                  style={styles.input}
                  value={discountCode}
                  onChangeText={setDiscountCode}
                />
                <TouchableOpacity
                  style={styles.applyButton}
                  onPress={handleApplyDiscount}
                >
                  <Text style={styles.applyButtonText}>Áp dụng</Text>
                </TouchableOpacity>
              </View>
              {appliedDiscount && (
                <View style={styles.appliedDiscount}>
                  <View style={styles.discountInfo}>
                    <Text style={styles.discountCode}>{appliedDiscount.code}</Text>
                    <Text style={styles.discountValue}>
                      {appliedDiscount.discountType === 'PERCENT' 
                        ? `-${appliedDiscount.discountValue}%` 
                        : `-${appliedDiscount.discountValue.toLocaleString('vi-VN')} VNĐ`}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={handleRemoveDiscount}>
                    <AntDesign name="close" size={20} color={COLORS.TEXT} />
                  </TouchableOpacity>
                </View>
              )}
              <TouchableOpacity 
                style={styles.viewDiscountButton}
                onPress={() => setShowDiscountList(true)}
              >
                <Text style={styles.viewDiscountText}>Xem các mã giảm giá</Text>
                <AntDesign name="right" size={16} color={COLORS.PRIMARY} />
              </TouchableOpacity>
            </View>

            <View style={styles.totalSection}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Tổng tiền hàng:</Text>
                <Text style={styles.totalValue}>
                  {calculateTotal().originalTotal.toLocaleString('vi-VN')} VNĐ
                </Text>
              </View>
              {appliedDiscount && (
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Giảm giá:</Text>
                  <Text style={[styles.totalValue, styles.discountValue]}>
                    -{calculateTotal().discountAmount.toLocaleString('vi-VN')} VNĐ
                  </Text>
                </View>
              )}
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Thành tiền:</Text>
                <Text style={[styles.totalValue, styles.finalTotal]}>
                  {calculateTotal().finalTotal.toLocaleString('vi-VN')} VNĐ
                </Text>
              </View>
            </View>
          </>
        ) : (
          <View style={styles.emptyCart}>
            <AntDesign name="shoppingcart" size={64} color={COLORS.PRIMARY} />
            <Text style={styles.emptyCartText}>Giỏ hàng trống</Text>
          </View>
        )}
      </ScrollView>

      {items.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Tổng cộng:</Text>
            <Text style={styles.totalAmount}>
              {calculateTotal().finalTotal.toLocaleString('vi-VN')} VNĐ
            </Text>
          </View>
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={handlePayment}
          >
            <Text style={styles.checkoutButtonText}>Thanh toán</Text>
          </TouchableOpacity>
        </View>
      )}

      {renderDiscountList()}
      {renderAddressList()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.ITEM_BORDER,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT,
  },
  content: {
    flex: 1,
  },
  itemsList: {
    padding: 16,
  },
  cartItem: {
    backgroundColor: COLORS.ITEM_BACKGROUND,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  itemInfo: {
    marginBottom: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT,
    marginBottom: 4,
  },
  itemDetails: {
    fontSize: 14,
    color: COLORS.ITEM_TEXT,
    marginBottom: 4,
  },
  itemToppings: {
    fontSize: 14,
    color: COLORS.ITEM_TEXT,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  itemActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: COLORS.ITEM_BACKGROUND,
    borderRadius: 8,
    padding: 8,
  },
  quantity: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT,
    marginHorizontal: 12,
  },
  removeButton: {
    padding: 8,
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyCartText: {
    fontSize: 16,
    color: COLORS.ITEM_TEXT,
    marginTop: 16,
  },
  footer: {
    backgroundColor: COLORS.ITEM_BACKGROUND,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.ITEM_BORDER,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalText: {
    fontSize: 16,
    color: COLORS.TEXT,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  checkoutButton: {
    backgroundColor: 'orange',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  discountSection: {
    padding: 16,
    backgroundColor: COLORS.ITEM_BACKGROUND,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT,
    marginBottom: 12,
  },
  discountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    color: COLORS.TEXT,
  },
  applyButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  applyButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  appliedDiscount: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND,
    padding: 12,
    borderRadius: 8,
  },
  discountInfo: {
    flex: 1,
  },
  discountCode: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginBottom: 4,
  },
  discountValue: {
    color: COLORS.SUCCESS,
  },
  viewDiscountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingVertical: 8,
  },
  viewDiscountText: {
    color: COLORS.PRIMARY,
    fontSize: 14,
    marginRight: 4,
  },
  totalSection: {
    padding: 16,
    backgroundColor: COLORS.ITEM_BACKGROUND,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 16,
    color: COLORS.TEXT,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  finalTotal: {
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.BACKGROUND,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT,
  },
  discountListContent: {
    padding: 16,
  },
  discountListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.ITEM_BACKGROUND,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  discountListInfo: {
    flex: 1,
    marginRight: 12,
  },
  discountListCode: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginBottom: 4,
  },
  discountListDetails: {
    fontSize: 14,
    color: COLORS.ITEM_TEXT,
    marginBottom: 8,
  },
  discountListFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
  statusText: {
    fontSize: 14,
    color: COLORS.ITEM_TEXT,
  },
  expiryDate: {
    fontSize: 14,
    color: COLORS.ITEM_TEXT,
  },
  deliverySection: {
    padding: 16,
    backgroundColor: COLORS.ITEM_BACKGROUND,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  deliveryForm: {
    marginTop: 12,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: COLORS.TEXT,
    marginBottom: 8,
    fontWeight: '500',
  },
  deliveryInput: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: COLORS.TEXT,
    borderWidth: 1,
    borderColor: COLORS.ITEM_BORDER,
  },
  addressInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  noteInput: {
    height: 60,
    textAlignVertical: 'top',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.PRIMARY + '10',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
  saveAddressButton: {
    backgroundColor: COLORS.PRIMARY,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  saveAddressButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  addressItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.ITEM_BORDER,
  },
  selectedAddressItem: {
    backgroundColor: COLORS.PRIMARY + '10',
  },
  addressItemContent: {
    gap: 4,
  },
  addressItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT,
  },
  addressItemPhone: {
    fontSize: 14,
    color: COLORS.TEXT,
  },
  addressItemAddress: {
    fontSize: 14,
    color: COLORS.TEXT,
    marginTop: 4,
  },
  defaultAddressBadge: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  defaultAddressText: {
    color: 'white',
    fontSize: 12,
  },
  emptyAddressList: {
    padding: 16,
    alignItems: 'center',
  },
  emptyAddressText: {
    color: COLORS.TEXT,
    fontSize: 14,
  },
});

export default CartScreen; 