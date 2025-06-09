import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { COLORS } from '@/util/constant';
import { useCart } from '@/context/CartContext';
import Toast from 'react-native-toast-message';

const DetailScreen = () => {
  const params = useLocalSearchParams();
  const product = JSON.parse(params.product as string);

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('S');
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [selectedIce, setSelectedIce] = useState('vừa');
  const [selectedSugar, setSelectedSugar] = useState('vừa');
  const [totalPrice, setTotalPrice] = useState(parseFloat(product.price.replace('.', '')) || 0);

  const { addItem } = useCart();

  const sizePrices: { [key: string]: number } = {
    S: 25000,
    M: 27000,
    L: 30000,
  };

  const toppingPrices: { [key: string]: number } = {
    'Trân châu': 3000,
    'Thạch dừa': 3000,
    'Sương sáo': 3000,
    'Hạt lựu': 3000,
  };

  useEffect(() => {
    let currentPrice = sizePrices[selectedSize];
    selectedToppings.forEach(topping => {
      currentPrice += toppingPrices[topping];
    });
    setTotalPrice(currentPrice * quantity);
  }, [quantity, selectedSize, selectedToppings]);

  const handleAddToCart = () => {
    let calculatedToppingPrice = 0;
    selectedToppings.forEach(topping => {
      calculatedToppingPrice += toppingPrices[topping];
    });

    const cartItem = {
      id: Date.now().toString(),
      name: product.name,
      quantity: quantity,
      price: product.price,
      size: selectedSize,
      ice: selectedIce,
      sugar: selectedSugar,
      toppings: selectedToppings,
      toppingPrice: calculatedToppingPrice,
    };

    addItem(cartItem);
    
    Toast.show({
      type: 'success',
      text1: 'Thêm vào giỏ hàng thành công!',
      text2: `${product.name} đã được thêm vào giỏ hàng của bạn.`
    });

    // Reset state variables to initial values
    setQuantity(1);
    setSelectedSize('S');
    setSelectedToppings([]);
    setSelectedIce('vừa');
    setSelectedSugar('vừa');
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView style={styles.contentContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color={COLORS.TEXT} />
        </TouchableOpacity>
        <View style={styles.productHeader}>
          <Image source={product.image} style={styles.productImage} />
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productRating}>{product.rating} K đã bán</Text>
            <Text style={styles.productLikes}>4 K đã thích</Text>
            <View style={styles.quantityControl}>
              <TouchableOpacity onPress={() => setQuantity(prev => Math.max(1, prev - 1))}>
                <AntDesign name="minuscircleo" size={24} color="orange" />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity onPress={() => setQuantity(prev => prev + 1)}>
                <AntDesign name="pluscircleo" size={24} color="orange" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Size</Text>
          <View style={styles.optionsContainer}>
            {Object.keys(sizePrices).map(size => (
              <TouchableOpacity
                key={size}
                style={[styles.optionButton, selectedSize === size && styles.selectedOptionButton]}
                onPress={() => setSelectedSize(size)}
              >
                <Text style={[styles.optionText, selectedSize === size && styles.selectedOptionText]}>{size}</Text>
                <Text style={styles.optionPrice}>{sizePrices[size].toLocaleString('vi-VN')} VNĐ</Text>
                {selectedSize === size && <AntDesign name="checksquare" size={20} color="orange" style={styles.checkIcon} />}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Topping</Text>
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={[styles.optionButton, { justifyContent: 'flex-start' }, selectedIce !== 'none' && styles.selectedOptionButton]}
              onPress={() => setSelectedIce('none')}
            >
              <Text style={styles.optionText}>Đá</Text>
              <Text style={styles.optionPrice}>0 VNĐ</Text>
              <View style={styles.subOptionsContainer}>
                {['ít', 'vừa', 'nhiều'].map(option => (
                  <TouchableOpacity
                    key={option}
                    style={[styles.subOptionButton, selectedIce === option && styles.selectedSubOptionButton]}
                    onPress={() => setSelectedIce(option)}
                  >
                    <Text style={[styles.subOptionText, selectedIce === option && styles.selectedSubOptionText]}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              {selectedIce !== 'none' && <AntDesign name="checksquare" size={20} color="orange" style={styles.checkIcon} />}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionButton, { justifyContent: 'flex-start' }, selectedSugar !== 'none' && styles.selectedOptionButton]}
              onPress={() => setSelectedSugar('none')}
            >
              <Text style={styles.optionText}>Đường</Text>
              <Text style={styles.optionPrice}>0 VNĐ</Text>
              <View style={styles.subOptionsContainer}>
                {['ít', 'vừa', 'nhiều'].map(option => (
                  <TouchableOpacity
                    key={option}
                    style={[styles.subOptionButton, selectedSugar === option && styles.selectedSubOptionButton]}
                    onPress={() => setSelectedSugar(option)}
                  >
                    <Text style={[styles.subOptionText, selectedSugar === option && styles.selectedSubOptionText]}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              {selectedSugar !== 'none' && <AntDesign name="checksquare" size={20} color="orange" style={styles.checkIcon} />}
            </TouchableOpacity>
            {Object.keys(toppingPrices).map(topping => (
              <TouchableOpacity
                key={topping}
                style={[styles.optionButton, selectedToppings.includes(topping) && styles.selectedOptionButton]}
                onPress={() => {
                  setSelectedToppings(prev =>
                    prev.includes(topping)
                      ? prev.filter(item => item !== topping)
                      : [...prev, topping]
                  );
                }}
              >
                <Text style={[styles.optionText, selectedToppings.includes(topping) && styles.selectedOptionText]}>{topping}</Text>
                <Text style={styles.optionPrice}>{toppingPrices[topping].toLocaleString('vi-VN')} VNĐ</Text>
                {selectedToppings.includes(topping) && <AntDesign name="checksquare" size={20} color="orange" style={styles.checkIcon} />}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.totalPriceText}>Tổng giá</Text>
        <Text style={styles.totalPriceValue}>{totalPrice.toLocaleString('vi-VN')} VNĐ</Text>
        <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
          <Text style={styles.addToCartButtonText}>Thêm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  backButton: {
    marginTop: 20,
    marginBottom: 10,
  },
  productHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  productImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginRight: 15,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.TEXT,
    marginBottom: 5,
  },
  productRating: {
    fontSize: 14,
    color: COLORS.ITEM_TEXT,
    marginBottom: 3,
  },
  productLikes: {
    fontSize: 14,
    color: COLORS.ITEM_TEXT,
    marginBottom: 10,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT,
    marginHorizontal: 15,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT,
    marginBottom: 10,
  },
  optionsContainer: {
    flexDirection: 'column',
  },
  optionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.ITEM_BACKGROUND,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedOptionButton: {
    borderColor: COLORS.PRIMARY,
  },
  optionText: {
    fontSize: 16,
    color: COLORS.TEXT,
    fontWeight: 'bold',
  },
  selectedOptionText: {
    color: COLORS.PRIMARY,
  },
  optionPrice: {
    fontSize: 16,
    color: COLORS.ITEM_TEXT,
    marginLeft: 10,
  },
  checkIcon: {
    marginLeft: 'auto',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: COLORS.ITEM_BACKGROUND,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  totalPriceText: {
    fontSize: 16,
    color: COLORS.ITEM_TEXT,
  },
  totalPriceValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  addToCartButton: {
    backgroundColor: 'orange',
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  addToCartButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  optionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  subOptionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  subOptionButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'transparent',
    marginLeft: 5,
  },
  selectedSubOptionButton: {
    borderColor: COLORS.PRIMARY,
  },
  subOptionText: {
    fontSize: 14,
    color: COLORS.TEXT,
    fontWeight: 'bold',
  },
  selectedSubOptionText: {
    color: COLORS.PRIMARY,
  },
});

export default DetailScreen; 