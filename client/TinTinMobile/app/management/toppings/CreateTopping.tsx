import { COLORS } from "@/util/constant";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Pressable, Image } from "react-native"
import { router } from "expo-router";
import { useState } from "react";
import { requestImagePickerPermission } from "@/util/ImagePickerPermisison";
import * as ImagePicker from 'expo-image-picker';
import ShareTextInput from "@/components/ShareTextInput";
import { Formik } from "formik";
import { useActionSheet } from "@expo/react-native-action-sheet";
import ShareButton from "@/components/ShareButton";
import ProfileInput from "@/components/ProfileInput";
import Toast from "react-native-toast-message";
import { callUploadFile, callCreateTopping } from "@/config/api";
import { ITopping } from "@/types/backend";
import { ToppingStatus } from "@/types/enums/ToppingStatus.enum";
import * as Yup from 'yup';



const IPV4 = process.env.EXPO_PUBLIC_IPV4;
const PORT = process.env.EXPO_PUBLIC_PORT;
const image_url_base = `http://${IPV4}:${PORT}/storage`;

const STATUS_OPTIONS = [
    { label: "Hoạt động", value: ToppingStatus.ACTIVE },
    { label: "Không hoạt động", value: ToppingStatus.INACTIVE },
];

// Schema validation cho topping
const toppingSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, 'Tên topping phải có ít nhất 2 ký tự')
        .max(50, 'Tên topping không được quá 50 ký tự')
        .required('Tên topping là bắt buộc'),
    description: Yup.string()
        .min(10, 'Mô tả phải có ít nhất 10 ký tự')
        .max(200, 'Mô tả không được quá 200 ký tự')
        .required('Mô tả là bắt buộc'),
    price: Yup.number()
        .min(0, 'Giá phải lớn hơn hoặc bằng 0')
        .required('Giá là bắt buộc'),
});

const CreateToppingScreen = () => {
    const { showActionSheetWithOptions } = useActionSheet();
    const [imageUri, setImageUri] = useState<string>('');
    const [imageFileName, setImageFileName] = useState<string>('');
    const [status, setStatus] = useState<ToppingStatus>(ToppingStatus.ACTIVE);

    const openStatusPicker = () => {
        const options = [...STATUS_OPTIONS.map(item => item.label), "Cancel"];
        const cancelButtonIndex = options.length - 1;
    
        showActionSheetWithOptions(
          {
            options,
            cancelButtonIndex,
          },
          (buttonIndex) => {
            if (buttonIndex !== undefined && buttonIndex < STATUS_OPTIONS.length) {
                setStatus(STATUS_OPTIONS[buttonIndex].value);
            }
          }
        );
    };

    const pickImageAsync = async () => {
        const permission = await requestImagePickerPermission();
        if (permission) {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });
            
            if (!result.canceled) {
                const selectedAsset = result.assets[0];
                const fileUrl = selectedAsset.uri;
                setImageUri(fileUrl); 
                setImageFileName(fileUrl.split("/").pop() as string);
            }
        }
    };

    const handleCreateTopping = async (values: any) => {
        console.log(values);
        
        // Upload ảnh nếu có
        let finalImageFileName = imageFileName;
        if (imageFileName.length > 0 && imageUri.length > 0) {
            const formData = new FormData();
            formData.append("file", {
                uri: imageUri,
                name: imageFileName,
                type: "image/jpeg",
            } as any);
            formData.append("folder", "topping");
            
            const res = await callUploadFile(formData);
            if (res.data) {
                finalImageFileName = res.data.fileName;
            }
        }

        // Tạo object topping
        const newTopping:ITopping = {
            name: values.name,
            description: values.description,
            price: parseFloat(values.price),
            image: finalImageFileName,
            status: status,
            id: "",

        };

        try {
            const resTopping = await callCreateTopping(newTopping as ITopping);
            if (resTopping.data) {
                Toast.show({
                    text1: "Tạo topping thành công",
                    type: "success",
                });
                router.back();
            } else {
                Toast.show({
                    text1: "Tạo topping thất bại",
                    type: "error",
                });
            }
        } catch (error) {
            Toast.show({
                text1: "Tạo topping thất bại",
                text2: "Vui lòng thử lại",
                type: "error",
            });
        }
    };

    return (
        <View style={[styles.container, {paddingBottom: 100}]}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                    activeOpacity={0.7}
                >
                    <Ionicons name="arrow-back" size={24} color={COLORS.ITEM_TEXT} />
                </TouchableOpacity>

                <Text style={styles.headerText}>Thêm mới topping</Text>
            </View>
            
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <ScrollView>
                    <View style={styles.imageWrapper}>
                        <Image
                            source={{ uri: imageUri }}
                            style={styles.image}
                        />
                        <Pressable
                            style={styles.editIcon}
                            onPress={pickImageAsync}
                        >
                            <AntDesign name="edit" size={18} color={COLORS.ITEM_TEXT} />
                        </Pressable>
                    </View>

                    <Formik 
                        initialValues={{
                            name: "",
                            description: "",
                            price: "",
                        }}
                        validationSchema={toppingSchema}
                        onSubmit={(values) => {
                            handleCreateTopping(values);
                        }}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                            <View>
                                <ShareTextInput
                                    title="Tên topping"
                                    value={values.name}
                                    onChangeText={handleChange("name")}
                                    onBlur={handleBlur("name")}
                                    textStyle={styles.inputText}
                                    inputStyle={styles.input}
                                    error={errors.name}   
                                />
                                
                                <ShareTextInput
                                    title="Mô tả"
                                    value={values.description}
                                    onChangeText={handleChange("description")}
                                    onBlur={handleBlur("description")}
                                    textStyle={styles.inputText}
                                    inputStyle={[styles.input, styles.textArea]}
                                    error={errors.description}
                                    multiline={true}
                                    numberOfLines={4}
                                />
                                
                                <ShareTextInput
                                    title="Giá (VNĐ)"
                                    value={values.price}
                                    onChangeText={handleChange("price")}
                                    onBlur={handleBlur("price")}
                                    textStyle={styles.inputText}
                                    inputStyle={styles.input}
                                    error={errors.price}
                                    keyboardType="numeric"
                                />

                                <View>
                                    <Text style={styles.labelText}>Trạng thái</Text>
                                    <ProfileInput
                                        value={STATUS_OPTIONS.find(item => item.value === status)?.label || ""}
                                        onPress={openStatusPicker}
                                        iconName="checkmark-circle"
                                    />
                                </View>

                                <ShareButton
                                    title="Tạo mới"
                                    onPress={handleSubmit}
                                    btnStyle={styles.button}
                                    textStyle={styles.buttonText}
                                    logo={<Ionicons name="create-outline" size={24} color="white" />}
                                />
                            </View>
                        )}
                    </Formik>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
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
    imageWrapper: {
        alignSelf: 'center',
        position: 'relative',
        marginBottom: 30,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 10,
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
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    inputText: {
        color: COLORS.ITEM_TEXT,
    },
    labelText: {
        color: COLORS.ITEM_TEXT, 
        fontSize: 16, 
        fontWeight: "bold",
        marginBottom: 8,
    },
    button: {
        backgroundColor: COLORS.SUCCESS,
        opacity: 0.8,
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: "center",
        marginVertical: 20,
    },
    buttonText: {
        color: "#ffffff",
        fontWeight: "bold",
    },
});

export default CreateToppingScreen;