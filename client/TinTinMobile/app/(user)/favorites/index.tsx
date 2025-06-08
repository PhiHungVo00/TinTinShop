import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/util/constant';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useFavorites } from '@/context/FavoritesContext';
import { allProducts } from '@/app/(user)/home';
import { router } from 'expo-router';

export default function FavoritesScreen() {
  const { favorites, toggleFavorite } = useFavorites();

  const favoriteProductsData = allProducts.filter(product => favorites.includes(product.id));

  const renderProduct = ({ item }: { item: typeof allProducts[0] }) => (
    <TouchableOpacity style={styles.productCard}>
      <Image source={item.image} style={styles.productImage} />
      <TouchableOpacity 
        style={styles.favoriteButton}
        onPress={() => toggleFavorite(item.id)}
      >
        <AntDesign name="heart" size={16} color="#FF0000" />
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

    return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>TINTIN-Yêu thích</Text>
      </View>
      {favoriteProductsData.length > 0 ? (
        <FlatList
          data={favoriteProductsData}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.productsList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <AntDesign name="heart" size={64} color={COLORS.PRIMARY} />
          <Text style={styles.emptyStateText}>Chưa có sản phẩm yêu thích</Text>
        </View>
      )}
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
  productsList: {
    padding: 8,
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
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
    padding: 8,
    zIndex: 1,
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
