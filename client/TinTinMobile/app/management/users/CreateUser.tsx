import { COLORS } from "@/util/constant";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Pressable, Image } from "react-native"
import { router } from "expo-router";
import { useState } from "react";
import { requestImagePickerPermission } from "@/util/ImagePickerPermisison";
import * as ImagePicker from 'expo-image-picker';
const image = {
    avatar_default: require("@/assets/images/setting/avatar_default.jpg"),
};
const IPV4 = process.env.EXPO_PUBLIC_IPV4;
const PORT = process.env.EXPO_PUBLIC_PORT;
const image_url_base = `http://${IPV4}:${PORT}/storage`;
const ROLES = ["Admin", "User", "Guest"];
const CreateUser = () => {
    const [avatarUri, setAvatarUri] = useState<string>('');
    const [avatarFileName, setAvatarFileName] = useState<string>('');

    const pickImageAsync = async () => {
        const permission = await requestImagePickerPermission();
        if (permission) {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes:['images'],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
              });
            
              if (!result.canceled) {
                const selectedAsset = result.assets[0];
                const fileUrl = selectedAsset.uri;
                setAvatarUri(fileUrl); 
                setAvatarFileName(fileUrl.split("/").pop() as string);
              }
        }
    };
    return (
        <View style={[styles.container,{paddingBottom:100}]}>
             <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.backButton}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="arrow-back" size={24} color={COLORS.ITEM_TEXT} />
                    </TouchableOpacity>

                    <Text style={styles.headerText}>Thêm mới người dùng</Text>
                </View>
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <ScrollView >
                <View style={styles.avatarWrapper}>
                        <Image
                            source={avatarUri ? { uri: avatarUri } : image.avatar_default}
                            style={styles.avatar}
                        />
                        <Pressable
                            style={styles.editIcon}
                            onPress={pickImageAsync}
                        >
                            <AntDesign name="edit" size={18} color={COLORS.ITEM_TEXT} />
                        </Pressable>
                    </View>
                    </ScrollView>
                    </KeyboardAvoidingView>

        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.BACKGROUND,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        position: "relative",
        marginVertical: 30,

    },
    backButton: {
        padding: 6,
        zIndex: 10,
    },
    headerText: {
        position: "absolute",
        left: 0,
        right: 0,
        textAlign: "center",
        fontSize: 18,
        fontWeight: "bold",
        color: COLORS.ITEM_TEXT,
    },
    avatarWrapper: {
        alignSelf: 'center',
        position: 'relative',
        marginBottom: 30,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: COLORS.ITEM_BORDER,
        backgroundColor: COLORS.BACKGROUND,
    },
    editIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: COLORS.ITEM_BACKGROUND,
        borderRadius: 15,
        padding: 4,
        borderWidth: 2,
        borderColor: COLORS.ITEM_BORDER,
    },
});
export default CreateUser;