import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/util/constant';
import AntDesign from '@expo/vector-icons/AntDesign';

const orders = [
  {
    id: '1',
    date: '20/03/2024',
    status: 'Đã hoàn thành',
    items: [
      { name: 'Cà phê sữa', quantity: 2, price: '25.000đ' },
      { name: 'Trà sữa trân châu', quantity: 1, price: '30.000đ' },
    ],
    total: '80.000đ',
  },
  {
    id: '2',
    date: '19/03/2024',
    status: 'Đang xử lý',
    items: [
      { name: 'Trà đào', quantity: 1, price: '35.000đ' },
    ],
    total: '35.000đ',
  },
];

export default function OrdersScreen() {
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
                  <Text style={[
                    styles.orderStatus,
                    { color: order.status === 'Đã hoàn thành' ? 'green' : COLORS.PRIMARY }
                  ]}>
                    {order.status}
                  </Text>
                </View>
                <View style={styles.orderDate}>
                  <AntDesign name="calendar" size={16} color="gray" />
                  <Text style={styles.dateText}>{order.date}</Text>
                </View>
                <View style={styles.orderItems}>
                  {order.items.map((item, index) => (
                    <View key={index} style={styles.orderItem}>
                      <Text style={styles.itemName}>{item.name} x{item.quantity}</Text>
                      <Text style={styles.itemPrice}>{item.price}</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.orderTotal}>
                  <Text style={styles.totalLabel}>Tổng cộng:</Text>
                  <Text style={styles.totalAmount}>{order.total}</Text>
                </View>
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
    backgroundColor: COLORS.PRIMARY,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  scrollView: {
    flex: 1,
  },
  ordersList: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: 'white',
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
    color: 'gray',
  },
  orderItems: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 14,
  },
  itemPrice: {
    fontSize: 14,
    color: 'gray',
  },
  orderTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.PRIMARY,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: 'gray',
    marginTop: 16,
  },
});
