import { COLORS } from "@/util/constant";
import { View, Text, StyleSheet, TouchableOpacity, Pressable, Image, ScrollView, KeyboardAvoidingView, Platform, Switch } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from "expo-router";
import AntDesign from '@expo/vector-icons/AntDesign';
import ShareTextInput from "@/components/ShareTextInput";
import { useState } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import ProfileInput from "@/components/ProfileInput";
import * as ImagePicker from 'expo-image-picker';
import { requestImagePickerPermission } from "@/util/ImagePickerPermisison";
import ShareButton from "@/components/ShareButton";
import { callUpdateCoupon, callUploadFile } from "@/config/api";
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Toast from "react-native-toast-message";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { ICoupon } from "@/types/backend";
import { DiscountType } from "@/types/enums/DiscountType.enum";

const image = {
    coupon_default: require("@/assets/images/coupon/coupon_default.png"),
};

const IPV4 = process.env.EXPO_PUBLIC_IPV4;
const PORT = process.env.EXPO_PUBLIC_PORT;
const image_url_base = `http://${IPV4}:${PORT}/storage`;

const DISCOUNT_TYPES = ["PERCENT", "AMOUNT"];

const CouponDetail = () => {
    const { showActionSheetWithOptions } = useActionSheet();
    const { couponDataStr } = useLocalSearchParams();
    let couponData: ICoupon = couponDataStr ? JSON.parse(decodeURIComponent(couponDataStr as string)) : null;

    const [code, setCode] = useState<string>(couponData?.code || "");
    const [description, setDescription] = useState<string>(couponData?.description || "");
    const [discountType, setDiscountType] = useState<string>(couponData?.discountType || "PERCENT");
    const [discountValue, setDiscountValue] = useState<string>(couponData?.discountValue?.toString() || "");
    const [maxDiscount, setMaxDiscount] = useState<string>(couponData?.maxDiscount?.toString() || "");
    const [minOrderValue, setMinOrderValue] = useState<string>(couponData?.minOrderValue?.toString() || "");
    const [quantity, setQuantity] = useState<string>(couponData?.quantity?.toString() || "");
    const [startDate, setStartDate] = useState<string>(couponData?.startDate || "");
    const [endDate, setEndDate] = useState<string>(couponData?.endDate || "");
    const [isActive, setIsActive] = useState<boolean>(couponData?.isActive || false);
    const [imageUri, setImageUri] = useState<string>(`${image_url_base}/coupon/${couponData?.image}`);
    const [imageFileName, setImageFileName] = useState<string>(couponData?.image || "");
    
    const [isStartDatePickerVisible, setStartDatePickerVisible] = useState<boolean>(false);
    const [isEndDatePickerVisible, setEndDatePickerVisible] = useState<boolean>(false);
    const [isUploadImage, setIsUploadImage] = useState<boolean>(false);
    
    // Error states
    const [codeError, setCodeError] = useState<string>("");
    const [descriptionError, setDescriptionError] = useState<string>("");
    const [discountValueError, setDiscountValueError] = useState<string>("");
    const [maxDiscountError, setMaxDiscountError] = useState<string>("");
    const [minOrderValueError, setMinOrderValueError] = useState<string>("");
    const [quantityError, setQuantityError] = useState<string>("");
    const [startDateError, setStartDateError] = useState<string>("");
    const [endDateError, setEndDateError] = useState<string>("");

    const showStartDatePicker = () => setStartDatePickerVisible(true);
    const hideStartDatePicker = () => setStartDatePickerVisible(false);
    const showEndDatePicker = () => setEndDatePickerVisible(true);
    const hideEndDatePicker = () => setEndDatePickerVisible(false);

    const handleStartDateConfirm = (date: Date) => {
        const formatted = date.toISOString().split('T')[0];
        setStartDate(formatted);
        hideStartDatePicker();
    };

    const handleEndDateConfirm = (date: Date) => {
        const formatted = date.toISOString().split('T')[0];
        setEndDate(formatted);
        hideEndDatePicker();
    };

    const openDiscountTypePicker = () => {
        const options = ["Phần trăm (%)", "Số tiền cố định (VNĐ)", "Hủy"];
        const cancelButtonIndex = 2;

        showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
            },
            (buttonIndex) => {
                if (buttonIndex === 0) setDiscountType("PERCENT");
                else if (buttonIndex === 1) setDiscountType("AMOUNT");
            }
        );
    };

    const pickImageAsync = async () => {
        const permission = await requestImagePickerPermission();
        if (permission) {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [4, 3],
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

    const validateForm = () => {
        // Reset errors
        setCodeError("");
        setDescriptionError("");
        setDiscountValueError("");
        setMaxDiscountError("");
        setMinOrderValueError("");
        setQuantityError("");
        setStartDateError("");
        setEndDateError("");

        let hasError = false;

        if (!code.trim()) {
            setCodeError("Mã coupon không được để trống");
            hasError = true;
        }

        if (!description.trim()) {
            setDescriptionError("Mô tả không được để trống");
            hasError = true;
        }

        if (!discountValue || isNaN(Number(discountValue)) || Number(discountValue) <= 0) {
            setDiscountValueError("Giá trị giảm giá phải là số dương");
            hasError = true;
        }

        if (discountType === "PERCENT" && Number(discountValue) > 100) {
            setDiscountValueError("Phần trăm giảm giá không được vượt quá 100%");
            hasError = true;
        }

        if (!quantity || isNaN(Number(quantity)) || Number(quantity) <= 0) {
            setQuantityError("Số lượng phải là số dương");
            hasError = true;
        }

        if (!startDate) {
            setStartDateError("Ngày bắt đầu không được để trống");
            hasError = true;
        }

        if (!endDate) {
            setEndDateError("Ngày kết thúc không được để trống");
            hasError = true;
        }

        if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
            setEndDateError("Ngày kết thúc phải sau ngày bắt đầu");
            hasError = true;
        }

        return !hasError;
    };

    const handleUpdate = async () => {
        if (!validateForm()) {
            return;
        }

        const updateCoupon: ICoupon = {
            id: couponData?.id,
            code: code.trim(),
            description: description.trim(),
            image: imageFileName,
            discountType: discountType as DiscountType,
            discountValue: Number(discountValue),
            maxDiscount: Number(maxDiscount) || 0,
            minOrderValue: Number(minOrderValue) || 0,
            quantity: Number(quantity),
            startDate: startDate,
            endDate: endDate,
            isActive: isActive,
        };

        try {
            const res = await callUpdateCoupon(updateCoupon);

            if (res.data) {
                Toast.show({
                    text1: "Cập nhật coupon thành công",
                    type: "success",
                });
                router.back();
            } else {
                Toast.show({
                    text1: "Cập nhật coupon thất bại",
                    type: "error",
                });
            }
        } catch (error) {
            Toast.show({
                text1: "Có lỗi xảy ra khi cập nhật",
                type: "error",
            });
        }
    };

    const handleUploadImage = async () => {
        if (imageFileName !== couponData?.image && imageUri !== `${image_url_base}/coupon/${couponData?.image}`) {
            const formData = new FormData();
            formData.append("file", {
                uri: imageUri,
                name: imageFileName,
                type: "image/jpeg",
            } as any);
            formData.append("folder", "coupon");

            try {
                const res = await callUploadFile(formData);
                if (res.data) {
                    setImageFileName(res.data.fileName);
                    setIsUploadImage(true);
                    Toast.show({
                        text1: "Upload ảnh thành công",
                        type: "success",
                    });
                } else {
                    Toast.show({
                        text1: "Upload ảnh thất bại",
                        type: "error",
                    });
                }
            } catch (error) {
                Toast.show({
                    text1: "Có lỗi xảy ra khi upload ảnh",
                    type: "error",
                });
            }
        } else {
            Toast.show({
                text1: "Bạn chưa thay đổi ảnh",
                type: "info",
            });
        }
    };

    const handleBack = () => {
        router.back();
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}/${date.getFullYear()}`;
    };

    const getDiscountTypeDisplayName = (type: string) => {
        return type === "PERCENT" ? "Phần trăm (%)" : "Số tiền cố định (VNĐ)";
    };

    return (
        <View style={[styles.container, { paddingBottom: 100 }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={handleBack}
                    style={styles.backButton}
                    activeOpacity={0.7}
                >
                    <Ionicons name="arrow-back" size={24} color={COLORS.ITEM_TEXT} />
                </TouchableOpacity>
                <Text style={styles.headerText}>Chi tiết Coupon</Text>
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Coupon Image */}
                    <View style={styles.imageWrapper}>
                        <Image
                            source={imageFileName ? { uri: imageUri } : image.coupon_default}
                            style={styles.couponImage}
                        />
                        <Pressable
                            style={styles.editIcon}
                            onPress={pickImageAsync}
                        >
                            <AntDesign name="edit" size={18} color={COLORS.ITEM_TEXT} />
                        </Pressable>
                    </View>

                    {/* Coupon Code */}
                    <ShareTextInput
                        title="Mã Coupon"
                        value={code}
                        onChangeText={setCode}
                        textStyle={styles.inputText}
                        inputStyle={styles.input}
                        error={codeError}
                        placeholder="Nhập mã coupon"
                    />

                    {/* Description */}
                    <ShareTextInput
                        title="Mô tả"
                        value={description}
                        onChangeText={setDescription}
                        textStyle={styles.inputText}
                        inputStyle={[styles.input, styles.textArea]}
                        error={descriptionError}
                        placeholder="Nhập mô tả coupon"
                        multiline={true}
                        numberOfLines={3}
                    />

                    {/* Discount Type */}
                    <View>
                        <Text style={styles.labelText}>Loại giảm giá</Text>
                        <ProfileInput
                            value={getDiscountTypeDisplayName(discountType)}
                            onPress={openDiscountTypePicker}
                            iconName="pricetag"
                        />
                    </View>

                    {/* Discount Value */}
                    <ShareTextInput
                        title={`Giá trị giảm (${discountType === "PERCENT" ? "%" : "VNĐ"})`}
                        value={discountValue}
                        onChangeText={setDiscountValue}
                        textStyle={styles.inputText}
                        inputStyle={styles.input}
                        error={discountValueError}
                        placeholder={discountType === "PERCENT" ? "0-100" : "Nhập số tiền"}
                        keyboardType="numeric"
                    />

                    {/* Max Discount (only for PERCENT type) */}
                    {discountType === "PERCENT" && (
                        <ShareTextInput
                            title="Giảm tối đa (VNĐ)"
                            value={maxDiscount}
                            onChangeText={setMaxDiscount}
                            textStyle={styles.inputText}
                            inputStyle={styles.input}
                            error={maxDiscountError}
                            placeholder="Nhập số tiền giảm tối đa"
                            keyboardType="numeric"
                        />
                    )}

                    {/* Min Order Value */}
                    <ShareTextInput
                        title="Giá trị đơn hàng tối thiểu (VNĐ)"
                        value={minOrderValue}
                        onChangeText={setMinOrderValue}
                        textStyle={styles.inputText}
                        inputStyle={styles.input}
                        error={minOrderValueError}
                        placeholder="Nhập giá trị đơn hàng tối thiểu"
                        keyboardType="numeric"
                    />

                    {/* Quantity */}
                    <ShareTextInput
                        title="Số lượng"
                        value={quantity}
                        onChangeText={setQuantity}
                        textStyle={styles.inputText}
                        inputStyle={styles.input}
                        error={quantityError}
                        placeholder="Nhập số lượng coupon"
                        keyboardType="numeric"
                    />

                    {/* Start Date */}
                    <View>
                        <Text style={styles.labelText}>Ngày bắt đầu</Text>
                        <ProfileInput
                            value={formatDate(startDate)}
                            onPress={showStartDatePicker}
                            iconName="calendar"
                        />
                        {startDateError ? <Text style={styles.errorText}>{startDateError}</Text> : null}
                    </View>

                    {/* End Date */}
                    <View>
                        <Text style={styles.labelText}>Ngày kết thúc</Text>
                        <ProfileInput
                            value={formatDate(endDate)}
                            onPress={showEndDatePicker}
                            iconName="calendar"
                        />
                        {endDateError ? <Text style={styles.errorText}>{endDateError}</Text> : null}
                    </View>

                    {/* Active Status */}
                    <View style={styles.switchContainer}>
                        <Text style={styles.labelText}>Trạng thái hoạt động</Text>
                        <Switch
                            value={isActive}
                            onValueChange={setIsActive}
                            trackColor={{ false: COLORS.ITEM_BORDER, true: "#4CAF50" }}
                            thumbColor={isActive ? "#ffffff" : "#f4f3f4"}
                        />
                    </View>

                    {/* Date Pickers */}
                    <DateTimePickerModal
                        isVisible={isStartDatePickerVisible}
                        mode="date"
                        onConfirm={handleStartDateConfirm}
                        onCancel={hideStartDatePicker}
                        minimumDate={new Date()}
                    />

                    <DateTimePickerModal
                        isVisible={isEndDatePickerVisible}
                        mode="date"
                        onConfirm={handleEndDateConfirm}
                        onCancel={hideEndDatePicker}
                        minimumDate={startDate ? new Date(startDate) : new Date()}
                    />

                    {/* Buttons */}
                    <ShareButton
                        title="Cập nhật Coupon"
                        onPress={handleUpdate}
                        btnStyle={styles.button}
                        textStyle={styles.buttonText}
                        logo={<MaterialCommunityIcons name="update" size={24} color="white" />}
                    />

                    <ShareButton
                        title="Upload Ảnh"
                        onPress={handleUploadImage}
                        btnStyle={styles.buttonUpload}
                        textStyle={styles.buttonText}
                        logo={<Feather name="upload-cloud" size={24} color="white" />}
                    />
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
    couponImage: {
        width: 200,
        height: 120,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: COLORS.ITEM_BORDER,
        backgroundColor: COLORS.BACKGROUND,
    },
    editIcon: {
        position: 'absolute',
        bottom: -5,
        right: -5,
        backgroundColor: COLORS.ITEM_BACKGROUND,
        borderRadius: 15,
        padding: 6,
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
    errorText: {
        color: "red",
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
    switchContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 15,
        paddingVertical: 10,
    },
    button: {
        backgroundColor: "#FF6B35",
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: "center",
        marginVertical: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonText: {
        color: "#ffffff",
        fontWeight: "bold",
        fontSize: 16,
    },
    buttonUpload: {
        backgroundColor: "#0ea5e9",
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});

export default CouponDetail;