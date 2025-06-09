import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, TextInput, FlatList, Dimensions, Clipboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/util/constant';
import { AntDesign, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useState, useMemo, useRef, useEffect } from 'react';
import { router } from 'expo-router';
import { useFavorites } from '@/context/FavoritesContext';
import Toast from 'react-native-toast-message';

// TODO: API Integration Notes
// 1. Products API:
//    - GET /api/products - Lấy danh sách sản phẩm
//    - GET /api/products/categories - Lấy danh mục sản phẩm
//    - GET /api/products/toppings - Lấy danh sách topping
//    - GET /api/products/search?q={query} - Tìm kiếm sản phẩm

// 2. Banner API:
//    - GET /api/banners - Lấy danh sách banner

// 3. Discount API:
//    - GET /api/coupons - Lấy danh sách mã giảm giá
//    - POST /api/coupons/apply - Áp dụng mã giảm giá

// 4. Favorites API:
//    - GET /api/favorites - Lấy danh sách sản phẩm yêu thích
//    - POST /api/favorites/{productId} - Thêm/xóa sản phẩm yêu thích

export const allProducts = [
  // TODO: Replace with API data
  // Cà phê
  { id: 1, name: 'Cà phê nóng', subtitle: 'Cà phê nguyên chất', image: require('@/assets/Food/Hotcoffee.jpg'), price: '25.000', rating: 4.5, category: 'Cà phê' },
  { id: 2, name: 'Cà phê đá', subtitle: 'Cà phê thêm đá', image: require('@/assets/Food/Coffee.jpg'), price: '25.000', rating: 4.2, category: 'Cà phê' },
  { id: 3, name: 'Cà phê sữa', subtitle: 'Cà phê sữa đá', image: require('@/assets/Food/Coffeemilk.jpg'), price: '25.000', rating: 4.0, category: 'Cà phê' },
  
  // Trà
  { id: 4, name: 'Trà đào', subtitle: 'Trà trái cây', image: require('@/assets/Food/Dao.jpg'), price: '25.000', rating: 4.5, category: 'Trà' },
  { id: 5, name: 'Trà vải', subtitle: 'Trà trái cây', image: require('@/assets/Food/Vaihoahong.jpg'), price: '25.000', rating: 4.4, category: 'Trà' },
  { id: 6, name: 'Trà chanh dây', subtitle: 'Trà trái cây', image: require('@/assets/Food/Lemon.webp'), price: '25.000', rating: 4.1, category: 'Trà' },
  { id: 7, name: 'Trà bưởi', subtitle: 'Trà trái cây', image: require('@/assets/Food/Buoi.webp'), price: '25.000', rating: 4.6, category: 'Trà' },
  { id: 8, name: 'Trà dứa', subtitle: 'Trà trái cây', image: require('@/assets/Food/Tradua.jpg'), price: '25.000', rating: 4.0, category: 'Trà' },
  { id: 9, name: 'Trà mật ong', subtitle: 'Trà', image: require('@/assets/Food/Lemon2.webp'), price: '25.000', rating: 4.3, category: 'Trà' },
  { id: 20, name: 'Trà dâu tằm', subtitle: 'Trà trái cây', image: require('@/assets/Food/Dau2.jpg'), price: '25.000', rating: 4.7, category: 'Trà' },

  // Trà sữa
  { id: 10, name: 'Trà sữa nóng', subtitle: 'Trà sữa', image: require('@/assets/Food/Tranchauden.jpg'), price: '25.000', rating: 4.3, category: 'Trà sữa' },
  { id: 11, name: 'Trà sữa socola', subtitle: 'Trà sữa', image: require('@/assets/Food/Socola.jpg'), price: '25.000', rating: 4.6, category: 'Trà sữa' },
  { id: 12, name: 'Trà sữa khoai', subtitle: 'Trà sữa', image: require('@/assets/Food/Khoaimon.webp'), price: '25.000', rating: 4.4, category: 'Trà sữa' },
  { id: 13, name: 'Matcha latte', subtitle: 'Trà sữa', image: require('@/assets/Food/Mattcha.jpg'), price: '25.000', rating: 4.5, category: 'Trà sữa' },

  // Sinh tố
  { id: 14, name: 'Sinh tố cầu gai', subtitle: 'Sinh tố', image: require('@/assets/Food/Mangcau.webp'), price: '25.000', rating: 4.3, category: 'Sinh tố' },
  { id: 15, name: 'Sinh tố dâu', subtitle: 'Sinh tố', image: require('@/assets/Food/Dau.jpg'), price: '25.000', rating: 4.6, category: 'Sinh tố' },
  { id: 16, name: 'Sinh tố xoài', subtitle: 'Sinh tố', image: require('@/assets/Food/Mango.jpg'), price: '25.000', rating: 4.8, category: 'Sinh tố' },
  { id: 17, name: 'Sinh tố bơ', subtitle: 'Sinh tố', image: require('@/assets/Food/Bo.jpg'), price: '25.000', rating: 4.5, category: 'Sinh tố' },

  // Nước ép
  { id: 18, name: 'Cam tươi', subtitle: 'Nước ép', image: require('@/assets/Food/Orange.jpg'), price: '25.000', rating: 4.7, category: 'Nước ép' },
  { id: 19, name: 'Dứa tươi', subtitle: 'Nước ép', image: require('@/assets/Food/Pine.jpg'), price: '25.000', rating: 4.2, category: 'Nước ép' },

  // Đá xay
  { id: 21, name: 'Matcha đá xay', subtitle: 'Đá xay', image: require('@/assets/Food/Matcha.webp'), price: '25.000', rating: 4.5, category: 'Đá xay' },
];

