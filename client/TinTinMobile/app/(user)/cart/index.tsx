import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/util/constant';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCart } from '@/context/CartContext';

const CartScreen = () => {
  const { items, removeItem, updateItemQuantity, getTotalPrice } = useCart();

  // TODO: Gọi API lấy giỏ hàng của user
  // const fetchCart = async () => {
  //   const response = await callGetCart();
  //   setCartItems(response.data);
  // };

  const handleCheckout = () => {
    if (items.length === 0) {
      return;
    }
    // TODO: Gọi API tạo đơn hàng mới
    // const createOrder = async () => {
    //   const response = await callCreateOrder({
    //     items,
    //     total: getTotalPrice()
    //   });
    //   if (response.success) {
    //     router.push({
    //       pathname: '/(user)/payment',
    //       params: { total: getTotalPrice().toString() }
    //     });
    //   }
    // };
    // createOrder();
    router.push({
      pathname: '/(user)/payment',
      params: { total: getTotalPrice().toString() }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color={COLORS.ITEM_TEXT} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Giỏ hàng</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {items.length > 0 ? (
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
            <Text style={styles.totalLabel}>Tổng cộng:</Text>
            <Text style={styles.totalAmount}>{getTotalPrice().toLocaleString('vi-VN')} VNĐ</Text>
          </View>
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={handleCheckout}
          >
            <Text style={styles.checkoutButtonText}>Thanh toán</Text>
          </TouchableOpacity>
        </View>
      )}
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
  totalLabel: {
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
});

export default CartScreen; 