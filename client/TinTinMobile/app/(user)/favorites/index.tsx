import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/util/constant';
import AntDesign from '@expo/vector-icons/AntDesign';

const favoriteProducts = [
  { id: 1, name: 'Cà phê sữa', subtitle: 'Cà phê sữa đá', image: require('@/assets/Food/Coffeemilk.jpg'), price: '25.000' },
  { id: 2, name: 'Trà sữa trân châu', subtitle: 'Trà sữa', image: require('@/assets/Food/Tranchauden.jpg'), price: '25.000' },
  { id: 3, name: 'Trà đào', subtitle: 'Trà trái cây', image: require('@/assets/Food/Dao.jpg'), price: '25.000' },
];

export default function FavoritesScreen() {
  const renderProduct = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.productCard}>
      <Image source={item.image} style={styles.productImage} />
      <TouchableOpacity style={styles.favoriteButton}>
        <AntDesign name="heart" size={16} color="#FF0000" />
      </TouchableOpacity>
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

    return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>TINTIN-Yêu thích</Text>
      </View>
      {favoriteProducts.length > 0 ? (
        <FlatList
          data={favoriteProducts}
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
