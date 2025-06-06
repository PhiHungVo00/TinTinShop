import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/util/constant';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';

const PaymentScreen = () => {
  const totalAmount = '35.000'; 
  const walletBalance = '18.000'; 

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <AntDesign name="left" size={24} color={COLORS.TEXT} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thanh toán</Text>
        <View style={{ width: 24 }} />{/* Placeholder for spacing */}
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Credit Card Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Thẻ tín dụng</Text>
          <View style={styles.creditCard}>
            <Image 
              source={require('@/assets/images/store/chip.png')}
              style={styles.chipIcon}
            />
            <Image 
              source={require('@/assets/images/store/visa.png')}
              style={styles.visaLogo}
            />
            <Text style={styles.cardNumber}>3897   8923   6745   4638</Text>
            <View style={styles.cardDetailsRow}>
              <View>
                <Text style={styles.cardLabel}>Card Holder Name</Text>
                <Text style={styles.cardValue}>Do Hoang Hieu</Text>
              </View>
              <View>
                <Text style={styles.cardLabel}>Expiry Date</Text>
                <Text style={styles.cardValue}>02/30</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Other Payment Options */}
        <View style={styles.sectionContainer}>
          <TouchableOpacity style={styles.paymentOptionButton}>
            <View style={styles.paymentOptionLeft}>
              <Image 
                source={require('@/assets/images/store/wallet.png')}
                style={styles.paymentOptionIcon}
              />
              <Text style={styles.paymentOptionText}>Wallet</Text>
            </View>
            <Text style={styles.paymentOptionValue}>{walletBalance} VNĐ</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.paymentOptionButton}>
            <View style={styles.paymentOptionLeft}>
              <Image 
                source={require('@/assets/images/store/googlepay.png')}
                style={styles.paymentOptionIcon}
              />
              <Text style={styles.paymentOptionText}>Google Pay</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.paymentOptionButton}>
            <View style={styles.paymentOptionLeft}>
              <Image 
                source={require('@/assets/images/store/applepay.png')}
                style={styles.paymentOptionIcon}
              />
              <Text style={styles.paymentOptionText}>Apple Pay</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.paymentOptionButton}>
            <View style={styles.paymentOptionLeft}>
              <Image 
                source={require('@/assets/images/store/amazonpay.png')}
                style={styles.paymentOptionIcon}
              />
              <Text style={styles.paymentOptionText}>Amazon Pay</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Footer - Total and Pay Button */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.totalLabel}>Giá</Text>
          <Text style={styles.totalAmount}>{totalAmount} VNĐ</Text>
        </View>
        <TouchableOpacity style={styles.payButton}>
          <Text style={styles.payButtonText}>Thanh toán bằng thẻ</Text>
        </TouchableOpacity>
      </View>
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
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.TEXT,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT,
    marginBottom: 12,
  },
  creditCard: {
    backgroundColor: COLORS.ITEM_BACKGROUND,
    borderRadius: 12,
    padding: 20,
    borderColor: 'orange',
    borderWidth: 1,
  },
  chipIcon: {
    width: 40,
    height: 30,
    marginBottom: 20,
  },
  visaLogo: {
    width: 50,
    height: 20,
    position: 'absolute',
    top: 25,
    right: 20,
  },
  cardNumber: {
    fontSize: 18,
    color: COLORS.TEXT,
    marginBottom: 20,
    letterSpacing: 2,
  },
  cardDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardLabel: {
    fontSize: 12,
    color: COLORS.ITEM_TEXT,
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 14,
    color: COLORS.TEXT,
    fontWeight: 'bold',
  },
  paymentOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.ITEM_BACKGROUND,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  paymentOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentOptionIcon: {
      width: 24,
      height: 24,
      marginRight: 12,
  },
  paymentOptionText: {
    fontSize: 16,
    color: COLORS.TEXT,
    marginLeft: 12,
  },
  paymentOptionValue: {
    fontSize: 16,
    color: COLORS.TEXT,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 9,
    borderTopWidth: 1,
    borderTopColor: COLORS.ITEM_BACKGROUND,
  },
  totalLabel: {
    fontSize: 14,
    color: COLORS.ITEM_TEXT,
  },
  totalAmount: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    paddingBottom: 2,
  },
  payButton: {
    backgroundColor: 'orange',
    borderRadius: 13,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  payButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PaymentScreen; 