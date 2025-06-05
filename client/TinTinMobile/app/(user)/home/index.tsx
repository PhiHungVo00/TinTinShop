import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/util/constant';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { useState, useMemo } from 'react';

const allProducts = [
  // Cà phê
  { id: 1, name: 'Cà phê nóng', subtitle: 'Cà phê nguyên chất', image: require('@/assets/Food/Hotcoffee.jpg'), price: '25.000', rating: 4.5, category: 'Cà phê' },
  { id: 2, name: 'Cà phê đá', subtitle: 'Cà phê thêm đá', image: require('@/assets/Food/Coffee.jpg'), price: '20.000', rating: 4.2, category: 'Cà phê' },
  { id: 3, name: 'Cà phê sữa', subtitle: 'Cà phê sữa đá', image: require('@/assets/Food/Coffeemilk.jpg'), price: '25.000', rating: 4.0, category: 'Cà phê' },
  
  // Trà
  { id: 4, name: 'Trà đào', subtitle: 'Trà trái cây', image: require('@/assets/Food/Dao.jpg'), price: '35.000', rating: 4.5, category: 'Trà' },
  { id: 5, name: 'Trà vải', subtitle: 'Trà trái cây', image: require('@/assets/Food/Vaihoahong.jpg'), price: '35.000', rating: 4.4, category: 'Trà' },
  { id: 6, name: 'Trà chanh dây', subtitle: 'Trà trái cây', image: require('@/assets/Food/Lemon.webp'), price: '25.000', rating: 4.1, category: 'Trà' },
  { id: 7, name: 'Trà bưởi', subtitle: 'Trà trái cây', image: require('@/assets/Food/Buoi.webp'), price: '35.000', rating: 4.6, category: 'Trà' },
  { id: 8, name: 'Trà dứa', subtitle: 'Trà trái cây', image: require('@/assets/Food/Tradua.jpg'), price: '30.000', rating: 4.0, category: 'Trà' },
  { id: 9, name: 'Trà mật ong', subtitle: 'Trà', image: require('@/assets/Food/Lemon2.webp'), price: '30.000', rating: 4.3, category: 'Trà' },
  { id: 20, name: 'Trà dâu tằm', subtitle: 'Trà trái cây', image: require('@/assets/Food/Dau2.jpg'), price: '40.000', rating: 4.7, category: 'Trà' },

  // Trà sữa
  { id: 10, name: 'Trà sữa nóng', subtitle: 'Trà sữa', image: require('@/assets/Food/Tranchauden.jpg'), price: '30.000', rating: 4.3, category: 'Trà sữa' },
  { id: 11, name: 'Trà sữa socola', subtitle: 'Trà sữa', image: require('@/assets/Food/Socola.jpg'), price: '40.000', rating: 4.6, category: 'Trà sữa' },
  { id: 12, name: 'Trà sữa khoai', subtitle: 'Trà sữa', image: require('@/assets/Food/Khoaimon.webp'), price: '40.000', rating: 4.4, category: 'Trà sữa' },
  { id: 13, name: 'Matcha latte', subtitle: 'Trà sữa', image: require('@/assets/Food/Mattcha.jpg'), price: '35.000', rating: 4.5, category: 'Trà sữa' },

  // Sinh tố
  { id: 14, name: 'Sinh tố cầu gai', subtitle: 'Sinh tố', image: require('@/assets/Food/Mangcau.webp'), price: '40.000', rating: 4.3, category: 'Sinh tố' },
  { id: 15, name: 'Sinh tố dâu', subtitle: 'Sinh tố', image: require('@/assets/Food/Dau.jpg'), price: '30.000', rating: 4.6, category: 'Sinh tố' },
  { id: 16, name: 'Sinh tố xoài', subtitle: 'Sinh tố', image: require('@/assets/Food/Mango.jpg'), price: '40.000', rating: 4.8, category: 'Sinh tố' },
  { id: 17, name: 'Sinh tố bơ', subtitle: 'Sinh tố', image: require('@/assets/Food/Bo.jpg'), price: '40.000', rating: 4.5, category: 'Sinh tố' },

  // Nước ép
  { id: 18, name: 'Cam tươi', subtitle: 'Nước ép', image: require('@/assets/Food/Orange.jpg'), price: '25.000', rating: 4.7, category: 'Nước ép' },
  { id: 19, name: 'Dứa tươi', subtitle: 'Nước ép', image: require('@/assets/Food/Pine.jpg'), price: '25.000', rating: 4.2, category: 'Nước ép' },

  // Đá xay
  { id: 21, name: 'Matcha đá xay', subtitle: 'Đá xay', image: require('@/assets/Food/Matcha.webp'), price: '40.000', rating: 4.5, category: 'Đá xay' },
];

const toppings = [
  { id: 1, name: 'Trân châu đen', subtitle: 'Trân châu giòn ngon', image: require('@/assets/Food/Tranchauden.webp'), price: '3.000' },
  { id: 2, name: 'Thạch dừa', subtitle: 'Thạch dừa siêu ngọt', image: require('@/assets/Food/Thach.webp'), price: '3.000' },
  { id: 3, name: 'Sương sáo', subtitle: 'Sương sáo dai ngọt', image: require('@/assets/Food/Sao.jpg'), price: '5.000' },
  { id: 4, name: 'Hạt lựu', subtitle: 'Hạt lựu ngọt ngào', image: require('@/assets/Food/Nade.jpg'), price: '7.000' },
  { id: 5, name: 'Đá viên', subtitle: 'Đá thêm', image: require('@/assets/Food/Ice.png'), price: '3.000' },
];

