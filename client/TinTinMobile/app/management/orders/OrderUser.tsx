import { View, Text, StyleSheet, TouchableOpacity, FlatList, KeyboardAvoidingView, Animated, Modal, Platform, ScrollView } from "react-native";
import { COLORS } from "@/util/constant";
import HeaderList from "@/components/HeaderList";
import { router, useLocalSearchParams } from "expo-router";
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { useCallback, useEffect, useState, useRef } from "react";
import Ionicons from '@expo/vector-icons/Ionicons';
import Octicons from '@expo/vector-icons/Octicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import ShareTextInput from "@/components/ShareTextInput";
import { callGetOrders, callUpdateOrder, callDeleteOrder, callGetUser } from "@/config/api";
import { OrderStatus } from "@/types/enums/OrderStatus.enum";
import { IOrderRes, IOrderUpdate } from "@/types/order";
import EmptyState from "@/components/EmptyState";
import ConfirmDialog from "@/components/ConfirmDialog";
import Toast from "react-native-toast-message";
import DateTimePicker from '@react-native-community/datetimepicker';
import { IUser } from "@/types/backend";

const OrderUserScreen = () => {
    const { id: userId } = useLocalSearchParams<{ id: string }>();
    
    const selectValues = ['Tất cả', 'Chờ xử lý', 'Đang giao', 'Hoàn thành', 'Đã hủy'];
    const statusMapping = ['', OrderStatus.PENDING, OrderStatus.SHIPPING, OrderStatus.COMPLETED, OrderStatus.CANCELLED];
    
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [orders, setOrders] = useState<IOrderRes[]>([]);
    const [filterStatus, setFilterStatus] = useState<string>("");
    const [sort, setSort] = useState<string>("createdAt,desc");
    const [visible, setVisible] = useState(false);
    const [itemDelete, setItemDelete] = useState<IOrderRes>();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [user, setUser] = useState<IUser>()
    
    // Advanced filter modal states
    const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [minPrice, setMinPrice] = useState<string>("");
    const [maxPrice, setMaxPrice] = useState<string>("");
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);

    // Animation cho sort icon
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;

    // Utility function to safely format order ID
    const formatOrderId = (id: string | number | undefined): string => {
        if (!id) return 'N/A';
        return String(id).substring(0, 8);
    };

    const createFilter = (filterStatus: string, userId: string) => {
        let filters = [];
        
        // Filter by user ID - Điều kiện bắt buộc
        if (userId) {
            filters.push(`user.id:'${userId}'`);
        }
        
        // Filter by status
        if (filterStatus.length > 0) {
            filters.push(`status:'${filterStatus}'`);
        }
        
        // Filter by date range
        if (startDate && endDate) {
            const startISO = startDate.toISOString();
            const endISO = endDate.toISOString();
            filters.push(`createdAt>='${startISO}' and createdAt<='${endISO}'`);
        }
        
        // Filter by price range
        if (minPrice || maxPrice) {
            if (minPrice && maxPrice) {
                filters.push(`finalPrice>=${minPrice} and finalPrice<=${maxPrice}`);
            } else if (minPrice) {
                filters.push(`finalPrice>=${minPrice}`);
            } else if (maxPrice) {
                filters.push(`finalPrice<=${maxPrice}`);
            }
        }
        
        return filters.length > 0 ? filters.join(' and ') : "";
    }

    useEffect(() => {
        if (!userId) {
            Toast.show({
                text1: "Không tìm thấy ID người dùng",
                type: "error"
            });
            router.back();
            return;
        }

        setIsRefreshing(false);
        const delayDebounce = setTimeout(() => {
            const filter = createFilter(filterStatus, userId);
            fetchOrders(filter);
        }, 500); // Giảm thời gian debounce cho user experience tốt hơn

        return () => clearTimeout(delayDebounce);
    }, [filterStatus, sort, selectedIndex, isRefreshing, startDate, endDate, minPrice, maxPrice, userId]);

    const fetchOrders = async (filter?: string) => {
        try {
            const response = await callGetOrders({ filter });
            if (response.data) {
                let sortedOrders = response.data || [];
                

                const user = await callGetUser(userId);
                if (user.data) {
                    setUser(user.data);
                }
                   
                
                
                // Sort orders theo createdAt
                if (sort === "createdAt,desc") {
                    sortedOrders.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
                } else {
                    sortedOrders.sort((a, b) => new Date(a.createdAt || '').getTime() - new Date(b.createdAt || '').getTime());
                }
                
                setOrders(sortedOrders);
            }
        } catch (error) {
            console.error('Error fetching user orders:', error);
            Toast.show({
                text1: "Lỗi khi tải lịch sử đơn hàng",
                type: "error"
            });
        }
    };

    const handleSelectedIndex = (index: number) => {
        setSelectedIndex(index);
        setFilterStatus(statusMapping[index]);
    }

    const handleViewOrder = (item: IOrderRes) => {
        router.push({
            pathname: "/management/orders/OrderDetail",
            params: {
                orderId: item.id
            }
        })
    }

    const handleSortPress = () => {
        // Animation khi nhấn sort
        Animated.sequence([
            Animated.parallel([
                Animated.timing(scaleAnim, {
                    toValue: 0.8,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(rotateAnim, {
                    toValue: sort === "createdAt,asc" ? 1 : 0,
                    duration: 200,
                    useNativeDriver: true,
                })
            ]),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            })
        ]).start();

        setSort(sort === "createdAt,asc" ? "createdAt,desc" : "createdAt,asc");
    };

    const handleUpdateOrderStatus = async (order: IOrderRes, newStatus: OrderStatus) => {
        try {
            const updateData: IOrderUpdate = {
                id: order.id,
                userId: order.userId,
                couponId: order.couponId,
                addressId: order.addressUser.id,
                note: order.note,
                status: newStatus,
                orderDetails: order.orderDetails.map(detail => ({
                    productSizeId: detail.productSizeId,
                    quantity: detail.quantity,
                    toppingIds: detail.toppingIds.map((id: string) => id)
                }))
            };

            const response = await callUpdateOrder(updateData);
            if (response.data) {
                Toast.show({
                    text1: "Cập nhật trạng thái đơn hàng thành công",
                    type: "success"
                });
                setIsRefreshing(true);
            }
        } catch (error) {
            Toast.show({
                text1: "Cập nhật trạng thái đơn hàng thất bại",
                type: "error"
            });
        }
    };

    const handleConfirmDeleteOrder = async (item: IOrderRes) => {
        try {
            const response = await callDeleteOrder(item.id);
            if (response.data) {
                Toast.show({
                    text1: "Hủy đơn hàng thành công",
                    type: "success"
                });
                setIsRefreshing(true);
            }
        } catch (error) {
            Toast.show({
                text1: "Hủy đơn hàng thất bại",
                type: "error"
            });
        }
        setVisible(false);
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const getStatusColor = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.PENDING:
                return COLORS.WARNING;
            case OrderStatus.SHIPPING:
                return COLORS.BLUE_LIGHT;
            case OrderStatus.COMPLETED:
                return COLORS.SUCCESS;
            case OrderStatus.CANCELLED:
                return COLORS.ERROR;
            default:
                return COLORS.ITEM_TEXT;
        }
    };

    const getStatusText = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.PENDING:
                return "Chờ xử lý";
            case OrderStatus.SHIPPING:
                return "Đang giao";
            case OrderStatus.COMPLETED:
                return "Hoàn thành";
            case OrderStatus.CANCELLED:
                return "Đã hủy";
            default:
                return status;
        }
    };

    const getActionButtonText = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.PENDING:
                return "Xác nhận";
            case OrderStatus.SHIPPING:
                return "Hoàn thành";
            default:
                return "";
        }
    };

    const getNextStatus = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.PENDING:
                return OrderStatus.SHIPPING;
            case OrderStatus.SHIPPING:
                return OrderStatus.COMPLETED;
            default:
                return status;
        }
    };

    const clearAdvancedFilter = () => {
        setStartDate(null);
        setEndDate(null);
        setMinPrice("");
        setMaxPrice("");
    };

    const applyAdvancedFilter = () => {
        setShowAdvancedFilter(false);
        // Filter will be applied automatically via useEffect
    };

    // Tính toán rotation cho icon
    const rotateInterpolate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg']
    });

    const OrderItem = ({ item }: { item: IOrderRes }) => (
        <TouchableOpacity
            style={styles.orderItem}
            onPress={() => handleViewOrder(item)}
            activeOpacity={0.7}
        >
            <View style={styles.orderHeader}>
                <Text style={styles.orderId}>#{formatOrderId(item.id)}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                    <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
                </View>
            </View>
            
            <View style={styles.orderInfo}>
                <Text style={styles.orderDate}>
                    {formatDate(item.createdAt || '')} - {formatTime(item.createdAt || '')}
                </Text>
                <Text style={styles.totalPrice}>
                    Tổng: {formatPrice(item.totalPrice)}
                </Text>
                <Text style={styles.finalPrice}>
                    Thành tiền: {formatPrice(item.finalPrice)}
                </Text>
                {item.note && (
                    <Text style={styles.orderNote}>
                        Ghi chú: {item.note}
                    </Text>
                )}
            </View>
            
            <View style={styles.orderActions}>
                {(item.status === OrderStatus.PENDING || item.status === OrderStatus.SHIPPING) && (
                    <TouchableOpacity
                        style={[styles.actionButton, styles.primaryButton]}
                        onPress={(e) => {
                            e.stopPropagation();
                            handleUpdateOrderStatus(item, getNextStatus(item.status));
                        }}
                    >
                        <Text style={styles.primaryButtonText}>
                            {getActionButtonText(item.status)}
                        </Text>
                    </TouchableOpacity>
                )}
                
                {item.status !== OrderStatus.CANCELLED && item.status !== OrderStatus.COMPLETED && (
                    <TouchableOpacity
                        style={[styles.actionButton, styles.dangerButton]}
                        onPress={(e) => {
                            e.stopPropagation();
                            setItemDelete(item);
                            setVisible(true);
                        }}
                    >
                        <Text style={styles.dangerButtonText}>Hủy</Text>
                    </TouchableOpacity>
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <View style={styles.container}>
                <HeaderList
                    title={`Lịch sử đơn hàng${user ? ` - ${user.name}` : ''}`}
                    backPress={() => router.back()}
                    showAdd={false}
                    showBack={true}
                />

                <View style={styles.segmentContainer}>
                    <SegmentedControl
                        values={selectValues}
                        selectedIndex={selectedIndex}
                        onChange={(event) => {
                            handleSelectedIndex(event.nativeEvent.selectedSegmentIndex);
                        }}
                        backgroundColor={COLORS.ITEM_BACKGROUND}
                        tintColor={COLORS.BLUE_LIGHT}
                        fontStyle={{ color: COLORS.ITEM_TEXT }}
                        style={styles.segmentStyle}
                        activeFontStyle={{ color: COLORS.ITEM_ACTIVE_BLUE }}
                    />
                </View>

                <View style={styles.searchContainer}>
                    <TouchableOpacity
                        onPress={handleSortPress}
                        style={[
                            styles.sortButton,
                            { backgroundColor: sort === "createdAt,desc" ? COLORS.BLUE_LIGHT : COLORS.ITEM_BACKGROUND }
                        ]}
                        activeOpacity={0.7}
                    >
                        <Animated.View
                            style={[
                                styles.sortIconContainer,
                                {
                                    transform: [
                                        { scale: scaleAnim },
                                        { rotate: rotateInterpolate }
                                    ]
                                }
                            ]}
                        >
                            <MaterialIcons
                                name="arrow-upward"
                                size={20}
                                color={sort === "createdAt,desc" ? "white" : COLORS.ITEM_TEXT}
                            />
                        </Animated.View>
                        <Text style={[
                            styles.sortText,
                            { color: sort === "createdAt,desc" ? "white" : COLORS.ITEM_TEXT }
                        ]}>
                            {sort === "createdAt,desc" ? "Mới nhất" : "Cũ nhất"}
                        </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={styles.filterButton}
                        onPress={() => setShowAdvancedFilter(true)}
                    >
                        <Octicons name="filter" size={24} color={COLORS.ITEM_TEXT} />
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={orders}
                    renderItem={({ item }) => <OrderItem item={item} />}
                    keyExtractor={item => item.id ? String(item.id) : Math.random().toString()}
                    ListEmptyComponent={
                        <EmptyState 
                            title="Chưa có đơn hàng" 
                            description={`${user?.name || 'Người dùng này'} chưa có đơn hàng nào`} 
                        />
                    }
                    refreshing={isRefreshing}
                    onRefresh={() => {
                        setIsRefreshing(true);
                    }}
                    showsVerticalScrollIndicator={false}
                />
                
                <ConfirmDialog
                    visible={visible}
                    title="Hủy đơn hàng"
                    message="Bạn có chắc chắn muốn hủy đơn hàng này không?"
                    onConfirm={() => {
                        if (itemDelete) {
                            handleConfirmDeleteOrder(itemDelete);
                        }
                    }}
                    onCancel={() => setVisible(false)}
                />

                {/* Advanced Filter Modal */}
                <Modal
                    visible={showAdvancedFilter}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setShowAdvancedFilter(false)}
                >
                    <KeyboardAvoidingView 
                        style={styles.modalKeyboardView}
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
                    >
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContent}>
                                <View style={styles.modalHeader}>
                                    <Text style={styles.modalTitle}>Lọc lịch sử đơn hàng</Text>
                                    <TouchableOpacity
                                        onPress={() => setShowAdvancedFilter(false)}
                                        style={styles.closeButton}
                                    >
                                        <Ionicons name="close" size={24} color={COLORS.ITEM_TEXT} />
                                    </TouchableOpacity>
                                </View>

                                <ScrollView 
                                    style={styles.modalScrollView}
                                    showsVerticalScrollIndicator={false}
                                    keyboardShouldPersistTaps="handled"
                                >
                                    <View style={styles.filterSection}>
                                        <Text style={styles.sectionTitle}>Khoảng thời gian</Text>
                                        
                                        <TouchableOpacity
                                            style={styles.dateButton}
                                            onPress={() => setShowStartDatePicker(true)}
                                        >
                                            <Text style={styles.dateButtonText}>
                                                Từ ngày: {startDate ? formatDate(startDate.toISOString()) : 'Chọn ngày'}
                                            </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={styles.dateButton}
                                            onPress={() => setShowEndDatePicker(true)}
                                        >
                                            <Text style={styles.dateButtonText}>
                                                Đến ngày: {endDate ? formatDate(endDate.toISOString()) : 'Chọn ngày'}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>

                                    <View style={styles.filterSection}>
                                        <Text style={styles.sectionTitle}>Khoảng giá</Text>
                                        
                                        <ShareTextInput
                                            placeholder="Giá từ"
                                            value={minPrice}
                                            onChangeText={setMinPrice}
                                            keyboardType="numeric"
                                            inputStyle={styles.priceInput}
                                            containerStyle={styles.priceInputContainer}
                                        />

                                        <ShareTextInput
                                            placeholder="Giá đến"
                                            value={maxPrice}
                                            onChangeText={setMaxPrice}
                                            keyboardType="numeric"
                                            inputStyle={styles.priceInput}
                                            containerStyle={styles.priceInputContainer}
                                        />
                                    </View>
                                </ScrollView>

                                <View style={styles.modalActions}>
                                    <TouchableOpacity
                                        style={[styles.modalButton, styles.clearButton]}
                                        onPress={clearAdvancedFilter}
                                    >
                                        <Text style={styles.clearButtonText}>Xóa bộ lọc</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.modalButton, styles.applyButton]}
                                        onPress={applyAdvancedFilter}
                                    >
                                        <Text style={styles.applyButtonText}>Áp dụng</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        {showStartDatePicker && (
                            <DateTimePicker
                                value={startDate || new Date()}
                                mode="date"
                                display="default"
                                onChange={(event, selectedDate) => {
                                    setShowStartDatePicker(false);
                                    if (selectedDate) {
                                        setStartDate(selectedDate);
                                    }
                                }}
                            />
                        )}

                        {showEndDatePicker && (
                            <DateTimePicker
                                value={endDate || new Date()}
                                mode="date"
                                display="default"
                                onChange={(event, selectedDate) => {
                                    setShowEndDatePicker(false);
                                    if (selectedDate) {
                                        setEndDate(selectedDate);
                                    }
                                }}
                            />
                        )}
                    </KeyboardAvoidingView>
                </Modal>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.BACKGROUND,
    },
    segmentContainer: {
        backgroundColor: COLORS.ITEM_BACKGROUND,
    },
    segmentStyle: {
        height: 36,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: COLORS.BACKGROUND,
    },
    sortButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.BLUE_LIGHT,
        minWidth: 90,
    },
    sortIconContainer: {
        marginRight: 4,
    },
    sortText: {
        fontSize: 12,
        fontWeight: "500",
    },
    filterButton: {
        padding: 8,
    },
    orderItem: {
        backgroundColor: COLORS.ITEM_BACKGROUND,
        marginHorizontal: 16,
        marginVertical: 8,
        borderRadius: 12,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    orderHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    orderId: {
        fontSize: 16,
        fontWeight: "bold",
        color: COLORS.ITEM_TEXT,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
    },
    statusText: {
        color: "white",
        fontSize: 12,
        fontWeight: "500",
    },
    orderInfo: {
        marginBottom: 16,
    },
    orderDate: {
        fontSize: 14,
        color: COLORS.ITEM_TEXT,
        marginBottom: 4,
    },
    totalPrice: {
        fontSize: 14,
        color: COLORS.ITEM_TEXT,
        marginBottom: 4,
    },
    finalPrice: {
        fontSize: 16,
        fontWeight: "bold",
        color: COLORS.BLUE_LIGHT,
    },
    orderNote: {
        fontSize: 12,
        color: COLORS.ITEM_TEXT,
        fontStyle: 'italic',
        marginTop: 4,
    },
    orderActions: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 12,
    },
    actionButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        minWidth: 80,
        alignItems: "center",
    },
    primaryButton: {
        backgroundColor: COLORS.BLUE_LIGHT,
    },
    primaryButtonText: {
        color: "white",
        fontSize: 14,
        fontWeight: "500",
    },
    dangerButton: {
        backgroundColor: COLORS.ERROR,
    },
    dangerButtonText: {
        color: "white",
        fontSize: 14,
        fontWeight: "500",
    },
    // Modal styles
    modalKeyboardView: {
        flex: 1,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 16,
    },
    modalContent: {
        backgroundColor: COLORS.ITEM_BACKGROUND,
        borderRadius: 16,
        padding: 20,
        width: "100%",
        maxHeight: "85%",
        minHeight: 400,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.BACKGROUND,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: COLORS.ITEM_TEXT,
    },
    closeButton: {
        padding: 4,
    },
    modalScrollView: {
        flex: 1,
        marginBottom: 20,
    },
    filterSection: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: COLORS.ITEM_TEXT,
        marginBottom: 12,
    },
    dateButton: {
        backgroundColor: COLORS.BACKGROUND,
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: COLORS.BLUE_LIGHT,
    },
    dateButtonText: {
        color: COLORS.ITEM_TEXT,
        fontSize: 14,
    },
    priceInput: {
        backgroundColor: COLORS.BACKGROUND,
        color: COLORS.ITEM_TEXT,
    },
    priceInputContainer: {
        marginVertical: 4,
    },
    modalActions: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 12,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: COLORS.BACKGROUND,
    },
    modalButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    clearButton: {
        backgroundColor: COLORS.BACKGROUND,
        borderWidth: 1,
        borderColor: COLORS.ITEM_TEXT,
    },
    clearButtonText: {
        color: COLORS.ITEM_TEXT,
        fontSize: 14,
        fontWeight: "500",
    },
    applyButton: {
        backgroundColor: COLORS.BLUE_LIGHT,
    },
    applyButtonText: {
        color: "white",
        fontSize: 14,
        fontWeight: "500",
    },
});

export default OrderUserScreen;