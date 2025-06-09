import { View, Text, StyleSheet, TouchableOpacity, FlatList, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, Animated } from "react-native";
import { COLORS } from "@/util/constant";
import HeaderList from "@/components/HeaderList";
import { router } from "expo-router";
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { useCallback, useEffect, useState, useRef } from "react";
import Ionicons from '@expo/vector-icons/Ionicons';
import Octicons from '@expo/vector-icons/Octicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import ShareTextInput from "@/components/ShareTextInput";
import ItemUser from "@/components/ItemUser";
import { callDeleteUser, callGetUsers } from "@/config/api";
import { IMeta, IUser } from "@/types/backend";
import EmptyState from "@/components/EmptyState";
import ConfirmDialog from "@/components/ConfirmDialog";
import Toast from "react-native-toast-message";
import { useAppContext } from "@/context/AppContext";

const IPV4 = process.env.EXPO_PUBLIC_IPV4;
const PORT = process.env.EXPO_PUBLIC_PORT;
const image_url_base = `http://${IPV4}:${PORT}/storage`;

const UsersScreen = () => {
    const selectValues = ['All', 'Admin', 'User', 'Guest'];
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [users, setUsers] = useState<IUser[]>();
    const [filterRole, setFilterRole] = useState<string>("");
    const [filterName, setFilterName] = useState<string>("");
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [sort, setSort] = useState<string>("id,desc");
    const [visible, setVisible] = useState(false);
    const [itemDelete, setItemDelete] = useState<IUser>();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const { user } = useAppContext();

    // Animation cho sort icon
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;

    const createFilter = (filterName: string, filterRole: string) => {
        let filter = "";
        if (filterName.length > 0 && filterRole.length > 0) {
            filter = `name~'*${filterName}*'` + " and " + filterRole;
        } else {
            filterName.length > 0 ? filter = `name~'*${filterName}*'` : filter = filterRole;
        }
        return filter;
    }

    useEffect(() => {
        setIsRefreshing(false);
        const delayDebounce = setTimeout(() => {
            const filter = createFilter(filterName, filterRole);
            fetchUsers({
                page,
                size,
                sort,
                filter,
            });
        }, 1000);

        return () => clearTimeout(delayDebounce);
    }, [filterRole, filterName, sort, selectedIndex, page, isRefreshing]);

    const fetchUsers = async ({ page, size, sort, filter }: {
        page: number,
        size: number,
        sort?: string,
        filter?: string
    }) => {
        try {
            const response = await callGetUsers({ page, size, sort, filter });
            if (response.data) {
                setUsers(response.data.result);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            Toast.show({
                text1: "Lỗi khi tải danh sách người dùng",
                type: "error"
            });
        }
    };

    const handleSelectedIndex = (index: number) => {
        setSelectedIndex(index);
        if (index === -1 || index === 0) {
            setFilterRole("");
        } else {
            if (index === 3) {
                setFilterRole("role.name is null");
            } else {
                setFilterRole(`role.name:'${selectValues[index].toLowerCase()}'`);
            }
        }
    }

    const handleViewUser = (item: IUser) => {
        router.push({
            pathname: "/management/users/UserDetail",
            params: {
               id: item.id
            }
        })
    }

    const handleSortPress = () => {
        // Animation khi nhấn sort
        Animated.sequence([
            Animated.parallel([
                Animated.timing(scaleAnim, {
                    toValue: 0.8,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(rotateAnim, {
                    toValue: sort === "id,asc" ? 1 : 0,
                    duration: 200,
                    useNativeDriver: true,
                })
            ]),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            })
        ]).start();

        setSort(sort === "id,asc" ? "id,desc" : "id,asc");
    };

    const handleConfirmDeleteUser = async (item: IUser) => {
        if (item.id) {
            try {
                const response = await callDeleteUser(item.id);
                if (response.statusCode === 200) {
                    Toast.show({
                        text1: "Xóa người dùng thành công",
                        type: "success"
                    });
                    setIsRefreshing(true);
                } else {
                    Toast.show({
                        text1: "Xóa người dùng thất bại",
                        type: "error"
                    });
                }
            } catch (error) {
                Toast.show({
                    text1: "Xóa người dùng thất bại",
                    type: "error"
                });
            }
        }
        setVisible(false);
    }

    // Tính toán rotation cho icon
    const rotateInterpolate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg']
    });

    return (
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <View style={styles.container}>
                <HeaderList
                    title="Danh sách người dùng"
                    backPress={() => router.back()}
                    addPress={() => router.push({pathname: "/management/users/CreateUser"})}
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
                        onPress={handleSortPress}
                        style={[
                            styles.sortButton,
                            { backgroundColor: sort === "id,desc" ? COLORS.BLUE_LIGHT : COLORS.ITEM_BACKGROUND }
                        ]}
                        activeOpacity={0.7}
                    >
                        <Animated.View
                            style={[
                                styles.sortIconContainer,
                                {
                                    transform: [
                                        { scale: scaleAnim },
                                        { rotate: rotateInterpolate }
                                    ]
                                }
                            ]}
                        >
                            <MaterialIcons
                                name="arrow-upward"
                                size={20}
                                color={sort === "id,desc" ? "white" : COLORS.ITEM_TEXT}
                            />
                        </Animated.View>
                        <Text style={[
                            styles.sortText,
                            { color: sort === "id,desc" ? "white" : COLORS.ITEM_TEXT }
                        ]}>
                            {sort === "id,desc" ? "Mới nhất" : "Cũ nhất"}
                        </Text>
                    </TouchableOpacity>

                    <ShareTextInput
                        placeholder="Tìm kiếm người dùng"
                        onChangeText={(text) => {
                            setFilterName(text);
                        }}
                        value={filterName}
                        inputStyle={styles.inputStyle}
                        containerStyle={styles.inputContainer}
                        icon={<Ionicons name="search" size={24} color={COLORS.ITEM_TEXT} />}
                    />
                    
                    <TouchableOpacity style={styles.filterButton}>
                        <Octicons name="filter" size={24} color={COLORS.ITEM_TEXT} />
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={users}
                    renderItem={({ item }) => {
                        return <ItemUser
                            title={item.name}
                            description={item.phone}
                            imageUri={item.avatar ? `${image_url_base}/avatar/${item.avatar}` : ""}
                            editPress={() => handleViewUser(item)}
                            deletePress={() => {
                                setItemDelete(item);
                                setVisible(true);
                            }}
                            showDelete={item.id !== user?.user?.id}
                        />
                    }}
                    keyExtractor={item => item.id || ""}
                    ListEmptyComponent={<EmptyState title="Không có người dùng" description="Vui lòng thêm người dùng mới" />}
                    refreshing={isRefreshing}
                    onRefresh={() => {
                        setIsRefreshing(true);
                    }}
                />
                
                <ConfirmDialog
                    visible={visible}
                    title="Xóa người dùng"
                    message="Bạn có chắc chắn muốn xóa người dùng này không?"
                    onConfirm={() => {
                        if (itemDelete) {
                            handleConfirmDeleteUser(itemDelete);
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
        flex: 1,
        marginHorizontal: 12,
    },
    sortButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.BLUE_LIGHT,
        minWidth: 90,
    },
    sortIconContainer: {
        marginRight: 4,
    },
    sortText: {
        fontSize: 12,
        fontWeight: "500",
    },
    filterButton: {
        padding: 8,
    },
    listContainer: {
        flex: 1,
        padding: 16,
    },
    footerContainer: {
        padding: 16,
        alignItems: "center",
    },
    footerText: {
        color: COLORS.ITEM_TEXT,
    },
});

export default UsersScreen;