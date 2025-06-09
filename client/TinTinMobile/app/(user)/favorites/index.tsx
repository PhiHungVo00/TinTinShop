import React, { useEffect, useCallback, useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/util/constant';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useFavorites } from '@/context/FavoritesContext';
import { useAppContext } from '@/context/AppContext';
import { callGetProducts, callGetToppings, callGetProductFavoritesOfUser, callGetToppingFavoritesOfUser } from '@/config/api';
import { useFocusEffect } from 'expo-router';

const IPV4 = process.env.EXPO_PUBLIC_IPV4;
const PORT = process.env.EXPO_PUBLIC_PORT;
const image_url_base = `http://${IPV4}:${PORT}/storage`;
import { router } from 'expo-router';

interface Topping {
  id: number;
  name: string;
  subtitle: string;
  image: any;
  price: string;
}

export default function FavoritesScreen() {
  const [products, setProducts] = useState<any[]>([]);
  const [toppingList, setToppingList] = useState<any[]>([]);
  const { user } = useAppContext();
  const {
    favorites,
    favoriteToppings,
    toggleFavorite,
    toggleFavoriteTopping,
    setFavoritesList,
    setFavoriteToppingsList,
  } = useFavorites();

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const [prodRes, topRes] = await Promise.all([
            callGetProducts({}),
            callGetToppings({}),
          ]);

          if (prodRes.data) {
            const mapped = prodRes.data.map((p: any) => ({
              id: Number(p.id),
              name: p.name,
              subtitle: p.description || '',
              image: { uri: `${image_url_base}/product/${p.image}` },
              price: '0',
            }));
            setProducts(mapped);
          }

          if (topRes.data) {
            const mappedT = topRes.data.map((t: any) => ({
              id: Number(t.id),
              name: t.name,
              subtitle: t.description || '',
              image: { uri: `${image_url_base}/topping/${t.image}` },
              price: t.price?.toString() || '0',
            }));
            setToppingList(mappedT);
          }

          if (user?.user.id) {
            const [favProdRes, favTopRes] = await Promise.all([
              callGetProductFavoritesOfUser(user.user.id),
              callGetToppingFavoritesOfUser(user.user.id),
            ]);

            if (favProdRes.data) {
              setFavoritesList(favProdRes.data.map((f: any) => Number(f.product.id)));
            }
            if (favTopRes.data) {
              setFavoriteToppingsList(favTopRes.data.map((f: any) => Number(f.topping.id)));
            }
          }
        } catch (error) {
          console.error('Error fetching favorites data', error);
        }
      };
      fetchData();
    }, [user?.user.id])
  );

  const favoriteProductsData = products.filter(product => favorites.includes(product.id));
  const favoriteToppingsData = toppingList.filter((topping: Topping) => favoriteToppings.includes(topping.id));

  const renderProduct = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.productCard}>
      <Image source={item.image} style={styles.productImage} />
      <TouchableOpacity 
        style={styles.favoriteButton}
        onPress={() => {
          // TODO: Gọi API cập nhật trạng thái yêu thích sản phẩm
          // const updateFavorite = async () => {
          //   const response = await callUpdateFavoriteProduct(item.id);
          //   if (response.success) {
          //     toggleFavorite(item.id);
          //   }
          // };
          // updateFavorite();
          toggleFavorite(item.id);
        }}
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

  const renderTopping = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.toppingCard}>
      <Image source={item.image} style={styles.toppingImage} />
      <TouchableOpacity 
        style={styles.favoriteButton}
        onPress={() => toggleFavoriteTopping(item.id)}
      >
        <AntDesign name="heart" size={16} color="#FF0000" />
      </TouchableOpacity>
      <View style={styles.toppingInfo}>
        <Text style={styles.toppingName}>{item.name}</Text>
        <Text style={styles.toppingSubtitle}>{item.subtitle}</Text>
        <Text style={styles.toppingPrice}>{item.price} VNĐ</Text>
      </View>
    </TouchableOpacity>
  );

  const hasFavorites = favoriteProductsData.length > 0 || favoriteToppingsData.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>TINTIN-Yêu thích</Text>
      </View>
      {hasFavorites ? (
        <ScrollView style={styles.content}>
          {favoriteProductsData.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Sản phẩm yêu thích</Text>
              <FlatList
                data={favoriteProductsData}
                renderItem={renderProduct}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                scrollEnabled={false}
                contentContainerStyle={styles.productsList}
              />
            </>
          )}
          {favoriteToppingsData.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Topping yêu thích</Text>
              <FlatList
                data={favoriteToppingsData}
                renderItem={renderTopping}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.toppingsList}
              />
            </>
          )}
        </ScrollView>
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
  content: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
  },
  productsList: {
    padding: 8,
  },
  toppingsList: {
    paddingHorizontal: 8,
    marginBottom: 20,
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
