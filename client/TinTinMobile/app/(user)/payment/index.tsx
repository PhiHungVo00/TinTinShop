import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/util/constant';
import { AntDesign } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import Toast from "react-native-toast-message";
import { useCart } from '@/context/CartContext';
import { useOrders } from '@/context/OrderContext';
import { IPayment, IOrder } from '@/types/backend';

const PaymentScreen = () => {
  const { total } = useLocalSearchParams();
  const totalAmount = total;
  const walletBalance = '1.000.000';
  const [isProcessing, setIsProcessing] = useState(false);
  const { items, clearCart } = useCart();
  const { addOrder } = useOrders();

  const handlePayment = async (method: string) => {
    try {
      setIsProcessing(true);
      // TODO: Gọi API thanh toán
      // const response = await callPaymentAPI({
      //   orderId,
      //   method,
      //   amount: totalAmount,
      //   items: items
      // });
      // if (response.success) {
      //   // Xử lý sau khi thanh toán thành công
      //   addOrder(newOrder);
      //   clearCart();
      //   Toast.show({
      //     type: 'success',
      //     text1: `Thanh toán thành công qua ${method}`,
      //   });
      //   router.replace('/(user)/orders');
      // }
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Tạo đơn hàng mới từ giỏ hàng
      const newOrder: IOrder = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('vi-VN'),
        status: 'Đã hoàn thành',
        items: items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          size: item.size,
          ice: item.ice,
          sugar: item.sugar,
          toppings: item.toppings,
          toppingPrice: item.toppingPrice,
        })),
        total: totalAmount.toString(),
      };

      // Thêm đơn hàng mới và xóa giỏ hàng
      addOrder(newOrder);
      clearCart();

      Toast.show({
        type: 'success',
        text1: `Thanh toán thành công qua ${method}`,
      });

      // Chuyển hướng về trang orders sau khi thanh toán thành công
      router.replace('/(user)/orders');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Thanh toán thất bại',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color={COLORS.ITEM_TEXT} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thanh toán</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
          <TouchableOpacity 
            style={[styles.paymentMethod, isProcessing && styles.disabledMethod]} 
            onPress={() => handlePayment('Ví điện tử')}
            disabled={isProcessing}
          >
            <View style={styles.methodLeft}>
              <View style={styles.iconContainer}>
                <AntDesign name="wallet" size={24} color={COLORS.ITEM_TEXT} />
              </View>
              <View>
                <Text style={styles.methodTitle}>Wallet</Text>
                <Text style={styles.methodSubtitle}>Số dư: {walletBalance} VNĐ</Text>
              </View>
            </View>
            <AntDesign name="checkcircle" size={24} color={COLORS.PRIMARY} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.paymentMethod, isProcessing && styles.disabledMethod]} 
            onPress={() => handlePayment('Google Pay')}
            disabled={isProcessing}
          >
            <View style={styles.methodLeft}>
              <View style={styles.iconContainer}>
                <AntDesign name="google" size={24} color={COLORS.ITEM_TEXT} />
              </View>
              <Text style={styles.methodTitle}>Google Pay</Text>
            </View>
            <AntDesign name="checkcircle" size={24} color={COLORS.PRIMARY} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.paymentMethod, isProcessing && styles.disabledMethod]} 
            onPress={() => handlePayment('Apple Pay')}
            disabled={isProcessing}
          >
            <View style={styles.methodLeft}>
              <View style={styles.iconContainer}>
                <AntDesign name="apple1" size={24} color={COLORS.ITEM_TEXT} />
              </View>
              <Text style={styles.methodTitle}>Apple Pay</Text>
            </View>
            <AntDesign name="checkcircle" size={24} color={COLORS.PRIMARY} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.paymentMethod, isProcessing && styles.disabledMethod]} 
            onPress={() => handlePayment('Amazon Pay')}
            disabled={isProcessing}
          >
            <View style={styles.methodLeft}>
              <View style={styles.iconContainer}>
                <AntDesign name="amazon" size={24} color={COLORS.ITEM_TEXT} />
              </View>
              <Text style={styles.methodTitle}>Amazon Pay</Text>
            </View>
            <AntDesign name="checkcircle" size={24} color={COLORS.PRIMARY} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.paymentMethod, isProcessing && styles.disabledMethod]} 
            onPress={() => handlePayment('Thẻ tín dụng')}
            disabled={isProcessing}
          >
            <View style={styles.methodLeft}>
              <View style={styles.iconContainer}>
                <AntDesign name="creditcard" size={24} color={COLORS.ITEM_TEXT} />
              </View>
              <Text style={styles.methodTitle}>Thẻ tín dụng</Text>
            </View>
            <AntDesign name="checkcircle" size={24} color={COLORS.PRIMARY} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chi tiết thanh toán</Text>
          <View style={styles.paymentDetail}>
            <Text style={styles.detailLabel}>Tổng tiền hàng</Text>
            <Text style={styles.detailValue}>{totalAmount} VNĐ</Text>
          </View>
          <View style={styles.paymentDetail}>
            <Text style={styles.detailLabel}>Phí vận chuyển</Text>
            <Text style={styles.detailValue}>0 VNĐ</Text>
          </View>
          <View style={styles.paymentDetail}>
            <Text style={styles.detailLabel}>Tổng thanh toán</Text>
            <Text style={styles.totalAmount}>{totalAmount} VNĐ</Text>
          </View>
        </View>
      </ScrollView>
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
    padding: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT,
    marginBottom: 12,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.ITEM_BACKGROUND,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  disabledMethod: {
    opacity: 0.5,
  },
  methodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: COLORS.ITEM_BACKGROUND,
    borderRadius: 12,
    padding: 8,
    marginRight: 12,
  },
  methodTitle: {
    fontSize: 16,
    color: COLORS.TEXT,
    fontWeight: 'bold',
  },
  methodSubtitle: {
    fontSize: 14,
    color: COLORS.ITEM_TEXT,
  },
  paymentDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: COLORS.ITEM_BACKGROUND,
    borderRadius: 12,
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: COLORS.ITEM_TEXT,
  },
  detailValue: {
    fontSize: 16,
    color: COLORS.TEXT,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
});

export default PaymentScreen; 