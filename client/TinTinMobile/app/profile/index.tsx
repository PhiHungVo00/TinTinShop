import { COLORS } from "@/util/constant";
import { View, Text, StyleSheet, TouchableOpacity, Pressable, Image, Keyboard, TouchableWithoutFeedback, ScrollView, ActionSheetIOS, KeyboardAvoidingView, Platform } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from "expo-router";
import AntDesign from '@expo/vector-icons/AntDesign';
import ShareTextInput from "@/components/ShareTextInput";
import { useState } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import ProfileInput from "@/components/ProfileInput";
import * as ImagePicker from 'expo-image-picker';
import { requestImagePickerPermission} from "@/util/ImagePickerPermisison";
import ShareButton from "@/components/ShareButton";
import { callUpdateUser, callUploadFile } from "@/config/api";
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Toast from "react-native-toast-message";
import { validateEmail } from "@/service/validate";
import { useActionSheet } from "@expo/react-native-action-sheet";
const image = {
    avatar_default: require("@/assets/images/setting/avatar_default.jpg"),
};
const IPV4 = process.env.EXPO_PUBLIC_IPV4;
const PORT = process.env.EXPO_PUBLIC_PORT;
const image_url_base = `http://${IPV4}:${PORT}/storage`;
const ProfileScreen = () => {

    const { showActionSheetWithOptions } = useActionSheet();
    const { userDataStr } = useLocalSearchParams();
    let userData = userDataStr ? JSON.parse(decodeURIComponent(userDataStr as string)) : null;

    const [name, setName] = useState<string>(userData?.name);
    const [email, setEmail] = useState<string>(userData?.email);
    const [birthDate, setBirthDate] = useState<string>(userData?.birthdate);
    const [gender, setGender] = useState<string>(userData?.gender);
    const [phone, setPhone] = useState<string>(userData?.phone);
    const [avatarUri, setAvatarUri] = useState<string>(`${image_url_base}/avatar/${userData?.avatar}`);
    const [avatarFileName, setAvatarFileName] = useState<string>(userData?.avatar);
    const [isDatePickerVisible, setDatePickerVisible] = useState<boolean>(false);
    const showDatePicker = () => setDatePickerVisible(true);
    const hideDatePicker = () => setDatePickerVisible(false);
    const [isUploadImage, setIsUploadImage] = useState<boolean>(false);
    const [nameError, setNameError] = useState<string>("");
    const [emailError, setEmailError] = useState<string>("");
    const [phoneError, setPhoneError] = useState<string>("");
    const handleConfirm = (date: Date) => {
        const formatted = `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}/${date.getFullYear()}`;
        setBirthDate(formatted);
        hideDatePicker();
    };

    const openGenderPicker = () => {
        const options = ["MALE", "FEMALE", "OTHER", "Cancel"];
        const cancelButtonIndex = 3;
    
        showActionSheetWithOptions(
          {
            options,
            cancelButtonIndex,
          },
          (buttonIndex) => {
            if (buttonIndex === 0) setGender("MALE");
            else if (buttonIndex === 1) setGender("FEMALE");
            else if (buttonIndex === 2) setGender("OTHER");
          }
        );
      };
    
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

    const handleUpdate = async() => {
        setNameError("");
        setEmailError("");
        setPhoneError("");
        let hasError = false;
        if(!name){
            setNameError("Tên không được để trống");
            hasError = true;
        }
        if(!email){
            setEmailError("Email không được để trống");
            hasError = true;
        }else{
            const emailValidation = validateEmail(email);
            if(!emailValidation.isValid){
                setEmailError(emailValidation.message);
                hasError = true;
            }
        }
        if(!phone){
            setPhoneError("Số điện thoại không được để trống");
            hasError = true;
        }
        if(hasError){
            return;
        }
        userData.name = name;
        userData.email = email;
        userData.phone = phone;
        userData.birthdate = birthDate;
        userData.gender = gender;
        if(isUploadImage){
            userData.avatar = avatarFileName;
        }
        const res = await callUpdateUser(userData);   
        if(res.data){
            Toast.show({
                text1: "Cập nhật thông tin thành công",
                type: "success",
            });
        }else{
            Toast.show({
                text1: "Cập nhật thông tin thất bại",
                type: "error",
            });
        }
        setNameError("");
        setEmailError("");
        setPhoneError("");
    }

    const handleUploadImage = async() => {
         if(avatarFileName != userData?.avatar && avatarUri != `${image_url_base}/avatar/${userData?.avatar}`){
            const formData = new FormData();
            formData.append("file", {
                uri: avatarUri,
                name: avatarFileName,
                type: "image/jpeg",
            } as any);
            formData.append("folder", "avatar");
            const res = await callUploadFile(formData);
            if(res.data){
                setAvatarFileName(res.data.fileName);
                setIsUploadImage(true);
                Toast.show({
                    text1: "Upload Image Success",
                    type: "success",
                });
            }else{
                Toast.show({
                    text1: "Upload Image Failed",
                    type: "error",
                });
            }
        }else{
            Toast.show({
                text1: "Bạn chưa thay đổi ảnh",
                type: "info",
            });
        }
    }

    const handleBack = async() =>{
        router.back();
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={handleBack}
                        style={styles.backButton}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="arrow-back" size={24} color={COLORS.ITEM_TEXT} />
                    </TouchableOpacity>

                    <Text style={styles.headerText}>Cập nhật thông tin</Text>
                </View>
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
                    <ScrollView>
                        {/* Avatar với icon chỉnh sửa */}
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

                    <ShareTextInput
                        title="Name"
                        value={name}
                        onChangeText={(text) => {
                            setName(text);
                        }}
                        textStyle={styles.inputText}
                        inputStyle={styles.input}
                        error={nameError}   
                    />
                    <ShareTextInput
                        title="Email"
                        value={email}
                        onChangeText={(text) => {
                            setEmail(text);
                        }}
                        textStyle={styles.inputText}
                        inputStyle={styles.input}
                        error={emailError}
                    />
                    <ShareTextInput
                        title="Phone"
                        value={phone}
                        onChangeText={(text) => {
                            setPhone(text);
                        }}
                        textStyle={styles.inputText}
                        inputStyle={styles.input}
                        error={phoneError}
                        keyboardType="numeric"
                        
                    />
                    <ProfileInput
                        value={birthDate}
                        onPress={showDatePicker}
                        iconName="calendar"
                    />

                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        onConfirm={handleConfirm}
                        onCancel={hideDatePicker}
                    />
                    <ProfileInput
                        value={gender}
                        onPress={openGenderPicker}
                        iconName="male-female"
                    />
                    <ShareButton
                        title="Cập nhật"
                        onPress={handleUpdate}
                        btnStyle={styles.button}
                        textStyle={styles.buttonText}
                        logo={<MaterialCommunityIcons name="update" size={24} color="black" />}
                    />
                    <ShareButton
                        title="Upload Image"
                        onPress={handleUploadImage}
                        btnStyle={styles.buttonUpload}
                        textStyle={styles.buttonText}
                        logo={<Feather name="upload-cloud" size={24} color="black" />}
                    />
                </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </TouchableWithoutFeedback>

    );
};

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
    input: {
        borderWidth: 1,
        borderColor: COLORS.ITEM_BORDER,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 15,
        backgroundColor: COLORS.ITEM_BACKGROUND,
        color: COLORS.ITEM_TEXT,
    },
    inputText: {
        color: COLORS.ITEM_TEXT,
    },
    button: {
        backgroundColor: "orange",
        opacity: 0.8,
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: "center",
        marginVertical: 10,
    },
    buttonText: {
        color: "#ffffff",
        fontWeight: "bold",
    },
    buttonUpload: {
        backgroundColor: "#0ea5e9",
        opacity: 0.8,
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: "center",
    }
});

export default ProfileScreen;
