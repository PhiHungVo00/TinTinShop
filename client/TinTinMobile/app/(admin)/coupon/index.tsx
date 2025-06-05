import { View, Text, StyleSheet, TouchableOpacity, FlatList, KeyboardAvoidingView } from "react-native";
import { COLORS } from "@/util/constant";
import HeaderList from "@/components/HeaderList";
import { router } from "expo-router";
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { useCallback, useEffect, useState } from "react";
import Ionicons from '@expo/vector-icons/Ionicons';
import Octicons from '@expo/vector-icons/Octicons';
import ShareTextInput from "@/components/ShareTextInput";
import ItemCoupon from "@/components/ItemCoupon";
import { callDeleteCoupon, callGetCoupons } from "@/config/api";
import { ICoupon } from "@/types/backend";
import EmptyState from "@/components/EmptyState";
import ConfirmDialog from "@/components/ConfirmDialog";
import Toast from "react-native-toast-message";
import { useAppContext } from "@/context/AppContext";

const IPV4 = process.env.EXPO_PUBLIC_IPV4;
const PORT = process.env.EXPO_PUBLIC_PORT;
const image_url_base = `http://${IPV4}:${PORT}/storage`;

const CouponsScreen = () => {
    const selectValues = ['All', 'Active', 'Inactive', 'Expired'];
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [coupons, setCoupons] = useState<ICoupon[]>([]);
    const [filterStatus, setFilterStatus] = useState<string>("");
    const [filterCode, setFilterCode] = useState<string>("");
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [sort, setSort] = useState<string>("id,desc");
    const [visible, setVisible] = useState(false);
    const [itemDelete, setItemDelete] = useState<ICoupon>();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const { user } = useAppContext();

    const createFilter = (filterCode: string, filterStatus: string) => {
        let filter = "";
        if (filterCode.length > 0 && filterStatus.length > 0) {
            filter = `code~'*${filterCode}*'` + " and " + filterStatus;
        } else {
            filterCode.length > 0 ? filter = `code~'*${filterCode}*'` : filter = filterStatus;
        }
        return filter;
    }

    useEffect(() => {
        setIsRefreshing(false);
        const delayDebounce = setTimeout(() => {
            const filter = createFilter(filterCode, filterStatus);
            fetchCoupons({
                page,
                size,
                sort,
                filter,
            });
        }, 1000);

        return () => clearTimeout(delayDebounce);
    }, [filterStatus, filterCode, sort, selectedIndex, page, isRefreshing]);

    const fetchCoupons = async ({ page, size, sort, filter }: {
        page: number,
        size: number,
        sort?: string,
        filter?: string
    }) => {
        try {
            const response = await callGetCoupons({ page, size, sort, filter });
            if (response.data) {
                // Apply client-side filtering if needed
                let filteredCoupons = response.data;
                
                // Filter by status
                if (selectedIndex === 1) { // Active
                    filteredCoupons = filteredCoupons.filter(coupon => 
                        coupon.isActive && new Date(coupon.endDate) > new Date()
                    );
                } else if (selectedIndex === 2) { // Inactive
                    filteredCoupons = filteredCoupons.filter(coupon => !coupon.isActive);
                } else if (selectedIndex === 3) { // Expired
                    filteredCoupons = filteredCoupons.filter(coupon => 
                        new Date(coupon.endDate) <= new Date()
                    );
                }

                // Filter by code
                if (filterCode) {
                    filteredCoupons = filteredCoupons.filter(coupon =>
                        coupon.code.toLowerCase().includes(filterCode.toLowerCase())
                    );
                }

                setCoupons(filteredCoupons);
            }
        } catch (error) {
            console.error('Error fetching coupons:', error);
            Toast.show({
                text1: "Lỗi khi tải danh sách coupon",
                type: "error"
            });
        }
    };

    const handleSelectedIndex = (index: number) => {
        setSelectedIndex(index);
        if (index === -1 || index === 0) {
            setFilterStatus("");
        } else {
            // Filter logic will be handled in fetchCoupons
            setFilterStatus("");
        }
    }

    const handleViewCoupon = (item: ICoupon) => {
        router.push({
            pathname: "/management/coupons/CouponDetail",
            params: {
                couponDataStr: JSON.stringify(item)
            }
        })
    }

    const handleConfirmDeleteCoupon = async (item: ICoupon) => {
        if (item.id) {
            try {
                const response = await callDeleteCoupon(item.id);
                if (response.statusCode === 200) {
                    Toast.show({
                        text1: "Xóa coupon thành công",
                        type: "success"
                    });
                    setIsRefreshing(true);
                } else {
                    Toast.show({
                        text1: "Xóa coupon thất bại",
                        type: "error"
                    });
                }
            } catch (error) {
                Toast.show({
                    text1: "Xóa coupon thất bại",
                    type: "error"
                });
            }
        }
        setVisible(false);
    }

    return (
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <View style={styles.container}>
                <HeaderList
                    title="Danh sách Coupon"
                    showBack={false}
                    addPress={() => router.push({pathname: "/management/coupons/CreateCoupon"})}
                />

                <View style={styles.segmentContainer}>
                    <SegmentedControl
                        values={selectValues}
                        selectedIndex={selectedIndex}
                        onChange={(event) => {
                            handleSelectedIndex(event.nativeEvent.selectedSegmentIndex);
                        }}
                        backgroundColor={COLORS.ITEM_BACKGROUND}
                        tintColor={COLORS.BLUE_LIGHT}
                        fontStyle={{ color: COLORS.ITEM_TEXT }}
                        style={styles.segmentStyle}
                        activeFontStyle={{ color: COLORS.ITEM_ACTIVE_BLUE }}
                    />
                </View>

                <View style={styles.searchContainer}>
                    <TouchableOpacity
                        onPress={() => {
                            setSort(sort === "id,asc" ? "id,desc" : "id,asc");
                        }}
                    >
                        <Ionicons
                            name="swap-vertical"
                            size={24}
                            color={sort === "id,asc" ? COLORS.ITEM_TEXT : "orange"} 
                        />
                    </TouchableOpacity>

                    <ShareTextInput
                        placeholder="Tìm kiếm coupon"
                        onChangeText={(text) => {
                            setFilterCode(text);
                        }}
                        value={filterCode}
                        inputStyle={styles.inputStyle}
                        containerStyle={styles.inputContainer}
                        icon={<Ionicons name="search" size={24} color={COLORS.ITEM_TEXT} />}
                    />
                    
                    <TouchableOpacity>
                        <Octicons name="filter" size={24} color={COLORS.ITEM_TEXT} />
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={coupons}
                    renderItem={({ item }) => {
                        return <ItemCoupon
                            coupon={item}
                            imageUri={item.image ? `${image_url_base}/coupon/${item.image}` : ""}
                            editPress={() => handleViewCoupon(item)}
                            deletePress={() => {
                                setItemDelete(item);
                                setVisible(true);
                            }}
                        />
                    }}
                    keyExtractor={item => item.id?.toString() || ""}
                    ListEmptyComponent={<EmptyState title="Không có coupon" description="Vui lòng thêm coupon mới" />}
                    refreshing={isRefreshing}
                    onRefresh={() => {
                        setIsRefreshing(true);
                    }}
                />
                
                <ConfirmDialog
                    visible={visible}
                    title="Xóa Coupon"
                    message="Bạn có chắc chắn muốn xóa coupon này không?"
                    onConfirm={() => {
                        if (itemDelete) {
                            handleConfirmDeleteCoupon(itemDelete);
                        }
                    }}
                    onCancel={() => setVisible(false)}
                />
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.BACKGROUND,
    },
    segmentContainer: {
        backgroundColor: COLORS.ITEM_BACKGROUND,
    },
    segmentStyle: {
        height: 36,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: COLORS.BACKGROUND,
    },
    inputStyle: {
        backgroundColor: COLORS.ITEM_BACKGROUND,
        paddingHorizontal: 30,
        color: COLORS.ITEM_TEXT,
    },
    inputContainer: {
        marginVertical: 0,
        width: "80%",
    },
});

export default CouponsScreen;
