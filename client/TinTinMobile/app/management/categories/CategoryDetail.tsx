import { COLORS } from "@/util/constant";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from "react-native"
import { router, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import ShareTextInput from "@/components/ShareTextInput";
import { Formik } from "formik";
import { useActionSheet } from "@expo/react-native-action-sheet";
import ShareButton from "@/components/ShareButton";
import ProfileInput from "@/components/ProfileInput";
import Toast from "react-native-toast-message";
import { callGetCategoryById, callUpdateCategory, callDeleteCategory } from "@/config/api";
import { ICategory } from "@/types/backend";
import * as Yup from 'yup';

const STATUS_OPTIONS = [
    { label: "Hoạt động", value: true },
    { label: "Không hoạt động", value: false },
];

// Schema validation cho category
const categorySchema = Yup.object().shape({
    name: Yup.string()
        .min(2, 'Tên danh mục phải có ít nhất 2 ký tự')
        .max(50, 'Tên danh mục không được quá 50 ký tự')
        .required('Tên danh mục là bắt buộc'),
    description: Yup.string()
        .min(10, 'Mô tả phải có ít nhất 10 ký tự')
        .max(200, 'Mô tả không được quá 200 ký tự')
        .required('Mô tả là bắt buộc'),
});

const CategoryDetailScreen = () => {
    const { showActionSheetWithOptions } = useActionSheet();
    const { id } = useLocalSearchParams<{ id: string }>();

    const [category, setCategory] = useState<ICategory | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [status, setStatus] = useState<boolean>(true);

    // Fetch category data
    useEffect(() => {
        if (id) {
            fetchCategoryDetail();
        }
    }, [id]);

    const fetchCategoryDetail = async () => {
        try {
            setLoading(true);
            const response = await callGetCategoryById(id);
            if (response && response.data) {
                const categoryData = response.data;
                setCategory(categoryData);
                setStatus(categoryData.active ?? true); 
            } else {
                throw new Error("No data received");
            }
        } catch (error) {
            console.error("Fetch category error:", error);
            Toast.show({
                text1: "Lỗi tải dữ liệu",
                text2: "Không thể tải thông tin danh mục",
                type: "error",
            });
            router.back();
        } finally {
            setLoading(false);
        }
    };

    const openStatusPicker = () => {
        const options = ["Hoạt động", "Không hoạt động", "Hủy"];
        const cancelButtonIndex = 2;

        showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
            },
            (buttonIndex) => {
                if (buttonIndex === 0) {
                    setStatus(true);
                } else if (buttonIndex === 1) {
                    setStatus(false);

                }
            }
        );
    };

    const handleUpdateCategory = async (values: any) => {
        if (!category) {
            console.error("No category data available");
            return;
        }

        try {
            setUpdating(true);

            // Validate trước khi update
            if (!values.name?.trim()) {
                Toast.show({
                    text1: "Lỗi validation",
                    text2: "Tên danh mục không được để trống",
                    type: "error",
                });
                return;
            }

            if (!values.description?.trim()) {
                Toast.show({
                    text1: "Lỗi validation",
                    text2: "Mô tả không được để trống",
                    type: "error",
                });
                return;
            }

            // Tạo object category cập nhật - chỉ gửi các field cần thiết
            const updatedCategory = {
                id: category.id,
                name: values.name.trim(),
                description: values.description.trim(),
                active: status,
            };

            const response = await callUpdateCategory(updatedCategory);

            if (response.data){
                Toast.show({
                    text1: "Cập nhật thành công",
                    type: "success",
                });
                setIsEditing(false);
                // Refresh data sau khi update thành công
                await fetchCategoryDetail();
            } else {
                throw new Error(response?.message || "Update failed");
            }
        } catch (error: any) {
            console.error("Update error:", error);
            
            let errorMessage = "Vui lòng thử lại";
            
            // Xử lý các loại lỗi khác nhau
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }

            Toast.show({
                text1: "Cập nhật thất bại",
                text2: errorMessage,
                type: "error",
            });
        } finally {
            setUpdating(false);
        }
    };

    const handleDeleteCategory = () => {
        Alert.alert(
            "Xác nhận xóa",
            "Bạn có chắc chắn muốn xóa danh mục này không?",
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
                            const response = await callDeleteCategory(id);
                            
                            Toast.show({
                                text1: "Xóa thành công",
                                type: "success",
                            });
                            router.back();
                        } catch (error: any) {
                            console.error("Delete error:", error);
                            Toast.show({
                                text1: "Xóa thất bại",
                                text2: error.response?.data?.message || "Vui lòng thử lại",
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
            if (category) {
                setStatus(category.active ?? true);
            }
        }
        setIsEditing(!isEditing);
    };

    const getStatusLabel = (active: boolean) => {
        return STATUS_OPTIONS.find(item => item.value === active)?.label || "";
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.centered]}>
                <ActivityIndicator size="large" color={COLORS.SUCCESS} />
                <Text style={styles.loadingText}>Đang tải...</Text>
            </View>
        );
    }

    if (!category) {
        return (
            <View style={[styles.container, styles.centered]}>
                <Text style={styles.errorText}>Không tìm thấy danh mục</Text>
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
                    {isEditing ? "Chỉnh sửa danh mục" : "Chi tiết danh mục"}
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
                            onPress={handleDeleteCategory}
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
                    <Formik
                        initialValues={{
                            name: category.name || "",
                            description: category.description || "",
                        }}
                        validationSchema={categorySchema}
                        onSubmit={(values) => {
                            handleUpdateCategory(values);
                        }}
                        enableReinitialize={true}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid }) => (
                            <View>
                                <ShareTextInput
                                    title="Tên danh mục"
                                    value={values.name}
                                    onChangeText={(text) => {
                                       
                                        handleChange("name")(text);
                                    }}
                                    onBlur={handleBlur("name")}
                                    textStyle={styles.inputText}
                                    inputStyle={[styles.input, !isEditing && styles.inputDisabled]}
                                    error={isEditing && touched.name ? errors.name : undefined}
                                    editable={isEditing}
                                />

                                <ShareTextInput
                                    title="Mô tả"
                                    value={values.description}
                                    onChangeText={(text) => {
                                  
                                        handleChange("description")(text);
                                    }}
                                    onBlur={handleBlur("description")}
                                    textStyle={styles.inputText}
                                    inputStyle={[styles.input, styles.textArea, !isEditing && styles.inputDisabled]}
                                    error={isEditing && touched.description ? errors.description : undefined}
                                    multiline={true}
                                    numberOfLines={4}
                                    editable={isEditing}
                                />

                                <View>
                                    <Text style={styles.labelText}>Trạng thái</Text>
                                    <ProfileInput
                                        value={getStatusLabel(status)}
                                        onPress={openStatusPicker }
                                        iconName="checkmark-circle"
                                        disabled={!isEditing}
                                    />
                                </View>

                                {/* Thông tin bổ sung */}
                                {category.createdAt && (
                                    <View style={styles.infoRow}>
                                        <Text style={styles.infoLabel}>Ngày tạo:</Text>
                                        <Text style={styles.infoValue}>
                                            {new Date(category.createdAt).toLocaleDateString('vi-VN')}
                                        </Text>
                                    </View>
                                )}

                                {category.updatedAt && (
                                    <View style={styles.infoRow}>
                                        <Text style={styles.infoLabel}>Cập nhật lần cuối:</Text>
                                        <Text style={styles.infoValue}>
                                            {new Date(category.updatedAt).toLocaleDateString('vi-VN')}
                                        </Text>
                                    </View>
                                )}

                                {category.createdBy && (
                                    <View style={styles.infoRow}>
                                        <Text style={styles.infoLabel}>Tạo bởi:</Text>
                                        <Text style={styles.infoValue}>{category.createdBy}</Text>
                                    </View>
                                )}

                                {category.updatedBy && (
                                    <View style={styles.infoRow}>
                                        <Text style={styles.infoLabel}>Cập nhật bởi:</Text>
                                        <Text style={styles.infoValue}>{category.updatedBy}</Text>
                                    </View>
                                )}

                                {isEditing && (
                                    <ShareButton
                                        title={updating ? "Đang cập nhật..." : "Cập nhật"}
                                        onPress={() => {
                                        
                                            handleSubmit();
                                        }}
                                        btnStyle={[
                                            styles.button, 
                                            (updating || !isValid) && styles.buttonDisabled
                                        ]}
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

export default CategoryDetailScreen;