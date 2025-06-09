import { View, Text, StyleSheet, TouchableOpacity, FlatList, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView } from "react-native";
import { COLORS } from "@/util/constant";
import HeaderList from "@/components/HeaderList";
import { router } from "expo-router";
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { useCallback, useEffect, useState } from "react";
import Ionicons from '@expo/vector-icons/Ionicons';
import Octicons from '@expo/vector-icons/Octicons';
import ShareTextInput from "@/components/ShareTextInput";
import { callDeleteCategory, callGetCategories } from "@/config/api";
import { ICategory } from "@/types/backend";
import EmptyState from "@/components/EmptyState";
import ConfirmDialog from "@/components/ConfirmDialog";
import Toast from "react-native-toast-message";
import { useAppContext } from "@/context/AppContext";
import ItemCategory from "@/components/ItemCategory";

const CategoriesScreen = () => {
    const selectValues = ['All', 'Active', 'Inactive'];
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [categories, setCategories] = useState<ICategory[]>();
    const [filterStatus, setFilterStatus] = useState<string>("");
    const [filterName, setFilterName] = useState<string>("");
    const [visible, setVisible] = useState(false);
    const [itemDelete, setItemDelete] = useState<ICategory>();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [sortAscending, setSortAscending] = useState(true); // Thêm state cho sort direction
    const { user } = useAppContext();

    const createFilter = (filterName: string, filterStatus: string) => {
        let filter = "";
        if (filterName.length > 0 && filterStatus.length > 0) {
            filter = `name~'*${filterName}*'` + " and " + filterStatus;
        } else {
            filterName.length > 0 ? filter = `name~'*${filterName}*'` : filter = filterStatus;
        }
        return filter;
    }

    useEffect(() => {
        setIsRefreshing(false);
        const delayDebounce = setTimeout(() => {
            const filter = createFilter(filterName, filterStatus);

            fetchCategories({
                filter,
            });
        }, 1000);

        return () => clearTimeout(delayDebounce);
    }, [filterStatus, filterName, selectedIndex, isRefreshing]);

    const fetchCategories = async ({ filter }: {
        filter?: string
    }) => {
        const response = await callGetCategories({ filter });
        if (response.data) {
            setCategories(response.data);
        }
    };

    const handleSelectedIndex = (index: number) => {
        setSelectedIndex(index);
        if (index === -1 || index === 0) {
            setFilterStatus("");
        } else {
            const statusMap = {
                1: true,  // Active
                2: false, // Inactive
            };
            setFilterStatus(`active:${statusMap[index as keyof typeof statusMap]}`);
        }
    }

    const handleViewCategory = (item: ICategory) => {
        router.push({
            pathname: "/management/categories/CategoryDetail",
            params: {
                id: item.id
            }
        })
    }

    const handleConfirmDeleteCategory = async (item: ICategory) => {
        if (item.id) {
            const response = await callDeleteCategory(item.id);
            if (response.statusCode === 200) {
                Toast.show({
                    text1: "Xóa danh mục thành công",
                    type: "success"
                });
                setIsRefreshing(true);
            }
            else {
                Toast.show({
                    text1: "Xóa danh mục thất bại",
                    type: "error"
                });
            }
        }
        setVisible(false);
    }

    // Thêm function để sort categories theo ID
    const handleSortById = () => {
        if (categories && categories.length > 0) {
            const sortedCategories = [...categories].sort((a, b) => {
                // Convert ID to number for proper sorting if they are numeric
                const idA = parseInt(a.id || "0");
                const idB = parseInt(b.id || "0");
                
                if (sortAscending) {
                    return idA - idB; // Ascending order
                } else {
                    return idB - idA; // Descending order
                }
            });
            
            setCategories(sortedCategories);
            setSortAscending(!sortAscending); // Toggle sort direction
        }
    }

    return (
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <View style={styles.container}>
                <HeaderList
                    title="Danh sách danh mục"
                    backPress={() => router.back()}
                    addPress={() => router.push({ pathname: "/management/categories/CreateCategory" })}
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
                    <ShareTextInput
                        placeholder="Tìm kiếm danh mục"
                        onChangeText={(text) => {
                            setFilterName(text);
                        }}
                        value={filterName}
                        inputStyle={styles.inputStyle}
                        containerStyle={styles.inputContainer}
                        icon={<Ionicons name="search" size={24} color={COLORS.ITEM_TEXT} />}
                    />
                    <TouchableOpacity onPress={handleSortById} style={styles.sortButton}>
                        <Octicons 
                            name={sortAscending ? "sort-asc" : "sort-desc"} 
                            size={24} 
                            color={COLORS.ITEM_TEXT} 
                        />
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={categories}
                    renderItem={({ item }) => {
                        return <ItemCategory
                            category={item}
                            editPress={() => handleViewCategory(item)}
                            deletePress={() => {
                                setItemDelete(item);
                                setVisible(true);
                            }}
                        />
                    }}
                    keyExtractor={item => item.id || ""}
                    ListEmptyComponent={<EmptyState title="Không có danh mục" description="Vui lòng thêm danh mục mới" />}
                    refreshing={isRefreshing}
                    onRefresh={() => {
                        setIsRefreshing(true);
                    }}
                    contentContainerStyle={styles.listContainer}
                />

                <ConfirmDialog
                    visible={visible}
                    title="Xóa danh mục"
                    message="Bạn có chắc chắn muốn xóa danh mục này không?"
                    onConfirm={() => {
                        if (itemDelete) {
                            handleConfirmDeleteCategory(itemDelete);
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
    listContainer: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    inputStyle: {
        backgroundColor: COLORS.ITEM_BACKGROUND,
        paddingHorizontal: 30,
        color: COLORS.ITEM_TEXT,
    },
    inputContainer: {
        marginVertical: 0,
        width: "70%", 
        marginLeft: 50,
    },
    sortButton: {
        padding: 8,
        borderRadius: 4,
        width: 40,
        alignItems: 'center',
    },
});

export default CategoriesScreen;