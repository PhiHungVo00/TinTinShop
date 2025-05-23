import { COLORS } from "@/util/constant";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, BackHandler, Platform, RefreshControl } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Accordion from "@/components/Accordion";
import Entypo from '@expo/vector-icons/Entypo';
import AccessControl from "@/components/AccessControl";
import IconCard from "@/components/IconCard";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useAppContext } from "@/context/AppContext";
import { useCallback, useEffect, useState } from "react";
import { callGetUser, callLogout } from "@/config/api";
import { IUser } from "@/types/backend";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import ConfirmDialog from "@/components/ConfirmDialog";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from 'expo-haptics';
const image = {
    avatar_default: require("@/assets/images/setting/avatar_default.jpg"),
};

const IPV4 = process.env.EXPO_PUBLIC_IPV4;
const PORT = process.env.EXPO_PUBLIC_PORT;
const image_url_base = `http://${IPV4}:${PORT}/storage`;

const SettingScreen = () => {
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        const fetchUser = async (id: string) => {
            try {
                setRefreshing(true); 
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
                const res = await callGetUser(id);
                if (res.data) {
                    setUserData(res.data);
                    console.log(res.data);
                }
            } catch (error) {
                console.error("Lỗi khi fetch user:", error);
                Toast.show({ text1: "Lỗi khi tải dữ liệu", type: "error" });
            } finally {
                setRefreshing(false);
            }
        };
    
        if (user?.user.id) {
            fetchUser(user.user.id);
        }
    }, []);
    
    const { user, setUser } = useAppContext();
    const [userData, setUserData] = useState<IUser>();
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);

    const handleLogout = async () => {
        setShowLogoutDialog(false);
        const res = await callLogout();
        AsyncStorage.removeItem("access_token");
        AsyncStorage.removeItem("refresh_token");
        setUser(null);
        
        if (res === "Logout success") {
            Toast.show({ text1: "Đăng xuất thành công", type: "success" });
            router.replace("/(auth)/WelcomeScreen");
        } else {
            Toast.show({ text1: "Đăng xuất thất bại", type: "error" });
        }
    };

    const handleExitApp = () => {
        if (Platform.OS === "android") {
            BackHandler.exitApp();
        }
    };

    const handleProfile = () => {
        const jsonStr = encodeURIComponent(JSON.stringify(userData));

        router.push({
            pathname: "../../profile",
            params: {
                userDataStr: jsonStr,
            },
        });

    }

    const handleAddress = () => {
        Alert.alert("Chức năng đang phát triển");
    }

    const handleStore = () => {
        Alert.alert("Chức năng đang phát triển");
    }

    useEffect(() => {
        const fetchUser = async (id: string) => {
            const res = await callGetUser(id);
            if (res.data) {
                setUserData(res.data);
            }
        };
        if (user?.user.id) {
            fetchUser(user?.user.id);
        }
    }, []);

    return (
        <ScrollView 
            style={styles.container} 
            contentContainerStyle={styles.contentContainer}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <View style={styles.profileContainer}>
                <View style={styles.profile}>
                    <Image
                        source={userData?.avatar ? { uri: `${image_url_base}/avatar/${userData?.avatar}` } : image.avatar_default}
                        style={styles.avatar}
                    />
                    <View style={styles.profileContent}>
                        <Text style={styles.name}>{user?.user.userName}</Text>
                        <Text style={styles.email}>{user?.user.email}</Text>
                    </View>
                </View>
                <View style={styles.flashGroup}>
                    <IconCard 
                      icon={<AntDesign name="form" size={24} color={COLORS.ITEM_TEXT} />} 
                      title="Thông tin" 
                        onPress={handleProfile} 
                      textStyle={{ color: COLORS.ITEM_TEXT }} 
                    />
                    <IconCard 
                      icon={<Feather name="map-pin" size={24} color={COLORS.ITEM_TEXT} />} 
                      title="Địa chỉ" 
                      onPress={handleAddress} 
                      textStyle={{ color: COLORS.ITEM_TEXT }} 
                    />
                    <IconCard 
                        icon={<MaterialIcons name="store" size={24} color={COLORS.ITEM_TEXT} />} 
                        title="Cửa hàng" 
                        onPress={handleStore} 
                        textStyle={{ color: COLORS.ITEM_TEXT }} 
                    />
                </View>
            </View>

            <View style={styles.itemContainer}>
                <View style={styles.itemHeader}>
                    <Feather name="info" size={24} color={COLORS.ITEM_TEXT} />
                    <Text style={styles.headerText}>Thông tin chung</Text>
                </View>
                <Accordion title="Thông tin về TinTinShop">
                    <Text>Test 1</Text>
                    <Text>Test 2</Text>
                    <Text>Test 3</Text>
                </Accordion>
            </View>

            <View style={styles.itemContainer}>
                <View style={styles.itemHeader}>
                    <Ionicons name="people-outline" size={24} color={COLORS.ITEM_TEXT} />
                    <Text style={styles.headerText}>Trung tâm hỗ trợ</Text>
                </View>
                <Accordion title="Hỗ trợ">
                    <Text>Test 1</Text>
                    <Text>Test 2</Text>
                    <Text>Test 3</Text>
                </Accordion>
                <Accordion title="Phản hồi">
                    <Text>Test 1</Text>
                    <Text>Test 2</Text>
                    <Text>Test 3</Text>
                </Accordion>
            </View>

            <AccessControl role="admin" allow={["admin"]}>
                <View style={styles.itemContainer}>
                    <TouchableOpacity>
                        <View style={styles.itemHeader}>
                            <Entypo name="list" size={24} color={COLORS.ITEM_TEXT} />
                            <Text style={styles.headerText}>Danh sách người dùng</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </AccessControl>

            <TouchableOpacity style={styles.itemContainer} onPress={() => setShowLogoutDialog(true)}>
                <View style={styles.itemHeader}>
                    <MaterialIcons name="logout" size={24} color={COLORS.ITEM_TEXT} />
                    <Text style={styles.headerText}>Đăng xuất</Text>
                </View>
            </TouchableOpacity>
            <ConfirmDialog
                visible={showLogoutDialog}
                onCancel={() => setShowLogoutDialog(false)}
                onConfirm={handleLogout}
                title="Xác nhận"
                message="Bạn có chắc chắn muốn đăng xuất?"
            />


            {Platform.OS === "android" && (
                <TouchableOpacity style={styles.itemContainer} onPress={handleExitApp}>
                    <View style={styles.itemHeader}>
                        <Feather name="power" size={24} color={COLORS.ITEM_TEXT} />
                        <Text style={styles.headerText}>Thoát ứng dụng</Text>
                    </View>
                </TouchableOpacity>
                
            )}
        </ScrollView>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.BACKGROUND,
    },
    contentContainer: {
        paddingBottom: 40,
    },
    profileContainer: {
        backgroundColor: COLORS.ITEM_BACKGROUND,
        borderWidth: 1,
        borderColor: COLORS.ITEM_BORDER,
        padding: 20,
    },
    profile: {
        paddingTop: 20,
        flexDirection: "row",
        gap: 15,
    },
    profileContent: {
        flexDirection: "column",
        marginTop: 10,
    },
    flashGroup: {
        flexDirection: "row",
        marginTop: 15,
        justifyContent: "space-between",
    },
    itemContainer: {
        backgroundColor: COLORS.ITEM_BACKGROUND,
        marginTop: 10,
        borderWidth: 1,
        borderColor: COLORS.ITEM_BORDER,
    },
    itemHeader: {
        flexDirection: "row",
        padding: 10,
        gap: 10,
        borderBottomWidth: 1,
        borderColor: COLORS.ITEM_BORDER,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    name: {
        fontSize: 16,
        color: COLORS.ITEM_TEXT,
        fontWeight: "bold",
    },
    email: {
        fontSize: 14,
        color: COLORS.ITEM_TEXT,
    },
    headerText: {
        fontSize: 16,
        color: COLORS.ITEM_TEXT,
        fontWeight: "bold",
    },
});

export default SettingScreen;
