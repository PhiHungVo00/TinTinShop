import { COLORS } from "@/util/constant";
import { AntDesign, Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Pressable, Image } from "react-native"
import { router } from "expo-router";
import { useState } from "react";
import { requestImagePickerPermission } from "@/util/ImagePickerPermisison";
import * as ImagePicker from 'expo-image-picker';
import ShareTextInput from "@/components/ShareTextInput";
import { Formik } from "formik";
import userSchema from "@/util/userSchema";
import { useActionSheet } from "@expo/react-native-action-sheet";
import ShareButton from "@/components/ShareButton";
import ProfileInput from "@/components/ProfileInput";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Toast from "react-native-toast-message";
import { callUploadFile, createUser } from "@/config/api";
import { IUser } from "@/types/backend";
const image = {
    avatar_default: require("@/assets/images/setting/avatar_default.jpg"),
};
const IPV4 = process.env.EXPO_PUBLIC_IPV4;
const PORT = process.env.EXPO_PUBLIC_PORT;
const image_url_base = `http://${IPV4}:${PORT}/storage`;
const ROLES = ["Admin", "User", "Guest"];
const CreateUser = () => {
    const { showActionSheetWithOptions } = useActionSheet();
    const [avatarUri, setAvatarUri] = useState<string>('');
    const [avatarFileName, setAvatarFileName] = useState<string>('');
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const [isGenderPickerVisible, setGenderPickerVisible] = useState(false);
    const [isRolePickerVisible, setRolePickerVisible] = useState(false);
    const [gender, setGender] = useState<string>('');
    const [role, setRole] = useState<string>('');
    const [birthDate, setBirthDate] = useState<string>('');
    const showDatePicker = () => setDatePickerVisible(true);
    const hideDatePicker = () => setDatePickerVisible(false);
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
      const openRolePicker = () => {
        const options = ["Admin", "User", "Guest", "Cancel"];
        const cancelButtonIndex = 3;
    
        showActionSheetWithOptions(
          {
            options,
            cancelButtonIndex,
          },
          (buttonIndex) => {
            if (buttonIndex === 0) setRole("1");
            else if (buttonIndex === 1) setRole("2");
            else if (buttonIndex === 2) setRole("3");
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

   const handleCreateUser = async(values: any) => {
    console.log(values);
    if(avatarFileName.length > 0 && avatarUri.length > 0){
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
        }
    }
        const newUser: IUser ={
            name: values.name,
            email: values.email,
            password: values.password,
            phone: values.phone,
            gender: gender,
            role: {id: role, name: ROLES[parseInt(role)-1]},
            avatar: avatarFileName,
            birthdate: birthDate,
        }
        const resUser = await createUser(newUser);
        if(resUser.data){
            Toast.show({
                text1: "Tạo người dùng thành công",
                type: "success",
            });
            router.back();
        }else{
            Toast.show({
                text1: "Tạo người dùng thất bại",
                type: "error",
            });
        }
    
}
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
                    <Formik initialValues={{
                        name: "",
                        email: "",
                        password: "",
                        phone: ""
                    }}
                    validationSchema={userSchema}
                    onSubmit={(values) => {
                        handleCreateUser(values);
                    }}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
                             <View>
                                 <ShareTextInput
                              title="Name"
                              value={values.name}
                              onChangeText={handleChange("name")}
                              onBlur={handleBlur("name")}
                              textStyle={styles.inputText}
                              inputStyle={styles.input}
                              error={errors.name}   
                          />
                          <ShareTextInput
                              title="Email"
                              value={values.email}
                              onChangeText={handleChange("email")}
                              onBlur={handleBlur("email")}
                              textStyle={styles.inputText}
                              inputStyle={styles.input}
                              error={errors.email}
                          />
                           <ShareTextInput
                              title="Password"
                              value={values.password}
                              onChangeText={handleChange("password")}
                              onBlur={handleBlur("password")}
                              textStyle={styles.inputText}
                              inputStyle={styles.input}
                              error={errors.password}
                              isPassword={true}
                          />
                          <ShareTextInput
                              title="Phone"
                              value={values.phone}
                              onChangeText={handleChange("phone")}
                              onBlur={handleBlur("phone")}
                              textStyle={styles.inputText}
                              inputStyle={styles.input}
                              error={errors.phone}
                              keyboardType="numeric"
                              
                          />
                          <View >
                              <Text style={{color: COLORS.ITEM_TEXT, fontSize: 16, fontWeight: "bold"}}>Birthday</Text>
                              <ProfileInput
                                  value={birthDate} 
                                  onPress={showDatePicker}
                                  iconName="calendar"
                              />
                          </View>
                          <View >
                              <Text style={{color: COLORS.ITEM_TEXT, fontSize: 16, fontWeight: "bold"}}>Role</Text>
                              <ProfileInput
                                  value={ROLES[parseInt(role)-1]}
                                  onPress={openRolePicker}
                                  iconName="people"
                              />
                          </View>
                         
                          <DateTimePickerModal
                              isVisible={isDatePickerVisible}
                              mode="date"
                              onConfirm={handleConfirm}
                              onCancel={hideDatePicker}
                          />
                          <View >
                              <Text style={{color: COLORS.ITEM_TEXT, fontSize: 16, fontWeight: "bold"}}>Gender</Text>
                              <ProfileInput
                                  value={gender}
                                  onPress={openGenderPicker}
                                  iconName="male-female"
                                  
                              />
                          </View>
                          <ShareButton
                              title="Tạo mới"
                              onPress={handleSubmit}
                              btnStyle={styles.button}
                              textStyle={styles.buttonText}
                              logo={<Ionicons name="create-outline" size={24} color="black" />}
                          />
                         
                             </View>
                        )}
                    </Formik>

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
        backgroundColor: COLORS.SUCCESS,
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
export default CreateUser;