const categories = ['All', 'Cà phê', 'Trà', 'Trà sữa', 'Sinh tố', 'Nước ép', 'Đá xay', 'Topping'];

export default function HomeScreen() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchText, setSearchText] = useState('');

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'All') {
      return allProducts;
    }
    return allProducts.filter(product => product.category === activeCategory);
  }, [activeCategory]);

  const renderProductItem = ({ item }: { item: typeof allProducts[0] }) => (
    <TouchableOpacity style={styles.productCard}>
      <Image source={item.image} style={styles.productImage} />
      {item.rating && (
        <View style={styles.ratingContainer}>
          <FontAwesome name="star" size={12} color="#FFD700" />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
      )}
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productSubtitle}>{item.subtitle}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.productPrice}>{item.price} VNĐ</Text>
          <TouchableOpacity style={styles.addButton}>
            <AntDesign name="plus" size={16} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderToppingItem = ({ item }: { item: typeof toppings[0] }) => (
    <TouchableOpacity style={styles.toppingCard}>
      <Image source={item.image} style={styles.toppingImage} />
      <View style={styles.toppingInfo}>
        <Text style={styles.toppingName}>{item.name}</Text>
        <Text style={styles.toppingSubtitle}>{item.subtitle}</Text>
        <Text style={styles.toppingPrice}>{item.price} VNĐ</Text>
      </View>
    </TouchableOpacity>
  );

  const renderContent = () => {
    if (activeCategory === 'Topping') {
      return (
        <FlatList
          data={toppings}
          renderItem={renderToppingItem}
          keyExtractor={(item) => item.id.toString()}
          horizontal={false} 
          numColumns={2} 
          scrollEnabled={false}
          columnWrapperStyle={styles.row}
        />
      );
    } else {
      return (
        <FlatList
          data={filteredProducts}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          scrollEnabled={false}
          columnWrapperStyle={styles.row}
        />
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <AntDesign name="appstore1" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>TINTIN-Thế giới đồ uống</Text>
        <TouchableOpacity>
          <Image source={require('@/assets/images/icon.png')} style={styles.userIcon} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <AntDesign name="search1" size={20} color="gray" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm đồ uống..."
          placeholderTextColor="gray"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <View style={styles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[styles.categoryButton, activeCategory === category && styles.activeCategoryButton]}
              onPress={() => setActiveCategory(category)}
            >
              <Text style={[styles.categoryText, activeCategory === category && styles.activeCategoryText]}>
                {category}
              </Text>
              {activeCategory === category && <View style={styles.activeCategoryIndicator} />}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderContent()}

        {}
        {activeCategory !== 'Topping' && toppings.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Topping kèm theo</Text>
            <FlatList
              data={toppings}
              renderItem={renderToppingItem}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.toppingList}
            />
          </>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.BACKGROUND,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.TEXT,
  },
  userIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.ITEM_BACKGROUND,
    borderRadius: 25,
    marginHorizontal: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.TEXT,
    paddingVertical: 0,
  },
  categoriesContainer: {
    marginBottom: 16,
    paddingLeft: 16,
  },
  categoryButton: {
    marginRight: 20,
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    alignItems: 'center',
  },
  activeCategoryButton: {
    borderBottomColor: COLORS.PRIMARY,
  },
  categoryText: {
    fontSize: 16,
    color: COLORS.ITEM_TEXT,
  },
  activeCategoryText: {
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
  },
  activeCategoryIndicator: {
    height: 2,
    backgroundColor: COLORS.PRIMARY,
    width: '100%',
    position: 'absolute',
    bottom: -2,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 8,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  productCard: {
    flex: 1,
    backgroundColor: COLORS.ITEM_BACKGROUND,
    borderRadius: 12,
    marginHorizontal: 8,
    marginBottom: 16,
    paddingBottom: 12,
    maxWidth: '48%', 
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  ratingText: {
    color: '#FFD700',
    fontSize: 10,
    marginLeft: 4,
    fontWeight: 'bold',
  },
  productInfo: {
    paddingHorizontal: 12,
    width: '100%',
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.TEXT,
    marginBottom: 4,
  },
  productSubtitle: {
    fontSize: 12,
    color: COLORS.ITEM_TEXT,
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginRight: 4,
  },
  addButton: {
    backgroundColor: 'orange',
    borderRadius: 20,
    padding: 6,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
  },
  toppingList: {
    paddingHorizontal: 8,
    marginBottom: 20,
  },
  toppingCard: {
    backgroundColor: COLORS.ITEM_BACKGROUND,
    borderRadius: 12,
    marginHorizontal: 8,
    marginBottom: 16,
    padding: 10,
    width: 140,
    alignItems: 'center',
  },
  toppingImage: {
    width: '100%',
    height: 90,
    borderRadius: 8,
    marginBottom: 8,
  },
  toppingInfo: {
    width: '100%',
  },
  toppingName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.TEXT,
    marginBottom: 4,
  },
  toppingSubtitle: {
    fontSize: 11,
    color: COLORS.ITEM_TEXT,
    marginBottom: 4,
  },
  toppingPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
});
