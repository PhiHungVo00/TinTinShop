import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { 
  callGetOrderById, 
  callGetProductById, 
  callGetToppingById, 
  callUpdateOrder,
  callGetProductSizeById,
  callGetCouponById,
  callGetUser,
} from '@/config/api';
import { OrderStatus } from '@/types/enums/OrderStatus.enum';
import { IOrderRes, IOrderUpdate} from '@/types/order';
import { IProductResponseDTO } from '@/types/product';
import { IProductSizeRes } from '@/types/productSize';
import { COLORS } from '@/util/constant';
import { IOrderDetailRes } from '@/types/orderDetail';
import { ICoupon, ITopping } from '@/types/backend';
import { IUser } from '@/types/backend';

const { width } = Dimensions.get('window');
const IPV4 = process.env.EXPO_PUBLIC_IPV4;
const PORT = process.env.EXPO_PUBLIC_PORT;
const image_url_base = `http://${IPV4}:${PORT}/storage`;

interface EnrichedOrderDetail extends IOrderDetailRes {
  product?: IProductResponseDTO;
  productSize?: IProductSizeRes;
  toppings?: ITopping[];
}

const OrderDetailScreen: React.FC = () => {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const router = useRouter();
  
  const [order, setOrder] = useState<IOrderRes | null>(null);
  const [enrichedOrderDetails, setEnrichedOrderDetails] = useState<EnrichedOrderDetail[]>([]);
  const [couponData, setCouponData] = useState<ICoupon | null>(null);
  const [userData, setUserData] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [addressCollapsed, setAddressCollapsed] = useState(false);
  const [userCollapsed, setUserCollapsed] = useState(false);
  const [couponCollapsed, setCouponCollapsed] = useState(false);
  const [expandedProducts, setExpandedProducts] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch order details
      const orderResponse = await callGetOrderById(orderId);
      if (!orderResponse.data) {
        throw new Error('Đơn hàng không tồn tại');
      }
      
      const orderData = orderResponse.data;
      setOrder(orderData);

      // Fetch user data
      if (orderData.userId) {
        try {
          const userResponse = await callGetUser(orderData.userId);
          if (userResponse.data) {
            setUserData(userResponse.data);
          }
        } catch (err) {
          console.error('Lỗi khi tải thông tin khách hàng:', err);
        }
      }

      // Check if orderDetails exists and is an array
      if (!orderData.orderDetails || !Array.isArray(orderData.orderDetails)) {
        setEnrichedOrderDetails([]);
        return;
      }

      // Fetch enriched order details
      const enrichedDetails = await Promise.all(
        orderData.orderDetails.map(async (detail) => {
          try {
            let product: IProductResponseDTO | undefined;
            let productSize: IProductSizeRes | undefined;
            let toppings: ITopping[] = [];

            // Fetch product size details
            if (detail.productSizeId) {
              try {
                const productSizeResponse = await callGetProductSizeById(detail.productSizeId);
                productSize = productSizeResponse.data;
                
                // Fetch product details if productSize is found
                if (productSize?.productId) {
                  const productResponse = await callGetProductById(productSize.productId);
                  product = productResponse.data;
                }
              } catch (err) {
                console.error('Lỗi khi tải kích thước hoặc sản phẩm:', err);
              }
            }

            // Fetch toppings if they exist
            if (detail.toppingIds && Array.isArray(detail.toppingIds) && detail.toppingIds.length > 0) {
              try {
                const toppingPromises = detail.toppingIds.map(async (toppingId: string) => {
                  try {
                    const toppingResponse = await callGetToppingById(toppingId);
                    return toppingResponse.data;
                  } catch (err) {
                    console.error(`Lỗi khi tải topping ${toppingId}:`, err);
                    return null;
                  }
                });
                
                const toppingResults = await Promise.all(toppingPromises);
                toppings = toppingResults.filter((t: ITopping | null) => t !== null);
              } catch (err) {
                console.error('Lỗi khi tải danh sách topping:', err);
              }
            }

            return {
              ...detail,
              product,
              productSize,
              toppings,
            };
          } catch (err) {
            console.error('Lỗi khi tải chi tiết đơn hàng:', err);
            return { ...detail };
          }
        })
      );

      setEnrichedOrderDetails(enrichedDetails);

      // Fetch coupon data if available
      if (orderData?.couponId) {
        const couponResponse = await callGetCouponById(orderData.couponId);
        if(couponResponse.data){
          setCouponData(couponResponse.data);
        }
      }

    } catch (err) {
      console.error('Lỗi khi tải chi tiết đơn hàng:', err);
      setError('Không thể tải chi tiết đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async () => {
    if (!order) return;

    try {
      setUpdating(true);
      let newStatus: string;
      
      if (order.status === OrderStatus.PENDING) {
        newStatus = OrderStatus.SHIPPING;
      } else if (order.status === OrderStatus.SHIPPING) {
        newStatus = OrderStatus.COMPLETED;
      } else {
        return;
      }

      const updateData: IOrderUpdate = {
        id: order.id,
        userId: order.userId,
        couponId: order.couponId,
        addressId: order.addressUser?.id || '',
        note: order.note,
        status: newStatus as OrderStatus,
        orderDetails: order.orderDetails?.map(detail => ({
          productSizeId: detail.productSizeId,
          quantity: detail.quantity,
          toppingIds: detail.toppingIds?.map((id: string) => id.toString()) || [],
        })) || [],
      };

      await callUpdateOrder(updateData);
      
      // Update local state
      setOrder(prev => prev ? { ...prev, status: newStatus as any } : null);
      
      Alert.alert('Thành công', 'Cập nhật trạng thái đơn hàng thành công');
    } catch (err) {
      console.error('Lỗi khi cập nhật đơn hàng:', err);
      Alert.alert('Lỗi', 'Không thể cập nhật trạng thái đơn hàng');
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order) return;

    Alert.alert(
      'Hủy đơn hàng',
      'Bạn có chắc chắn muốn hủy đơn hàng này không?',
      [
        { text: 'Không', style: 'cancel' },
        {
          text: 'Có',
          style: 'destructive',
          onPress: async () => {
            try {
              setUpdating(true);
              const updateData: IOrderUpdate = {
                id: order.id,
                userId: order.userId,
                couponId: order.couponId,
                addressId: order.addressUser?.id || '',
                note: order.note,
                status: OrderStatus.CANCELLED,
                orderDetails: order.orderDetails?.map(detail => ({
                  productSizeId: detail.productSizeId,
                  quantity: detail.quantity,
                  toppingIds: detail.toppingIds?.map((id: string) => id.toString()) || [],
                })) || [],
              };

              await callUpdateOrder(updateData);
              setOrder(prev => prev ? { ...prev, status: OrderStatus.CANCELLED } : null);
              Alert.alert('Thành công', 'Hủy đơn hàng thành công');
            } catch (err) {
              console.error('Lỗi khi hủy đơn hàng:', err);
              Alert.alert('Lỗi', 'Không thể hủy đơn hàng');
            } finally {
              setUpdating(false);
            }
          },
        },
      ]
    );
  };

  const toggleProductExpansion = (detailId: string) => {
    const newExpanded = new Set(expandedProducts);
    if (newExpanded.has(detailId)) {
      newExpanded.delete(detailId);
    } else {
      newExpanded.add(detailId);
    }
    setExpandedProducts(newExpanded);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('vi-VN');
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING: return COLORS.WARNING;
      case OrderStatus.SHIPPING: return COLORS.PRIMARY;
      case OrderStatus.COMPLETED: return COLORS.SUCCESS;
      case OrderStatus.CANCELLED: return COLORS.ERROR;
      default: return COLORS.ITEM_TEXT;
    }
  };

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING: return 'Chờ xử lý';
      case OrderStatus.SHIPPING: return 'Đang giao hàng';
      case OrderStatus.COMPLETED: return 'Hoàn thành';
      case OrderStatus.CANCELLED: return 'Đã hủy';
      default: return status;
    }
  };

  const getPrimaryButtonText = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING: return 'Xác nhận đơn hàng';
      case OrderStatus.SHIPPING: return 'Đánh dấu hoàn thành';
      default: return '';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        <Text style={styles.loadingText}>Đang tải chi tiết đơn hàng...</Text>
      </View>
    );
  }

  if (error || !order) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={COLORS.ERROR} />
        <Text style={styles.errorText}>{error || 'Không tìm thấy đơn hàng'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchOrderDetails}>
          <Text style={styles.retryButtonText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.TEXT} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết đơn hàng</Text>
        <View style={styles.headerRight}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
            <Text style={styles.statusText}>{getStatusText(order.status)}</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Order ID */}
        <View style={styles.card}>
          <Text style={styles.orderIdText}>Đơn hàng #{order.id}</Text>
          <Text style={styles.orderDateText}>
            Đặt vào {order.createdAt ? formatDate(order.createdAt) : 'Không có thông tin'}
          </Text>
        </View>

        {/* Customer Information Section */}
        {userData && (
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => setUserCollapsed(!userCollapsed)}
            >
              <View style={styles.sectionTitleContainer}>
                <Ionicons name="person-outline" size={20} color={COLORS.PRIMARY} />
                <Text style={styles.sectionTitle}>Thông tin khách hàng</Text>
              </View>
              <Ionicons
                name={userCollapsed ? "chevron-down" : "chevron-up"}
                size={20}
                color={COLORS.ITEM_TEXT}
              />
            </TouchableOpacity>
            
            <View style={styles.userPreview}>
              <Image
                source={{ 
                  uri: userData.avatar 
                    ? `${image_url_base}/avatar/${userData.avatar}` 
                    : 'https://via.placeholder.com/40'
                }}
                style={styles.userAvatarSmall}
              />
              <View style={styles.userPreviewInfo}>
                <Text style={styles.userNamePreview}>{userData.name}</Text>
                <Text style={styles.userEmailPreview}>{userData.email}</Text>
              </View>
            </View>

            {!userCollapsed && (
              <View style={styles.userContent}>
                <View style={styles.userInfoRow}>
                  <Text style={styles.userInfoLabel}>Điện thoại:</Text>
                  <Text style={styles.userInfoValue}>{userData.phone || 'Không có thông tin'}</Text>
                </View>
                {userData.age && (
                  <View style={styles.userInfoRow}>
                    <Text style={styles.userInfoLabel}>Tuổi:</Text>
                    <Text style={styles.userInfoValue}>{userData.age}</Text>
                  </View>
                )}
                {userData.gender && (
                  <View style={styles.userInfoRow}>
                    <Text style={styles.userInfoLabel}>Giới tính:</Text>
                    <Text style={styles.userInfoValue}>{userData.gender}</Text>
                  </View>
                )}
                {userData.birthdate && (
                  <View style={styles.userInfoRow}>
                    <Text style={styles.userInfoLabel}>Ngày sinh:</Text>
                    <Text style={styles.userInfoValue}>{formatDate(userData.birthdate)}</Text>
                  </View>
                )}
                {userData.role && (
                  <View style={styles.userInfoRow}>
                    <Text style={styles.userInfoLabel}>Vai trò:</Text>
                    <View style={styles.roleBadge}>
                      <Text style={styles.roleText}>{userData.role.name}</Text>
                    </View>
                  </View>
                )}
              </View>
            )}
          </View>
        )}

        {/* Address Section */}
        {order.addressUser && (
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => setAddressCollapsed(!addressCollapsed)}
            >
              <View style={styles.sectionTitleContainer}>
                <Ionicons name="location-outline" size={20} color={COLORS.PRIMARY} />
                <Text style={styles.sectionTitle}>Địa chỉ giao hàng</Text>
              </View>
              <Ionicons
                name={addressCollapsed ? "chevron-down" : "chevron-up"}
                size={20}
                color={COLORS.ITEM_TEXT}
              />
            </TouchableOpacity>
            
            {!addressCollapsed && (
              <View style={styles.addressContent}>
                <Text style={styles.receiverName}>{order.addressUser.receiverName || 'Không có thông tin'}</Text>
                <Text style={styles.receiverPhone}>{order.addressUser.receiverPhone || 'Không có thông tin'}</Text>
                <Text style={styles.addressText}>
                  {[
                    order.addressUser.addressLine,
                    order.addressUser.ward,
                    order.addressUser.district,
                    order.addressUser.province
                  ].filter(Boolean).join(', ')}
                </Text>
                {order.addressUser.description && (
                  <Text style={styles.addressDescription}>{order.addressUser.description}</Text>
                )}
              </View>
            )}
          </View>
        )}

        {/* Note Section */}
        {order.note && (
          <View style={styles.card}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons name="document-text-outline" size={20} color={COLORS.PRIMARY} />
              <Text style={styles.sectionTitle}>Ghi chú đơn hàng</Text>
            </View>
            <Text style={styles.noteText}>{order.note}</Text>
          </View>
        )}

        {/* Product List */}
        <View style={styles.card}>
          <View style={styles.sectionTitleContainer}>
            <Ionicons name="basket-outline" size={20} color={COLORS.PRIMARY} />
            <Text style={styles.sectionTitle}>Sản phẩm đã đặt</Text>
          </View>
          
          {enrichedOrderDetails.length > 0 ? (
            enrichedOrderDetails.map((detail, index) => {
              const isExpanded = expandedProducts.has(detail.id || index.toString());
              return (
                <View key={detail.id || index} style={[styles.productItem, index === enrichedOrderDetails.length - 1 && styles.lastProductItem]}>
                  <Image
                    source={{ uri: `${image_url_base}/product/${detail.product?.image}` || 'https://via.placeholder.com/60' }}
                    style={styles.productImage}
                  />
                  <View style={styles.productInfo}>
                    <View style={styles.productHeader}>
                      <View style={styles.productBasicInfo}>
                        <Text style={styles.productName}>{detail.product?.name || 'Sản phẩm không xác định'}</Text>
                        <Text style={styles.productSize}>Kích thước: {detail.productSize?.sizeName || 'Không có thông tin'}</Text>
                        <Text style={styles.productQuantity}>Số lượng: {detail.quantity || 0}</Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => toggleProductExpansion(detail.id || index.toString())}
                        style={styles.expandButton}
                      >
                        <Ionicons
                          name={isExpanded ? "chevron-up" : "chevron-down"}
                          size={20}
                          color={COLORS.ITEM_TEXT}
                        />
                      </TouchableOpacity>
                    </View>
                    
                    {isExpanded && (
                      <View style={styles.expandedContent}>
                        <View style={styles.priceBreakdown}>
                          <View style={styles.priceRow}>
                            <Text style={styles.priceLabel}>Giá cơ bản ({detail.productSize?.sizeName}):</Text>
                            <Text style={styles.priceValue}>₫{(detail.productSize?.price || 0).toLocaleString()}</Text>
                          </View>
                          
                          {detail.toppings && detail.toppings.length > 0 && (
                            <View style={styles.toppingsSection}>
                              <Text style={styles.toppingsTitle}>Topping:</Text>
                              {detail.toppings.map((topping, toppingIndex) => (
                                <View key={toppingIndex} style={styles.toppingItemExpanded}>
                                  <Image
                                    source={{ uri: `${image_url_base}/topping/${topping.image}` || 'https://via.placeholder.com/20' }}
                                    style={styles.toppingImage}
                                  />
                                  <Text style={styles.toppingName}>{topping.name || 'Topping không xác định'}</Text>
                                  <Text style={styles.toppingPrice}>₫{(topping.price || 0).toLocaleString()}</Text>
                                </View>
                              ))}
                            </View>
                          )}
                          
                          <View style={[styles.priceRow, styles.totalItemRow]}>
                            <Text style={styles.totalItemLabel}>Tổng cộng sản phẩm:</Text>
                            <Text style={styles.totalItemPrice}>₫{(detail.price || 0).toLocaleString()}</Text>
                          </View>
                        </View>
                      </View>
                    )}
                    
                    {!isExpanded && (
                      <Text style={styles.productPrice}>₫{(detail.price || 0).toLocaleString()}</Text>
                    )}
                  </View>
                </View>
              );
            })
          ) : (
            <Text style={styles.noItemsText}>Không tìm thấy sản phẩm</Text>
          )}
        </View>

        {/* Enhanced Coupon Section */}
        {order.couponId && couponData && (
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => setCouponCollapsed(!couponCollapsed)}
            >
              <View style={styles.sectionTitleContainer}>
                <Ionicons name="pricetag-outline" size={20} color={COLORS.SUCCESS} />
                <Text style={styles.sectionTitle}>Mã giảm giá đã áp dụng</Text>
              </View>
              <Ionicons
                name={couponCollapsed ? "chevron-down" : "chevron-up"}
                size={20}
                color={COLORS.ITEM_TEXT}
              />
            </TouchableOpacity>
            
            <View style={styles.couponPreview}>
              <Image
                source={{ 
                  uri: couponData.image 
                    ? `${image_url_base}/coupon/${couponData.image}` 
                    : 'https://via.placeholder.com/40'
                }}
                style={styles.couponImageSmall}
              />
              <View style={styles.couponPreviewInfo}>
                <Text style={styles.couponCodePreview}>{couponData.code}</Text>
                <Text style={styles.discountAmountPreview}>
                  -₫{((order.totalPrice || 0) - (order.finalPrice || 0)).toLocaleString()}
                </Text>
              </View>
            </View>

            {!couponCollapsed && (
              <View style={styles.couponContent}>
                <Text style={styles.couponDescription}>{couponData.description}</Text>
                
                <View style={styles.couponDetailsGrid}>
                  <View style={styles.couponDetailItem}>
                    <Text style={styles.couponDetailLabel}>Loại giảm giá:</Text>
                    <Text style={styles.couponDetailValue}>
                      {couponData.discountType === 'PERCENTAGE' ? 'Phần trăm' : 'Số tiền cố định'}
                    </Text>
                  </View>
                  
                  <View style={styles.couponDetailItem}>
                    <Text style={styles.couponDetailLabel}>Giá trị giảm:</Text>
                    <Text style={styles.couponDetailValue}>
                      {couponData.discountType === 'PERCENTAGE' 
                        ? `${couponData.discountValue}%` 
                        : `₫${couponData.discountValue.toLocaleString()}`}
                    </Text>
                  </View>
                  
                  <View style={styles.couponDetailItem}>
                    <Text style={styles.couponDetailLabel}>Đơn tối thiểu:</Text>
                    <Text style={styles.couponDetailValue}>₫{couponData.minOrderValue.toLocaleString()}</Text>
                  </View>
                  
                  <View style={styles.couponDetailItem}>
                    <Text style={styles.couponDetailLabel}>Giảm tối đa:</Text>
                    <Text style={styles.couponDetailValue}>₫{couponData.maxDiscount.toLocaleString()}</Text>
                  </View>
                  
                  <View style={styles.couponDetailItem}>
                    <Text style={styles.couponDetailLabel}>Có hiệu lực từ:</Text>
                    <Text style={styles.couponDetailValue}>{formatDate(couponData.startDate)}</Text>
                  </View>
                  
                  <View style={styles.couponDetailItem}>
                    <Text style={styles.couponDetailLabel}>Hết hiệu lực:</Text>
                    <Text style={styles.couponDetailValue}>{formatDate(couponData.endDate)}</Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Price Summary */}
        <View style={styles.card}>
          <View style={styles.sectionTitleContainer}>
            <Ionicons name="calculator-outline" size={20} color={COLORS.PRIMARY} />
            <Text style={styles.sectionTitle}>Tổng kết đơn hàng</Text>
          </View>
          
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Tạm tính:</Text>
            <Text style={styles.priceValue}>₫{(order.totalPrice || 0).toLocaleString()}</Text>
          </View>
          
          {order.couponId && (
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Giảm giá:</Text>
              <Text style={[styles.priceValue, { color: COLORS.SUCCESS }]}>
                -₫{((order.totalPrice || 0) - (order.finalPrice || 0)).toLocaleString()}
              </Text>
            </View>
          )}
          
          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Tổng cộng:</Text>
            <Text style={styles.totalValue}>₫{(order.finalPrice || 0).toLocaleString()}</Text>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Action Buttons */}
      {(order.status !== OrderStatus.CANCELLED && order.status !== OrderStatus.COMPLETED) && (
        <View style={styles.actionButtons}>
          {(order.status === OrderStatus.PENDING || order.status === OrderStatus.SHIPPING) && (
            <TouchableOpacity
              style={[styles.primaryButton, updating && styles.disabledButton]}
              onPress={handleUpdateOrderStatus}
              disabled={updating}
            >
              {updating ? (
                <ActivityIndicator color={COLORS.TEXT} />
              ) : (
                <Text style={styles.primaryButtonText}>
                  {getPrimaryButtonText(order.status)}
                </Text>
              )}
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={[styles.secondaryButton, updating && styles.disabledButton]}
            onPress={handleCancelOrder}
            disabled={updating}
          >
            <Text style={styles.secondaryButtonText}>Hủy đơn hàng</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

// Giữ nguyên phần styles từ trước đó
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
    marginTop: 16,
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
    textAlign: 'center',
    marginVertical: 16,
  },
  retryButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: COLORS.TEXT,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 44,
    paddingBottom: 16,
    backgroundColor: COLORS.ITEM_BACKGROUND,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.ITEM_BORDER,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: COLORS.TEXT,
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    minWidth: 40,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: COLORS.TEXT,
    fontSize: 12,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  card: {
    backgroundColor: COLORS.ITEM_BACKGROUND,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderIdText: {
    color: COLORS.TEXT,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  orderDateText: {
    color: COLORS.ITEM_TEXT,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    color: COLORS.TEXT,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  userPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userAvatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.ITEM_BORDER,
  },
  userPreviewInfo: {
    marginLeft: 12,
    flex: 1,
  },
  userNamePreview: {
    color: COLORS.TEXT,
    fontSize: 16,
    fontWeight: '600',
  },
  userEmailPreview: {
    color: COLORS.ITEM_TEXT,
    fontSize: 14,
  },
  userContent: {
    marginTop: 8,
  },
  userInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  userInfoLabel: {
    color: COLORS.ITEM_TEXT,
    fontSize: 14,
  },
  userInfoValue: {
    color: COLORS.TEXT,
    fontSize: 14,
    fontWeight: '500',
  },
  roleBadge: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  roleText: {
    color: COLORS.TEXT,
    fontSize: 12,
    fontWeight: '600',
  },
  addressContent: {
    marginTop: 8,
  },
  receiverName: {
    color: COLORS.TEXT,
    fontSize: 16,
    fontWeight: '600',
  },
  receiverPhone: {
    color: COLORS.ITEM_TEXT,
    fontSize: 14,
    marginTop: 4,
  },
  addressText: {
    color: COLORS.ITEM_TEXT,
    fontSize: 14,
    marginTop: 4,
  },
  addressDescription: {
    color: COLORS.ITEM_TEXT,
    fontSize: 13,
    marginTop: 8,
    fontStyle: 'italic',
  },
  noteText: {
    color: COLORS.ITEM_TEXT,
    fontSize: 14,
    marginTop: 8,
  },
  productItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.ITEM_BORDER,
  },
  lastProductItem: {
    borderBottomWidth: 0,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: COLORS.ITEM_BORDER,
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  productBasicInfo: {
    flex: 1,
  },
  productName: {
    color: COLORS.TEXT,
    fontSize: 16,
    fontWeight: '600',
  },
  productSize: {
    color: COLORS.ITEM_TEXT,
    fontSize: 14,
    marginTop: 4,
  },
  productQuantity: {
    color: COLORS.ITEM_TEXT,
    fontSize: 14,
    marginTop: 4,
  },
  productPrice: {
    color: COLORS.TEXT,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  expandButton: {
    padding: 4,
  },
  expandedContent: {
    marginTop: 8,
  },
  priceBreakdown: {
    marginTop: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  priceLabel: {
    color: COLORS.ITEM_TEXT,
    fontSize: 14,
  },
  priceValue: {
    color: COLORS.TEXT,
    fontSize: 14,
    fontWeight: '500',
  },
  toppingsSection: {
    marginVertical: 8,
  },
  toppingsTitle: {
    color: COLORS.ITEM_TEXT,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  toppingItemExpanded: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  toppingImage: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 8,
  },
  toppingName: {
    flex: 1,
    color: COLORS.ITEM_TEXT,
    fontSize: 14,
  },
  toppingPrice: {
    color: COLORS.TEXT,
    fontSize: 14,
    fontWeight: '500',
  },
  totalItemRow: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.ITEM_BORDER,
    paddingTop: 8,
  },
  totalItemLabel: {
    color: COLORS.TEXT,
    fontSize: 14,
    fontWeight: '600',
  },
  totalItemPrice: {
    color: COLORS.TEXT,
    fontSize: 14,
    fontWeight: '600',
  },
  noItemsText: {
    color: COLORS.ITEM_TEXT,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  couponPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  couponImageSmall: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: COLORS.ITEM_BORDER,
  },
  couponPreviewInfo: {
    marginLeft: 12,
    flex: 1,
  },
  couponCodePreview: {
    color: COLORS.TEXT,
    fontSize: 16,
    fontWeight: '600',
  },
  discountAmountPreview: {
    color: COLORS.SUCCESS,
    fontSize: 14,
    fontWeight: '500',
  },
  couponContent: {
    marginTop: 8,
  },
  couponDescription: {
    color: COLORS.ITEM_TEXT,
    fontSize: 14,
    marginBottom: 12,
  },
  couponDetailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  couponDetailItem: {
    width: '48%',
    marginVertical: 4,
  },
  couponDetailLabel: {
    color: COLORS.ITEM_TEXT,
    fontSize: 14,
  },
  couponDetailValue: {
    color: COLORS.TEXT,
    fontSize: 14,
    fontWeight: '500',
  },
  totalRow: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.ITEM_BORDER,
    paddingTop: 8,
  },
  totalLabel: {
    color: COLORS.TEXT,
    fontSize: 16,
    fontWeight: '600',
  },
  totalValue: {
    color: COLORS.PRIMARY,
    fontSize: 16,
    fontWeight: '700',
  },
  bottomSpacer: {
    height: 80,
  },
  actionButtons: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  primaryButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: COLORS.TEXT,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: COLORS.ITEM_BACKGROUND,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.ERROR,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: COLORS.ERROR,
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default OrderDetailScreen;