import { COLORS } from "@/util/constant";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Pressable, Image } from "react-native"
import { router } from "expo-router";
import { useState, useEffect } from "react";
import { requestImagePickerPermission } from "@/util/ImagePickerPermisison";
import * as ImagePicker from 'expo-image-picker';
import ShareTextInput from "@/components/ShareTextInput";
import { Formik } from "formik";
import { useActionSheet } from "@expo/react-native-action-sheet";
import ShareButton from "@/components/ShareButton";
import ProfileInput from "@/components/ProfileInput";
import Toast from "react-native-toast-message";
import { callUploadFile, callCreateProduct, callGetCategories } from "@/config/api";
import { ICategory } from "@/types/backend";
import { IProduct } from "@/types/product";
import * as Yup from 'yup';

const IPV4 = process.env.EXPO_PUBLIC_IPV4;
const PORT = process.env.EXPO_PUBLIC_PORT;
const image_url_base = `http://${IPV4}:${PORT}/storage`;

const ACTIVE_OPTIONS = [
    { label: "Hoạt động", value: true },
    { label: "Không hoạt động", value: false },
];

// Schema validation cho product
const productSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, 'Tên sản phẩm phải có ít nhất 2 ký tự')
        .max(100, 'Tên sản phẩm không được quá 100 ký tự')
        .required('Tên sản phẩm là bắt buộc'),
    description: Yup.string()
        .min(10, 'Mô tả phải có ít nhất 10 ký tự')
        .max(500, 'Mô tả không được quá 500 ký tự')
        .required('Mô tả là bắt buộc'),
});

const CreateProductScreen = () => {
    const { showActionSheetWithOptions } = useActionSheet();
    const [imageUri, setImageUri] = useState<string>('');
    const [imageFileName, setImageFileName] = useState<string>('');
    const [active, setActive] = useState<boolean>(true);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    // Fetch categories khi component mount
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await callGetCategories({ filter: "active:'true'" });
            if (response.data) {
                // Chỉ lấy categories đang hoạt động
                const activeCategories = response.data.filter(cat => cat.active);
                setCategories(activeCategories);
            }
        } catch (error) {
            Toast.show({
                text1: "Lỗi tải danh mục",
                text2: "Không thể tải danh sách danh mục",
                type: "error",
            });
        }
    };

    const openActivePicker = () => {
        const options = [...ACTIVE_OPTIONS.map(item => item.label), "Cancel"];
        const cancelButtonIndex = options.length - 1;
    
        showActionSheetWithOptions(
          {
            options,
            cancelButtonIndex,
          },
          (buttonIndex) => {
            if (buttonIndex !== undefined && buttonIndex < ACTIVE_OPTIONS.length) {
                setActive(ACTIVE_OPTIONS[buttonIndex].value);
            }
          }
        );
    };

    const openCategoryPicker = () => {
        if (categories.length === 0) {
            Toast.show({
                text1: "Không có danh mục",
                text2: "Vui lòng thêm danh mục trước",
                type: "info",
            });
            return;
        }

        const options = [...categories.map(cat => cat.name), "Cancel"];
        const cancelButtonIndex = options.length - 1;
    
        showActionSheetWithOptions(
          {
            options,
            cancelButtonIndex,
          },
          (buttonIndex) => {
            if (buttonIndex !== undefined && buttonIndex < categories.length) {
                setSelectedCategory(categories[buttonIndex]);
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

    const handleCreateProduct = async (values: any) => {
        if (!selectedCategory) {
            Toast.show({
                text1: "Vui lòng chọn danh mục",
                type: "error",
            });
            return;
        }

        if (!imageFileName) {
            Toast.show({
                text1: "Vui lòng chọn hình ảnh",
                type: "error",
            });
            return;
        }

        setLoading(true);
        
        try {
            // Upload ảnh
            let finalImageFileName = imageFileName;
            if (imageFileName.length > 0 && imageUri.length > 0) {
                const formData = new FormData();
                formData.append("file", {
                    uri: imageUri,
                    name: imageFileName,
                    type: "image/jpeg",
                } as any);
                formData.append("folder", "product");
                
                const res = await callUploadFile(formData);
                if (res.data) {
                    finalImageFileName = res.data.fileName;
                }
            }

            // Tạo object product
            const newProduct: IProduct = {
                id: "",
                name: values.name,
                description: values.description,
                image: finalImageFileName,
                active: active,
                category: selectedCategory,
                createdAt: "",
                updatedAt: "",
                createdBy: "",
                updatedBy: "",
            };

            const resProduct = await callCreateProduct(newProduct);
            if (resProduct.data) {
                Toast.show({
                    text1: "Tạo sản phẩm thành công",
                    type: "success",
                });
                router.back();
            } else {
                Toast.show({
                    text1: "Tạo sản phẩm thất bại",
                    type: "error",
                });
            }
        } catch (error) {
            console.error('Create product error:', error);
            Toast.show({
                text1: "Tạo sản phẩm thất bại",
                text2: "Vui lòng thử lại",
                type: "error",
            });
        } finally {
            setLoading(false);
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

                <Text style={styles.headerText}>Thêm mới sản phẩm</Text>
            </View>
            
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.imageWrapper}>
                        <Image
                            source={{ 
                                uri: imageUri || 'https://via.placeholder.com/100x100?text=No+Image' 
                            }}
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
                        }}
                        validationSchema={productSchema}
                        onSubmit={(values) => {
                            handleCreateProduct(values);
                        }}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                            <View>
                                <ShareTextInput
                                    title="Tên sản phẩm"
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

                                <View>
                                    <Text style={styles.labelText}>Danh mục</Text>
                                    <ProfileInput
                                        value={selectedCategory?.name || "Chọn danh mục"}
                                        onPress={openCategoryPicker}
                                        iconName="folder-open"
                                    />
                                </View>

                                <View>
                                    <Text style={styles.labelText}>Trạng thái</Text>
                                    <ProfileInput
                                        value={ACTIVE_OPTIONS.find(item => item.value === active)?.label || ""}
                                        onPress={openActivePicker}
                                        iconName="checkmark-circle"
                                    />
                                </View>

                                <ShareButton
                                    title={loading ? "Đang tạo..." : "Tạo mới"}
                                    onPress={handleSubmit}
                                    btnStyle={[styles.button, loading && styles.buttonDisabled]}
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
        fontSize: 16,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    inputText: {
        color: COLORS.ITEM_TEXT,
        fontSize: 16,
        fontWeight: "600",
    },
    labelText: {
        color: COLORS.ITEM_TEXT, 
        fontSize: 16, 
        fontWeight: "bold",
        marginBottom: 8,
        marginTop: 15,
    },
    button: {
        backgroundColor: COLORS.SUCCESS,
        opacity: 0.9,
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: "center",
        marginVertical: 30,
        flexDirection: "row",
        justifyContent: "center",
        gap: 8,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: "#ffffff",
        fontWeight: "bold",
        fontSize: 16,
    },
});

export default CreateProductScreen;