export const toppings = [
  // TODO: Replace with API data
  { id: 1, name: 'Trân châu đen', subtitle: 'Trân châu giòn ngon', image: require('@/assets/Food/Tranchauden.webp'), price: '3.000' },
  { id: 2, name: 'Thạch dừa', subtitle: 'Thạch dừa siêu ngọt', image: require('@/assets/Food/Thach.webp'), price: '3.000' },
  { id: 3, name: 'Sương sáo', subtitle: 'Sương sáo dai ngọt', image: require('@/assets/Food/Sao.jpg'), price: '3.000' },
  { id: 4, name: 'Hạt lựu', subtitle: 'Hạt lựu ngọt ngào', image: require('@/assets/Food/Nade.jpg'), price: '3.000' },
  { id: 5, name: 'Đá viên', subtitle: 'Đá thêm', image: require('@/assets/Food/Ice.png'), price: '3.000' },
  { id: 6, name: 'Sữa đặc', subtitle: 'Sữa đặc ngọt ngào', image: require('@/assets/Food/Milk.jpg'), price: '3.000' },
];

const categories = [
  // TODO: Replace with API data
  'All', 'Cà phê', 'Trà', 'Trà sữa', 'Sinh tố', 'Nước ép', 'Đá xay', 'Topping'
];

const banners = [
  // TODO: Replace with API data
  require('@/assets/banner/banner1.jpg'),
  require('@/assets/banner/banner2.jpg'),
  require('@/assets/banner/banner3.png'),
  require('@/assets/banner/banner4.png'),
];

const discountData = [
  // TODO: Replace with API data
  {
    id: 1,
    image: require('@/assets/discount/discount1.jpg'),
    code: 'TINTIN50',
    details: 'Giảm 50% cho đơn hàng từ 100.000đ',
    status: 'Còn hạn',
    expiryDate: '31/12/2025'
  },
  {
    id: 2,
    image: require('@/assets/discount/discount2.jpg'),
    code: 'TINTIN30',
    details: 'Giảm 30% cho đơn hàng từ 50.000đ',
    status: 'Còn hạn',
    expiryDate: '01/12/2025'
  },
  {
    id: 3,
    image: require('@/assets/discount/discount3.jpg'),
    code: 'TINTIN20',
    details: 'Giảm 20% cho đơn hàng từ 30.000đ',
    status: 'Còn hạn',
    expiryDate: '31/12/2028'
  },
  {
    id: 4,
    image: require('@/assets/discount/discount4.jpg'),
    code: 'TINTIN10',
    details: 'Giảm 10% cho đơn hàng từ 20.000đ',
    status: 'Còn hạn',
    expiryDate: '31/10/2025'
  },
  {
    id: 5,
    image: require('@/assets/discount/discount5.jpg'),
    code: 'TINTIN15',
    details: 'Giảm 15% cho đơn hàng từ 40.000đ',
    status: 'Còn hạn',
    expiryDate: '20/12/2025'
  },
  {
    id: 6,
    image: require('@/assets/discount/discount6.jpg'),
    code: 'TINTIN25',
    details: 'Giảm 25% cho đơn hàng từ 60.000đ',
    status: 'Còn hạn',
    expiryDate: '31/12/2025'
  },
  {
    id: 7,
    image: require('@/assets/discount/discount7.jpg'),
    code: 'TINTIN40',
    details: 'Giảm 40% cho đơn hàng từ 80.000đ',
    status: 'Còn hạn',
    expiryDate: '31/12/2025'
  },
  {
    id: 8,
    image: require('@/assets/discount/discount8.jpg'),
    code: 'TINTIN60',
    details: 'Giảm 60% cho đơn hàng từ 150.000đ',
    status: 'Còn hạn',
    expiryDate: '31/12/2025'
  },
];

