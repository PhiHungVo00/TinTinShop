import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/util/constant';
import AntDesign from '@expo/vector-icons/AntDesign';
import { router, useFocusEffect } from 'expo-router';
import { useState, useCallback } from 'react';
import { useOrders } from '@/context/OrderContext';

interface Order {
  id: string;
  date: string;
  status: string;
  items: Array<{
    name: string;
    quantity: number;
    price: string;
    size: string;
    ice: string;
    sugar: string;
    toppings: Array<string>;
    toppingPrice: number;
  }>;
  total: string;
}

export default function OrdersScreen() {
  const { orders, updateOrderStatus } = useOrders();

  console.log('Current orders in OrdersScreen:', orders);

  // Refresh orders when screen is focused
  useFocusEffect(
    useCallback(() => {
      // TODO: Gọi API lấy danh sách đơn hàng của user
      // const fetchOrders = async () => {
      //   const response = await callGetOrders();
      //   setOrders(response.data);
      // };
      // fetchOrders();
    }, [])
  );

  const handlePaymentPress = (orderId: string) => {
    const orderToPay = orders.find(order => order.id === orderId);
    if (orderToPay) {
      router.push({
        pathname: '/(user)/payment',
        params: { orderId, total: orderToPay.total }
      });
      // TODO: Gọi API cập nhật trạng thái đơn hàng sau khi thanh toán
      // const updateOrder = async () => {
      //   const response = await callUpdateOrderStatus(orderId, 'Đã hoàn thành');
      //   if (response.success) {
      //     updateOrderStatus(orderId, 'Đã hoàn thành');
      //   }
      // };
      // updateOrder();
      updateOrderStatus(orderId, 'Đã hoàn thành');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Đơn hàng của tôi</Text>
      </View>
      <ScrollView style={styles.scrollView}>
        {orders.length > 0 ? (
          <View style={styles.ordersList}>
            {orders.map((order) => (
              <TouchableOpacity key={order.id} style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <Text style={styles.orderId}>Đơn hàng #{order.id}</Text>
                  {/* <Text style={[
                    styles.orderStatus,
                    { color: order.status === 'Đã hoàn thành' ? COLORS.SUCCESS : COLORS.PRIMARY }
                  ]}>
                    {order.status}
                  </Text> */}
                </View>
                <View style={styles.orderDate}>
                  <AntDesign name="calendar" size={16} color={COLORS.ITEM_TEXT} />
                  <Text style={styles.dateText}>{order.date}</Text>
                </View>
                <View style={styles.orderItems}>
                  {order.items.map((item, index) => (
                    <View key={index} style={styles.orderItem}>
                      <Text style={styles.itemName}>{item.name} x{item.quantity}</Text>
                      <Text style={styles.itemPrice}>{item.price}</Text>
                      <View style={styles.itemDetails}>
                        <Text style={styles.itemDetailText}>Size: {item.size}</Text>
                        <Text style={styles.itemDetailText}>Đá: {item.ice}</Text>
                        <Text style={styles.itemDetailText}>Đường: {item.sugar}</Text>
                        {item.toppings.length > 0 && (
                          <Text style={styles.itemDetailText}>Topping: {item.toppings.join(', ')} ({item.toppingPrice.toLocaleString('vi-VN')} VNĐ)</Text>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
                <View style={styles.orderTotal}>
                  <Text style={styles.totalLabel}>Tổng cộng:</Text>
                  <Text style={styles.totalAmount}>{order.total}</Text>
                </View>
                {order.status === 'Chưa thanh toán' ? (
                  <TouchableOpacity 
                    style={styles.paymentButton}
                    onPress={() => handlePaymentPress(order.id)}
                  >
                    <Text style={styles.paymentButtonText}>Thanh toán</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.paymentSuccessContainer}>
                    <AntDesign name="checkcircleo" size={20} color={COLORS.SUCCESS} />
                    <Text style={styles.paymentSuccessText}>Thanh toán thành công</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <AntDesign name="shoppingcart" size={64} color={COLORS.PRIMARY} />
            <Text style={styles.emptyStateText}>Chưa có đơn hàng nào</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    padding: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.TEXT,
  },
  scrollView: {
    flex: 1,
  },
  ordersList: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: COLORS.ITEM_BACKGROUND,
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT,
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
  orderDate: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateText: {
    marginLeft: 4,
    color: COLORS.ITEM_TEXT,
  },
  orderItems: {
    borderTopWidth: 1,
    borderTopColor: 'white',
    paddingTop: 12,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  itemName: {
    fontSize: 14,
    color: COLORS.TEXT,
    flexShrink: 1,
  },
  itemPrice: {
    fontSize: 14,
    color: COLORS.ITEM_TEXT,
  },
  itemDetails: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
    marginTop: 4,
  },
  itemDetailText: {
    marginLeft: 0,
    color: COLORS.ITEM_TEXT,
    fontSize: 12,
  },
  orderTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'white',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT,
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.PRIMARY,
  },
  paymentButton: {
    backgroundColor: 'orange',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    alignItems: 'center',
  },
  paymentButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: COLORS.ITEM_TEXT,
    marginTop: 16,
  },
  paymentSuccessContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  paymentSuccessText: {
    marginLeft: 8,
    color: COLORS.SUCCESS,
    fontSize: 16,
    fontWeight: '600',
  },
});
