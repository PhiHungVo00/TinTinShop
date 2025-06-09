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
import SupportItem from "@/components/SupportItem";

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
        setUser(null);

        if (res.statusCode === 200) {
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
            pathname: "/profile",
            params: {
                userDataStr: jsonStr,
            },
        });
    };

    const handleAddress = () => {
        router.push("/address");
    };

    const handleStore = () => {
        router.push("/address/MapScreen");
    };

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
                    <View style={styles.accordionContent}>
                        <Text style={styles.accordionTitle}>
                            Giới thiệu TinTinShop
                        </Text>
                        <Text style={styles.accordionText}>
                            TinTinShop là nền tảng mua sắm trực tuyến hàng đầu tại Việt Nam, được thành lập vào năm 2018.
                        </Text>
                        <Text style={styles.accordionText}>
                            Chúng tôi cung cấp đa dạng sản phẩm từ thời trang, điện tử, đồ gia dụng đến thực phẩm, đáp ứng mọi nhu cầu của khách hàng.
                        </Text>
                        <Text style={styles.accordionText}>
                            Với sứ mệnh "Mang đến trải nghiệm mua sắm tiện lợi, an toàn và nhanh chóng", TinTinShop cam kết giao hàng trong 24h và hỗ trợ đổi trả miễn phí trong 30 ngày.
                        </Text>
                    </View>
                </Accordion>
            </View>

            <View style={styles.itemContainer}>
                <View style={styles.itemHeader}>
                    <Ionicons name="people-outline" size={24} color={COLORS.ITEM_TEXT} />
                    <Text style={styles.headerText}>Trung tâm hỗ trợ</Text>
                </View>
                <Accordion title="Hỗ trợ">
                    <SupportItem
                        icon={<AntDesign name="phone" size={24} color={COLORS.ITEM_TEXT} />}
                        title="Hotline"
                        description="1900123456"
                        url="tel:1900123456" />
                    <SupportItem
                        icon={<AntDesign name="mail" size={24} color={COLORS.ITEM_TEXT} />}
                        title="Email"
                        description="support@TinTinShop.com"
                        url="mailto:support@TinTinShop.com"
                    />
                    <SupportItem
                        icon={<AntDesign name="link" size={24} color={COLORS.ITEM_TEXT} />}
                        title="Website"
                        description="https://TinTinShop.vn"
                        url="https://TinTinShop.vn"
                    />
                    <SupportItem
                        icon={<AntDesign name="facebook-square" size={24} color={COLORS.ITEM_TEXT} />}
                        title="Facebook"
                        description="facebook.com/TinTinShop"
                        url="https://facebook.com/TinTinShop"
                    />
                    <SupportItem
                        icon={<AntDesign name="instagram" size={24} color={COLORS.ITEM_TEXT} />}
                        title="Instagram"
                        description="@TinTinShop_official"
                        url="https://instagram.com/TinTinShop_official"
                    />
                </Accordion>
                <Accordion title="Phản hồi">
                    <View style={styles.accordionContent}>
                        <Text style={styles.accordionTitle}>
                            Gửi ý kiến của bạn
                        </Text>
                        <Text style={styles.accordionText}>
                            Chúng tôi luôn trân trọng ý kiến của bạn! Nếu bạn có thắc mắc hoặc cần hỗ trợ, vui lòng liên hệ qua <Text style={{ color: COLORS.STATUS_PENDING, fontWeight: "bold" }}>hotline 1900123456</Text>.
                        </Text>
                        <Text style={styles.accordionText}>
                            Bạn cũng có thể gửi phản hồi trực tiếp qua <Text style={{ color: COLORS.STATUS_PENDING, fontWeight: "bold" }}>email support@TinTinShop.com</Text> hoặc điền form trên website của chúng tôi.
                        </Text>
                        <Text style={styles.accordionText}>
                            TinTinShop luôn sẵn sàng cải thiện dịch vụ dựa trên góp ý của khách hàng để mang đến trải nghiệm tốt nhất!
                        </Text>
                    </View>
                </Accordion>
            </View>

            <AccessControl role={user?.user.role.name || "user"} allow={["admin"]}>
                <View style={styles.itemContainer}>
                    <TouchableOpacity onPress={() => router.push("../../management/users")}>
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
    accordionContent: {
        padding: 15,
        backgroundColor: COLORS.ITEM_BACKGROUND, 
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.ITEM_BORDER, 
        marginVertical: 5,
    },
    accordionTitle: {
        fontSize: 16,
        fontWeight: "600", 
        color: COLORS.ITEM_TEXT,
        marginBottom: 10,
        paddingBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.ITEM_BORDER, 
    },
    accordionText: {
        fontSize: 14,
        color: COLORS.ITEM_TEXT,
        lineHeight: 22,
        marginBottom: 10,
        paddingHorizontal: 5, 
    },
});

export default SettingScreen;