export default function HomeScreen() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchText, setSearchText] = useState('');
  const [activeBanner, setActiveBanner] = useState(0);
  const bannerScrollRef = useRef<ScrollView>(null);
  const mainScrollRef = useRef<ScrollView>(null);
  const discountSectionRef = useRef<View>(null);
  const { favorites, favoriteToppings, toggleFavorite, toggleFavoriteTopping } = useFavorites();

  // TODO: Add useEffect to fetch data from APIs
  useEffect(() => {
    // Fetch products
    // Fetch categories
    // Fetch banners
    // Fetch discounts
    // Fetch favorites
  }, []);

  // Auto scroll banner
  useEffect(() => {
    const timer = setInterval(() => {
      const nextBanner = (activeBanner + 1) % banners.length;
      bannerScrollRef.current?.scrollTo({
        x: nextBanner * Dimensions.get('window').width,
        animated: true,
      });
      setActiveBanner(nextBanner);
    }, 3000);

    return () => clearInterval(timer);
  }, [activeBanner]);

  const handlePrevBanner = () => {
    const prevBanner = (activeBanner - 1 + banners.length) % banners.length;
    bannerScrollRef.current?.scrollTo({
      x: prevBanner * Dimensions.get('window').width,
      animated: true,
    });
    setActiveBanner(prevBanner);
  };

  const handleNextBanner = () => {
    const nextBanner = (activeBanner + 1) % banners.length;
    bannerScrollRef.current?.scrollTo({
      x: nextBanner * Dimensions.get('window').width,
      animated: true,
    });
    setActiveBanner(nextBanner);
  };

  const filteredProducts = useMemo(() => {
    let filtered = allProducts;
    
    // Filter by category
    if (activeCategory !== 'All') {
      filtered = filtered.filter(product => product.category === activeCategory);
    }
    
    // Filter by search text
    if (searchText.trim()) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchLower) ||
        product.subtitle.toLowerCase().includes(searchLower)
      );
    }
    
    return filtered;
  }, [activeCategory, searchText]);

  const renderProductItem = ({ item }: { item: typeof allProducts[0] }) => (
    <TouchableOpacity style={styles.productCard}>
      <Image source={item.image} style={styles.productImage} />
      <TouchableOpacity 
        style={styles.favoriteButton}
        onPress={() => toggleFavorite(item.id)}
      >
        <AntDesign 
          name={favorites.includes(item.id) ? "heart" : "hearto"} 
          size={16} 
          color={favorites.includes(item.id) ? "#FF0000" : "#FFFFFF"} 
        />
      </TouchableOpacity>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productSubtitle}>{item.subtitle}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.productPrice}>{item.price} VNĐ</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push({ pathname: "/product/detail", params: { product: JSON.stringify(item) } })}
          >
            <AntDesign name="plus" size={16} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderToppingItem = ({ item }: { item: typeof toppings[0] }) => (
    <TouchableOpacity style={styles.toppingCard}>
      <Image source={item.image} style={styles.toppingImage} />
      <TouchableOpacity 
        style={styles.favoriteButton}
        onPress={() => toggleFavoriteTopping(item.id)}
      >
        <AntDesign 
          name={favoriteToppings.includes(item.id) ? "heart" : "hearto"} 
          size={16} 
          color={favoriteToppings.includes(item.id) ? "#FF0000" : "#FFFFFF"} 
        />
      </TouchableOpacity>
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

  const handleBannerPress = () => {
    discountSectionRef.current?.measure((x, y, width, height, pageX, pageY) => {
      mainScrollRef.current?.scrollTo({
        y: pageY,
        animated: true
      });
    });
  };

  const renderBanner = () => {
    return (
      <View style={styles.bannerContainer}>
        <ScrollView
          ref={bannerScrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const slide = Math.ceil(
              event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width
            );
            if (slide !== activeBanner) {
              setActiveBanner(slide);
            }
          }}
        >
          {banners.map((banner, index) => (
            <TouchableOpacity
              key={index}
              onPress={handleBannerPress}
              activeOpacity={0.9}
            >
              <Image
                source={banner}
                style={styles.bannerImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        {/* Navigation Buttons */}
        <TouchableOpacity 
          style={[styles.navButton, styles.leftButton]} 
          onPress={handlePrevBanner}
        >
          <AntDesign name="left" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.navButton, styles.rightButton]} 
          onPress={handleNextBanner}
        >
          <AntDesign name="right" size={24} color="white" />
        </TouchableOpacity>

        <View style={styles.pagination}>
          {banners.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                index === activeBanner && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>
      </View>
    );
  };

  const handleCopyCode = (code: string) => {
    Clipboard.setString(code);
    Toast.show({
      type: 'success',
      text1: 'Sao chép thành công',
      text2: `Mã ${code} đã được sao chép vào clipboard`,
      position: 'bottom',
      visibilityTime: 2000,
    });
  };

  const renderDiscountSection = () => {
    return (
      <View ref={discountSectionRef} style={styles.discountSection}>
        <Text style={styles.sectionTitle}>Mã giảm giá</Text>
        <FlatList
          data={discountData}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.discountCard}>
              <Image source={item.image} style={styles.discountImage} resizeMode="cover" />
              <View style={styles.discountInfo}>
                <View style={styles.codeContainer}>
                  <Text style={styles.discountCode}>{item.code}</Text>
                  <TouchableOpacity 
                    style={styles.copyButton}
                    onPress={() => handleCopyCode(item.code)}
                  >
                    <MaterialIcons name="content-copy" size={20} color={COLORS.PRIMARY} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.discountDetails}>{item.details}</Text>
                <View style={styles.discountFooter}>
                  <View style={styles.statusContainer}>
                    <View style={[styles.statusDot, { backgroundColor: '#4CAF50' }]} />
                    <Text style={styles.statusText}>{item.status}</Text>
                  </View>
                  <Text style={styles.expiryDate}>HSD: {item.expiryDate}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.discountList}
        />
      </View>
    );
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

      <ScrollView 
        ref={mainScrollRef}
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
      >
        {renderBanner()}

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

        {renderContent()}

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

        {renderDiscountSection()}
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
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
    padding: 8,
    zIndex: 1,
  },
  bannerContainer: {
    height: 180,
    marginBottom: 16,
    position: 'relative',
    paddingHorizontal: 16,
  },
  bannerImage: {
    width: Dimensions.get('window').width - 32,
    height: 180,
    borderRadius: 12,
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -20 }],
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
    padding: 8,
    zIndex: 2,
  },
  leftButton: {
    left: 26,
  },
  rightButton: {
    right: 26,
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 15,
    alignSelf: 'center',
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 3,
  },
  paginationDotActive: {
    backgroundColor: COLORS.PRIMARY,
  },
  discountSection: {
    marginTop: 20,
    marginBottom: 30,
  },
  discountCard: {
    backgroundColor: COLORS.ITEM_BACKGROUND,
    borderRadius: 12,
    marginHorizontal: 8,
    marginBottom: 16,
    width: 280,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  discountImage: {
    width: '100%',
    height: 120,
  },
  discountInfo: {
    padding: 12,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  discountCode: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  copyButton: {
    padding: 4,
  },
  discountDetails: {
    fontSize: 14,
    color: COLORS.TEXT,
    marginBottom: 8,
  },
  discountFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    color: '#4CAF50',
  },
  expiryDate: {
    fontSize: 12,
    color: COLORS.ITEM_TEXT,
  },
  discountList: {
    paddingHorizontal: 8,
    marginBottom: 20,
  },
});
