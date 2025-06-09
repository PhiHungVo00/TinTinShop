import { COLORS } from "@/util/constant";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Pressable, Image, Alert, ActivityIndicator } from "react-native"
import { router, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import { requestImagePickerPermission } from "@/util/ImagePickerPermisison";
import * as ImagePicker from 'expo-image-picker';
import ShareTextInput from "@/components/ShareTextInput";
import { Formik } from "formik";
import { useActionSheet } from "@expo/react-native-action-sheet";
import ShareButton from "@/components/ShareButton";
import ProfileInput from "@/components/ProfileInput";
import Toast from "react-native-toast-message";
import { callUploadFile, callGetToppingById, callUpdateTopping, callDeleteTopping } from "@/config/api";
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

const ToppingDetail = () => {
    const { showActionSheetWithOptions } = useActionSheet();
    const { id } = useLocalSearchParams<{ id: string }>();

    const [topping, setTopping] = useState<ITopping | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [imageUri, setImageUri] = useState<string>('');
    const [imageFileName, setImageFileName] = useState<string>('');
    const [status, setStatus] = useState<ToppingStatus>(ToppingStatus.ACTIVE);

    // Fetch topping data
    useEffect(() => {
        if (id) {
            fetchToppingDetail();
        }
    }, [id]);

    const fetchToppingDetail = async () => {
        try {
            setLoading(true);
            const response = await callGetToppingById(id);
            if (response.data) {
                const toppingData = response.data;
                setTopping(toppingData);
                setStatus(toppingData.status);
                setImageFileName(toppingData.image || '');
                // Set image URI if exists
                if (toppingData.image) {
                    setImageUri(`${image_url_base}/${toppingData.image}`);
                }
            }
        } catch (error) {
            Toast.show({
                text1: "Lỗi tải dữ liệu",
                text2: "Không thể tải thông tin topping",
                type: "error",
            });
            router.back();
        } finally {
            setLoading(false);
        }
    };

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

    const handleUpdateTopping = async (values: any) => {
        if (!topping) return;

        try {
            setUpdating(true);

            // Upload ảnh mới nếu có
            let finalImageFileName = imageFileName;
            if (imageUri && !imageUri.startsWith('http') && imageFileName.length > 0) {
                const formData = new FormData();
                formData.append("file", {
                    uri: imageUri,
                    name: imageFileName,
                    type: "image/jpeg",
                } as any);
                formData.append("folder", "toppings");

                const res = await callUploadFile(formData);
                if (res.data) {
                    finalImageFileName = res.data.fileName;
                }
            }

            // Tạo object topping cập nhật
            const updatedTopping: ITopping = {
                ...topping,
                name: values.name,
                description: values.description,
                price: parseFloat(values.price),
                image: finalImageFileName,
                status: status,
            };

            const response = await callUpdateTopping(updatedTopping);
            if (response.data) {
                Toast.show({
                    text1: "Cập nhật thành công",
                    type: "success",
                });
                setIsEditing(false);
                fetchToppingDetail();
            } else {
                Toast.show({
                    text1: "Cập nhật thất bại",
                    type: "error",
                });
            }
        } catch (error) {
            Toast.show({
                text1: "Cập nhật thất bại",
                text2: "Vui lòng thử lại",
                type: "error",
            });
        } finally {
            setUpdating(false);
        }
    };

    const handleDeleteTopping = () => {
        Alert.alert(
            "Xác nhận xóa",
            "Bạn có chắc chắn muốn xóa topping này không?",
            [
                {
                    text: "Hủy",
                    style: "cancel"
                },
                {
                    text: "Xóa",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            setDeleting(true);
                            const response = await callDeleteTopping(id);
                            Toast.show({
                                text1: "Xóa thành công",
                                type: "success",
                            });
                            router.back();
                        } catch (error) {
                            Toast.show({
                                text1: "Xóa thất bại",
                                text2: "Vui lòng thử lại",
                                type: "error",
                            });
                        } finally {
                            setDeleting(false);
                        }
                    }
                }
            ]
        );
    };

    const toggleEditMode = () => {
        if (isEditing) {
            // Reset data when cancel editing
            if (topping) {
                setStatus(topping.status);
                setImageFileName(topping.image || '');
                if (topping.image) {
                    setImageUri(`${image_url_base}/${topping.image}`);
                } else {
                    setImageUri('');
                }
            }
        }
        setIsEditing(!isEditing);
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.centered]}>
                <ActivityIndicator size="large" color={COLORS.SUCCESS} />
                <Text style={styles.loadingText}>Đang tải...</Text>
            </View>
        );
    }

    if (!topping) {
        return (
            <View style={[styles.container, styles.centered]}>
                <Text style={styles.errorText}>Không tìm thấy topping</Text>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Text style={styles.backBtnText}>Quay lại</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={[styles.container, { paddingBottom: 100 }]}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                    activeOpacity={0.7}
                >
                    <Ionicons name="arrow-back" size={24} color={COLORS.ITEM_TEXT} />
                </TouchableOpacity>

                <Text style={styles.headerText}>
                    {isEditing ? "Chỉnh sửa topping" : "Chi tiết topping"}
                </Text>

                <View style={styles.headerActions}>
                    <TouchableOpacity
                        onPress={toggleEditMode}
                        style={styles.actionButton}
                        activeOpacity={0.7}
                    >
                        <Ionicons
                            name={isEditing ? "close" : "create-outline"}
                            size={24}
                            color={isEditing ? COLORS.ERROR : COLORS.SUCCESS}
                        />
                    </TouchableOpacity>

                    {!isEditing && (
                        <TouchableOpacity
                            onPress={handleDeleteTopping}
                            style={styles.actionButton}
                            activeOpacity={0.7}
                            disabled={deleting}
                        >
                            {deleting ? (
                                <ActivityIndicator size="small" color={COLORS.ERROR} />
                            ) : (
                                <MaterialIcons name="delete" size={24} color={COLORS.ERROR} />
                            )}
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <ScrollView>
                    <View style={styles.imageWrapper}>
                        <Image
                            source={{ uri: `${image_url_base}/topping/${topping.image}` }}
                            style={styles.image}
                        />
                        {isEditing && (
                            <Pressable
                                style={styles.editIcon}
                                onPress={pickImageAsync}
                            >
                                <AntDesign name="edit" size={18} color={COLORS.ITEM_TEXT} />
                            </Pressable>
                        )}
                    </View>

                    <Formik
                        initialValues={{
                            name: topping.name,
                            description: topping.description,
                            price: topping.price.toString(),
                        }}
                        validationSchema={toppingSchema}
                        onSubmit={(values) => {
                            handleUpdateTopping(values);
                        }}
                        enableReinitialize={true}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                            <View>
                                <ShareTextInput
                                    title="Tên topping"
                                    value={values.name}
                                    onChangeText={handleChange("name")}
                                    onBlur={handleBlur("name")}
                                    textStyle={styles.inputText}
                                    inputStyle={[styles.input, !isEditing && styles.inputDisabled]}
                                    error={isEditing ? errors.name : undefined}
                                    editable={isEditing}
                                />

                                <ShareTextInput
                                    title="Mô tả"
                                    value={values.description}
                                    onChangeText={handleChange("description")}
                                    onBlur={handleBlur("description")}
                                    textStyle={styles.inputText}
                                    inputStyle={[styles.input, styles.textArea, !isEditing && styles.inputDisabled]}
                                    error={isEditing ? errors.description : undefined}
                                    multiline={true}
                                    numberOfLines={4}
                                    editable={isEditing}
                                />

                                <ShareTextInput
                                    title="Giá (VNĐ)"
                                    value={values.price}
                                    onChangeText={handleChange("price")}
                                    onBlur={handleBlur("price")}
                                    textStyle={styles.inputText}
                                    inputStyle={[styles.input, !isEditing && styles.inputDisabled]}
                                    error={isEditing ? errors.price : undefined}
                                    keyboardType="numeric"
                                    editable={isEditing}
                                />

                                <View>
                                    <Text style={styles.labelText}>Trạng thái</Text>
                                    <ProfileInput
                                        value={STATUS_OPTIONS.find(item => item.value === status)?.label || ""}
                                        onPress={openStatusPicker}
                                        iconName="checkmark-circle"
                                        disabled={!isEditing}
                                    />
                                </View>

                                {/* Thông tin bổ sung */}
                                {topping.createdAt && (
                                    <View style={styles.infoRow}>
                                        <Text style={styles.infoLabel}>Ngày tạo:</Text>
                                        <Text style={styles.infoValue}>
                                            {new Date(topping.createdAt).toLocaleDateString('vi-VN')}
                                        </Text>
                                    </View>
                                )}

                                {topping.updatedAt && (
                                    <View style={styles.infoRow}>
                                        <Text style={styles.infoLabel}>Cập nhật lần cuối:</Text>
                                        <Text style={styles.infoValue}>
                                            {new Date(topping.updatedAt).toLocaleDateString('vi-VN')}
                                        </Text>
                                    </View>
                                )}

                                {isEditing && (
                                    <ShareButton
                                        title={updating ? "Đang cập nhật..." : "Cập nhật"}
                                        onPress={handleSubmit}
                                        btnStyle={[styles.button, updating && styles.buttonDisabled]}
                                        textStyle={styles.buttonText}
                                        logo={updating ?
                                            <ActivityIndicator size="small" color="white" /> :
                                            <Ionicons name="save-outline" size={24} color="white" />
                                        }

                                    />
                                )}
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
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 30,
    },
    backButton: {
        padding: 6,
    },
    headerText: {
        fontSize: 18,
        fontWeight: "bold",
        color: COLORS.ITEM_TEXT,
        flex: 1,
        textAlign: 'center',
        marginHorizontal: 10,
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionButton: {
        padding: 6,
        marginLeft: 10,
    },
    imageWrapper: {
        alignSelf: 'center',
        position: 'relative',
        marginBottom: 30,
    },
    image: {
        width: 120,
        height: 120,
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
    inputDisabled: {
        backgroundColor: COLORS.BACKGROUND,
        opacity: 0.7,
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
        flexDirection: 'row',
        justifyContent: 'center',
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        color: "#ffffff",
        fontWeight: "bold",
        marginLeft: 8,
    },
    loadingText: {
        marginTop: 10,
        color: COLORS.ITEM_TEXT,
        fontSize: 16,
    },
    errorText: {
        color: COLORS.ERROR,
        fontSize: 16,
        textAlign: 'center',
    },
    backBtn: {
        marginTop: 20,
        backgroundColor: COLORS.SUCCESS,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    backBtnText: {
        color: 'white',
        fontWeight: 'bold',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.ITEM_BORDER,
    },
    infoLabel: {
        color: COLORS.ITEM_TEXT,
        fontSize: 14,
        fontWeight: '500',
    },
    infoValue: {
        color: COLORS.ITEM_TEXT,
        fontSize: 14,
    },
});

export default ToppingDetail;