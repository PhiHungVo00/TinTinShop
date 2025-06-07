import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    FlatList,
    Alert,
    RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { callGetProducts, callGetCategories, callGetToppings } from '@/config/api';
import { IProductResponseDTO } from '@/types/product';
import { ICategory, ITopping } from '@/types/backend';
import { MenuCard, SectionHeader, LoadingSection, EmptySection } from '@/components/MenuComponent';
import CategoryCard from '@/components/CategoryCardComponent';
import AppHeader from '@/components/AppHeaderComponent';
import { router } from 'expo-router';

import { COLORS } from '@/util/constant';

interface MenuScreenProps {
    navigation: any;
}

const IPV4 = process.env.EXPO_PUBLIC_IPV4;
const PORT = process.env.EXPO_PUBLIC_PORT;
const image_url_base = `http://${IPV4}:${PORT}/storage`;

const MenuScreen: React.FC<MenuScreenProps> = ({ navigation }) => {
    const [products, setProducts] = useState<IProductResponseDTO[]>([]);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [toppings, setToppings] = useState<ITopping[]>([]);
    const [loading, setLoading] = useState({
        products: false,
        categories: false,
        toppings: false,
    });
    const [refreshing, setRefreshing] = useState(false);

    // Fetch data when screen is focused
    useFocusEffect(
        useCallback(() => {
            fetchAllData();
        }, [])
    );

    const fetchAllData = async (isRefresh = false) => {
        if (isRefresh) {
            setRefreshing(true);
        }

        try {
            await Promise.all([
                fetchProducts(),
                fetchCategories(),
                fetchToppings(),
            ]);
        } finally {
            if (isRefresh) {
                setRefreshing(false);
            }
        }
    };

    const fetchProducts = async () => {
        try {
            setLoading(prev => ({ ...prev, products: true }));
            const response = await callGetProducts({});
            if (response.data) {
                setProducts(response.data);
            } else {
                throw new Error('Failed to fetch products');
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            Alert.alert('Lỗi', 'Không thể tải danh sách sản phẩm');
        } finally {
            setLoading(prev => ({ ...prev, products: false }));
        }
    };

    const fetchCategories = async () => {
        try {
            setLoading(prev => ({ ...prev, categories: true }));
            const response = await callGetCategories({});
            if (response.data) {
                setCategories(response.data);
            } else {
                throw new Error('Failed to fetch categories');
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            Alert.alert('Lỗi', 'Không thể tải danh sách danh mục');
        } finally {
            setLoading(prev => ({ ...prev, categories: false }));
        }
    };

    const fetchToppings = async () => {
        try {
            setLoading(prev => ({ ...prev, toppings: true }));
            const response = await callGetToppings({});
            if (response.data) {
                setToppings(response.data);
            } else {
                throw new Error('Failed to fetch toppings');
            }
        } catch (error) {
            console.error('Error fetching toppings:', error);
            Alert.alert('Lỗi', 'Không thể tải danh sách topping');
        } finally {
            setLoading(prev => ({ ...prev, toppings: false }));
        }
    };

  

    const onRefresh = () => {
        fetchAllData(true);
    };

    const renderProductItem = ({ item }: { item: IProductResponseDTO }) => (
        <MenuCard
            title={item.name}
            subtitle={item.category?.name || 'Không có danh mục'}
            image={`${image_url_base}/product/${item.image}`}
            status={item.active}
            type="product"
            onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
        />
    );

    // Sử dụng CategoryCard component riêng cho danh mục
    const renderCategoryItem = ({ item }: { item: ICategory }) => (
        <CategoryCard
            title={item.name}
            subtitle={item.description || 'Không có mô tả'}
            status={item.active}
            icon="grid-outline"
            onPress={() => navigation.navigate('CategoryDetail', { categoryId: item.id })}
        />
    );

    const renderToppingItem = ({ item }: { item: ITopping }) => (
        <MenuCard
            title={item.name}
            subtitle={item.description || 'Không có mô tả'}
            image={`${image_url_base}/topping/${item.image}`}
            price={item.price}
            status={item.status}
            type="topping"
            onPress={() => router.push({ pathname: "/management/toppings/ToppingDetail", params: { id: item.id } })}
        />
    );

    const renderSection = (
        title: string,
        data: any[],
        renderItem: any,
        onManage: () => void,
        isLoading: boolean,
        emptyMessage: string
    ) => (
        <View style={styles.section}>
            <SectionHeader
                title={title}
                count={data.length}
                onManage={onManage}
            />

            <View style={styles.sectionContent}>
                {isLoading ? (
                    <LoadingSection />
                ) : data.length > 0 ? (
                    <FlatList
                        data={data}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.horizontalList}
                        ItemSeparatorComponent={() => <View style={{ width: 5 }} />}
                    />
                ) : (
                    <EmptySection
                        message={emptyMessage}
                        icon={title === 'Sản Phẩm' ? 'bag-outline' :
                            title === 'Danh Mục' ? 'grid-outline' : 'restaurant-outline'}
                    />
                )}
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <AppHeader
                title="Menu Quản Lý"
                rightComponent={
                    <TouchableOpacity
                        style={styles.refreshButton}
                        onPress={() => fetchAllData()}
                    >
                        <Ionicons name="refresh-outline" size={24} color={COLORS.TEXT} />
                    </TouchableOpacity>
                }
            />

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[COLORS.PRIMARY]}
                        tintColor={COLORS.PRIMARY}
                    />
                }
            >
                {renderSection(
                    'Sản Phẩm',
                    products,
                    renderProductItem,
                    () => router.push('/management/products'),
                    loading.products,
                    'Chưa có sản phẩm nào'
                )}

                {renderSection(
                    'Danh Mục',
                    categories,
                    renderCategoryItem,
                    () => router.push('/management/categories'),
                    loading.categories,
                    'Chưa có danh mục nào'
                )}

                {renderSection(
                    'Topping',
                    toppings,
                    renderToppingItem,
                    () => router.push('/management/toppings'),
                    loading.toppings,
                    'Chưa có topping nào'
                )}

                <View style={styles.bottomPadding} />
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
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.ITEM_BORDER,
        backgroundColor: COLORS.BACKGROUND,
    },
    headerLeft: {
        width: 40,
        alignItems: 'flex-start',
    },
    headerCenter: {
        flex: 1,
        alignItems: 'center',
    },
    headerRight: {
        width: 40,
        alignItems: 'flex-end',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.TEXT,
    },
    refreshButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: COLORS.ITEM_BACKGROUND,
    },
    scrollView: {
        flex: 1,
    },
    section: {
        marginBottom: 25,
    },
    sectionContent: {
        minHeight: 180,
    },
    horizontalList: {
        paddingHorizontal: 15,
    },
    bottomPadding: {
        height: 20,
    },
});

export default MenuScreen;