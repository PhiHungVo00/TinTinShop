import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { GestureDetector, GestureHandlerRootView, Gesture } from 'react-native-gesture-handler';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  runOnJS 
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { callGetProducts, callGetCategories } from '@/config/api';
import { IProductResponseDTO } from '@/types/product';
import { ICategory } from '@/types/backend';
import HeaderList from '@/components/HeaderList';
import { COLORS } from '@/util/constant';

const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = 80;
const ACTION_WIDTH = 80;

interface GroupedProducts {
  [categoryId: string]: {
    category: ICategory;
    products: IProductResponseDTO[];
  };
}

interface SwipeableProductItemProps {
  product: IProductResponseDTO;
  onPressDetail: (productId: string) => void;
  onPriceManagement: (productId: string) => void;
  imageUrlBase: string;
  formatDate: (dateString: string) => string;
}

const SwipeableProductItem: React.FC<SwipeableProductItemProps> = ({
  product,
  onPressDetail,
  onPriceManagement,
  imageUrlBase,
  formatDate
}) => {
  const translateX = useSharedValue(0);
  const [isSwipeOpen, setIsSwipeOpen] = useState(false);

  const updateSwipeState = (isOpen: boolean) => {
    setIsSwipeOpen(isOpen);
  };

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate((event) => {
      // Chỉ cho phép swipe sang trái (translationX âm)
      if (event.translationX <= 0) {
        translateX.value = Math.max(event.translationX, -ACTION_WIDTH);
      }
    })
    .onEnd((event) => {
      if (event.translationX < -SWIPE_THRESHOLD) {
        // Mở action menu
        translateX.value = withSpring(-ACTION_WIDTH, {
          damping: 15,
          stiffness: 150,
        });
        runOnJS(updateSwipeState)(true);
      } else {
        // Đóng action menu
        translateX.value = withSpring(0, {
          damping: 15,
          stiffness: 150,
        });
        runOnJS(updateSwipeState)(false);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const closeSwipe = () => {
    translateX.value = withSpring(0, {
      damping: 15,
      stiffness: 150,
    });
    setIsSwipeOpen(false);
  };

  const handlePriceManagement = () => {
    closeSwipe();
    onPriceManagement(product.id);
  };

  const handleProductPress = () => {
    if (isSwipeOpen) {
      closeSwipe();
    } else {
      onPressDetail(product.id);
    }
  };

  return (
    <View style={styles.swipeContainer}>
      {/* Action Button (ẩn phía sau) */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.priceActionButton}
          onPress={handlePriceManagement}
          activeOpacity={0.8}
        >
          <View style={styles.priceActionContent}>
            <Text style={styles.priceActionIcon}>💰</Text>
            <Text style={styles.priceActionText}>Điều chỉnh{'\n'}giá</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Product Item (có thể swipe) */}
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            styles.productItemContainer,
            animatedStyle,
          ]}
        >
          <TouchableOpacity 
            style={styles.productItem}
            onPress={handleProductPress}
            activeOpacity={0.7}
          >
            <Image 
              source={{ uri: `${imageUrlBase}/product/${product.image}` }} 
              style={styles.productImage}
            />
            
            <View style={styles.productInfo}>
              <Text style={styles.productName} numberOfLines={1}>
                {product.name}
              </Text>
              <Text style={styles.productDescription} numberOfLines={2}>
                {product.description}
              </Text>
              <View style={styles.productMetaContainer}>
                <Text style={styles.productCategory}>
                  {product.category.name}
                </Text>
                <Text style={styles.productDate}>
                  {formatDate(product.createdAt)}
                </Text>
              </View>
            </View>
            
            <View style={styles.detailButton}>
              <Text style={styles.detailButtonText}>Chi tiết</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const IPV4 = process.env.EXPO_PUBLIC_IPV4;
const PORT = process.env.EXPO_PUBLIC_PORT;
const image_url_base = `http://${IPV4}:${PORT}/storage`;

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<IProductResponseDTO[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [groupedProducts, setGroupedProducts] = useState<GroupedProducts>({});
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const categoryRefs = useRef<{ [key: string]: number }>({});

  // Effects
  useEffect(() => {
    fetchData();
  }, []);

  // Data fetching
  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [categoriesResponse, productsResponse] = await Promise.all([
        callGetCategories({ filter: 'active:true' }),
        callGetProducts({ filter: 'active:true' })
      ]);

      const categoriesData = categoriesResponse.data || [];
      const productsData = productsResponse.data || [];

      setCategories(categoriesData);
      setProducts(productsData);
      setGroupedProducts(groupProductsByCategory(categoriesData, productsData));
      
      if (categoriesData.length > 0) {
        setActiveCategory(categoriesData[0].id);
      }
      
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const groupProductsByCategory = (categories: ICategory[], products: IProductResponseDTO[]): GroupedProducts => {
    const grouped: GroupedProducts = {};
    
    categories.forEach(category => {
      const categoryProducts = products.filter(
        product => product.category.id === category.id
      );
      
      if (categoryProducts.length > 0) {
        grouped[category.id] = {
          category,
          products: categoryProducts
        };
      }
    });

    return grouped;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Event handlers
  const handleScroll = useCallback((event: any) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    
    let currentCategory = '';
    Object.keys(categoryRefs.current).forEach(categoryId => {
      const position = categoryRefs.current[categoryId];
      if (scrollY >= position - 100) {
        currentCategory = categoryId;
      }
    });
    
    if (currentCategory && currentCategory !== activeCategory) {
      setActiveCategory(currentCategory);
    }
  }, [activeCategory]);

  const scrollToCategory = useCallback((categoryId: string) => {
    const position = categoryRefs.current[categoryId];
    if (position !== undefined && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: position, animated: true });
    }
  }, []);

  const navigateToProductDetail = useCallback((productId: string) => {
    router.push({
      pathname: "/management/products/ProductDetail",
      params: { id: productId }
    });
  }, [router]);

  const navigateToCreateProduct = useCallback(() => {
    router.push({ pathname: "/management/products/CreateProduct" });
  }, [router]);

  const navigateToPriceManagement = useCallback((productId: string) => {
    const path = "/management/products/variants" as const;


    router.push({
      pathname: path as any,
      params: { productId: productId }
    });
  }, [router]);

  // Render functions
  const renderProductItem = (product: IProductResponseDTO) => (
    <SwipeableProductItem
      key={product.id}
      product={product}
      onPressDetail={navigateToProductDetail}
      onPriceManagement={navigateToPriceManagement}
      imageUrlBase={image_url_base}
      formatDate={formatDate}
    />
  );

  const renderCategorySection = (categoryId: string, data: GroupedProducts[string]) => (
    <View 
      key={categoryId}
      onLayout={(event) => {
        categoryRefs.current[categoryId] = event.nativeEvent.layout.y;
      }}
    >
      <View style={styles.categoryHeader}>
        <Text style={styles.categoryTitle}>{data.category.name}</Text>
        <View style={styles.productCountBadge}>
          <Text style={styles.productCountText}>{data.products.length}</Text>
        </View>
      </View>
      
      <View style={styles.productsContainer}>
        {data.products.map(product => renderProductItem(product))}
      </View>
    </View>
  );

  const renderCategoryTabs = () => (
    <View style={styles.categoryTabsContainer}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryTabsContent}
      >
        {Object.keys(groupedProducts).map(categoryId => {
          const isActive = categoryId === activeCategory;
          const category = groupedProducts[categoryId].category;
          
          return (
            <TouchableOpacity
              key={categoryId}
              style={[
                styles.categoryTab,
                isActive && styles.activeCategoryTab
              ]}
              onPress={() => scrollToCategory(categoryId)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.categoryTabText,
                isActive && styles.activeCategoryTabText
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={COLORS.PRIMARY} />
      <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>Chưa có sản phẩm</Text>
      <Text style={styles.emptyDescription}>
        Hãy thêm sản phẩm đầu tiên để bắt đầu quản lý
      </Text>
      <TouchableOpacity 
        style={styles.addFirstProductButton}
        onPress={navigateToCreateProduct}
      >
        <Text style={styles.addFirstProductButtonText}>Thêm sản phẩm</Text>
      </TouchableOpacity>
    </View>
  );

  // Main render
  if (loading) {
    return renderLoadingState();
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <HeaderList
        title="Quản lý sản phẩm"
        backPress={() => router.back()}
        addPress={navigateToCreateProduct}
        containerStyle={{marginTop: 30}}
      />
      
      {Object.keys(groupedProducts).length > 0 ? (
        <>
          {renderCategoryTabs()}
          
          <ScrollView
            ref={scrollViewRef}
            style={styles.scrollView}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
          >
            {Object.keys(groupedProducts).map(categoryId => 
              renderCategorySection(categoryId, groupedProducts[categoryId])
            )}
          </ScrollView>
        </>
      ) : (
        renderEmptyState()
      )}
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  
  swipeContainer: {
    marginVertical: 6,
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 12,
  },
  
  actionContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: ACTION_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  priceActionButton: {
    width: ACTION_WIDTH,
    height: '100%',
    backgroundColor: COLORS.ITEM_BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  
  priceActionContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  priceActionIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  
  priceActionText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 12,
  },
  
  // Product Item Container
  productItemContainer: {
    backgroundColor: COLORS.ITEM_BACKGROUND,
  },
  
  // Loading state
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND,
  },
  loadingText: {
    color: COLORS.TEXT,
    fontSize: 16,
    marginTop: 16,
  },
  
  // Category tabs
  categoryTabsContainer: {
    backgroundColor: COLORS.ITEM_BACKGROUND,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.ITEM_BORDER,
  },
  categoryTabsContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  categoryTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: COLORS.CONTENT_ACCORDION,
    borderWidth: 1,
    borderColor: COLORS.ITEM_BORDER,
  },
  activeCategoryTab: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },
  categoryTabText: {
    fontSize: 14,
    color: COLORS.ITEM_TEXT,
    fontWeight: '500',
  },
  activeCategoryTabText: {
    color: COLORS.TEXT,
    fontWeight: '600',
  },
  
  // Main scroll view
  scrollView: {
    flex: 1,
  },
  
  // Category sections
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: COLORS.ITEM_BACKGROUND,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.ITEM_BORDER,
    marginTop: 8,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT,
  },
  productCountBadge: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 24,
    alignItems: 'center',
  },
  productCountText: {
    fontSize: 12,
    color: COLORS.TEXT,
    fontWeight: '600',
  },
  
  // Products container
  productsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  
  // Product items
  productItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.ITEM_BACKGROUND,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.ITEM_BORDER,
    shadowColor: COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: COLORS.CONTENT_ACCORDION,
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT,
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 14,
    color: COLORS.ITEM_TEXT,
    marginBottom: 8,
    lineHeight: 20,
  },
  productMetaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productCategory: {
    fontSize: 12,
    color: COLORS.PRIMARY,
    fontWeight: '600',
    backgroundColor: `${COLORS.PRIMARY}20`,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  productDate: {
    fontSize: 12,
    color: COLORS.ITEM_TEXT,
  },
  detailButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 8,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  detailButtonText: {
    color: COLORS.TEXT,
    fontSize: 14,
    fontWeight: '600',
  },
  
  // Empty state
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.TEXT,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 16,
    color: COLORS.ITEM_TEXT,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  addFirstProductButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addFirstProductButtonText: {
    color: COLORS.TEXT,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProductManagement;