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
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Toast from "react-native-toast-message";
import { callUploadFile, callCreateCoupon } from "@/config/api";
import { ICoupon } from "@/types/backend";
import * as Yup from 'yup';
import { DiscountType } from "@/types/enums/DiscountType.enum";

const image = {
    coupon_default: require("@/assets/images/coupon/coupon_default.png"),
};

const IPV4 = process.env.EXPO_PUBLIC_IPV4;
const PORT = process.env.EXPO_PUBLIC_PORT;
const image_url_base = `http://${IPV4}:${PORT}/storage`;

const DISCOUNT_TYPES = [
    { label: "Percent (%)", value: DiscountType.PERCENT },
    { label: "Amount (VND)", value: DiscountType.AMOUNT }
];

// Validation schema for coupon
const couponSchema = Yup.object().shape({
    code: Yup.string()
        .required('Coupon code is required')
        .min(3, 'Code must be at least 3 characters')
        .max(20, 'Code must not exceed 20 characters')
        .matches(/^[A-Z0-9]+$/, 'Code must contain only uppercase letters and numbers'),
    description: Yup.string()
        .required('Description is required')
        .min(10, 'Description must be at least 10 characters')
        .max(200, 'Description must not exceed 200 characters'),
    discountValue: Yup.number()
        .required('Discount value is required')
        .positive('Discount value must be positive')
        .test('discount-validation', 'Invalid discount value', function(value) {
            const { discountType } = this.parent;
            if (discountType === DiscountType.PERCENT) {
                return value <= 100;
            }
            return value > 0;
        }),
    maxDiscount: Yup.number()
        .required('Max discount is required')
        .positive('Max discount must be positive'),
    minOrderValue: Yup.number()
        .required('Min order value is required')
        .min(0, 'Min order value must be 0 or greater'),
    quantity: Yup.number()
        .required('Quantity is required')
        .integer('Quantity must be an integer')
        .positive('Quantity must be positive'),
});

const CreateCoupon = () => {
    const { showActionSheetWithOptions } = useActionSheet();
    const [imageUri, setImageUri] = useState<string>('');
    const [imageFileName, setImageFileName] = useState<string>('');
    const [isStartDatePickerVisible, setStartDatePickerVisible] = useState(false);
    const [isEndDatePickerVisible, setEndDatePickerVisible] = useState(false);
    const [isDiscountTypePickerVisible, setDiscountTypePickerVisible] = useState(false);
    const [discountType, setDiscountType] = useState<DiscountType>(DiscountType.PERCENT);
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [isActive, setIsActive] = useState<boolean>(true);

    const showStartDatePicker = () => setStartDatePickerVisible(true);
    const hideStartDatePicker = () => setStartDatePickerVisible(false);
    const showEndDatePicker = () => setEndDatePickerVisible(true);
    const hideEndDatePicker = () => setEndDatePickerVisible(false);

    const handleStartDateConfirm = (date: Date) => {
        const formatted = `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}/${date.getFullYear()}`;
        setStartDate(formatted);
        hideStartDatePicker();
    };

    const handleEndDateConfirm = (date: Date) => {
        const formatted = `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}/${date.getFullYear()}`;
        setEndDate(formatted);
        hideEndDatePicker();
    };

    const openDiscountTypePicker = () => {
        const options = ["Percent (%)", "Amount (VND)", "Cancel"];
        const cancelButtonIndex = 2;

        showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
            },
            (buttonIndex) => {
                if (buttonIndex === 0) setDiscountType(DiscountType.PERCENT);
                else if (buttonIndex === 1) setDiscountType(DiscountType.AMOUNT);
            }
        );
    };

    const openStatusPicker = () => {
        const options = ["Active", "Inactive", "Cancel"];
        const cancelButtonIndex = 2;

        showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
            },
            (buttonIndex) => {
                if (buttonIndex === 0) setIsActive(true);
                else if (buttonIndex === 1) setIsActive(false);
            }
        );
    };

    const pickImageAsync = async () => {
        const permission = await requestImagePickerPermission();
        if (permission) {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [16, 9],
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

    const handleCreateCoupon = async (values: any) => {
        console.log(values);
        
        // Validate dates
        if (!startDate || !endDate) {
            Toast.show({
                text1: "Please select start date and end date",
                type: "error",
            });
            return;
        }

        // Upload image if selected
        let uploadedFileName = '';
        if (imageFileName.length > 0 && imageUri.length > 0) {
            const formData = new FormData();
            formData.append("file", {
                uri: imageUri,
                name: imageFileName,
                type: "image/jpeg",
            } as any);
            formData.append("folder", "coupon");
            const res = await callUploadFile(formData);
            if (res.data) {
                uploadedFileName = res.data.fileName;
            }
        }

        const newCoupon: ICoupon = {
            code: values.code.toUpperCase(),
            description: values.description,
            image: uploadedFileName,
            discountType: discountType,
            discountValue: parseFloat(values.discountValue),
            maxDiscount: parseFloat(values.maxDiscount),
            minOrderValue: parseFloat(values.minOrderValue),
            quantity: parseInt(values.quantity),
            startDate: startDate,
            endDate: endDate,
            isActive: isActive,
        }

        try {
            const resCoupon = await callCreateCoupon(newCoupon);
            if (resCoupon.data) {
                Toast.show({
                    text1: "Tạo coupon thành công",
                    type: "success",
                });
                router.back();
            } else {
                Toast.show({
                    text1: "Tạo coupon thất bại",
                    type: "error",
                });
            }
        } catch (error) {
            Toast.show({
                text1: "Có lỗi xảy ra khi tạo coupon",
                type: "error",
            });
        }
    }

    const getDiscountTypeLabel = () => {
        return discountType === DiscountType.PERCENT ? "Percent (%)" : "Amount (VND)";
    };

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

                <Text style={styles.headerText}>Thêm mới coupon</Text>
            </View>
            
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <ScrollView>
                    <View style={styles.imageWrapper}>
                        <Image
                            source={imageUri ? { uri: imageUri } : image.coupon_default}
                            style={styles.couponImage}
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
                            code: "",
                            description: "",
                            discountValue: "",
                            maxDiscount: "",
                            minOrderValue: "",
                            quantity: ""
                        }}
                        validationSchema={couponSchema}
                        onSubmit={(values) => {
                            handleCreateCoupon(values);
                        }}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, setFieldValue }) => (
                            <View>
                                <ShareTextInput
                                    title="Coupon Code"
                                    value={values.code}
                                    onChangeText={(text) => setFieldValue("code", text.toUpperCase())}
                                    onBlur={handleBlur("code")}
                                    textStyle={styles.inputText}
                                    inputStyle={styles.input}
                                    error={errors.code}
                                    placeholder="Enter coupon code (e.g., SAVE20)"
                                />
                                
                                <ShareTextInput
                                    title="Description"
                                    value={values.description}
                                    onChangeText={handleChange("description")}
                                    onBlur={handleBlur("description")}
                                    textStyle={styles.inputText}
                                    inputStyle={[styles.input, styles.textArea]}
                                    error={errors.description}
                                    placeholder="Enter coupon description"
                                    multiline={true}
                                    numberOfLines={3}
                                />

                                <View>
                                    <Text style={styles.labelText}>Discount Type</Text>
                                    <ProfileInput
                                        value={getDiscountTypeLabel()}
                                        onPress={openDiscountTypePicker}
                                        iconName="pricetag"
                                    />
                                </View>

                                <ShareTextInput
                                    title={`Discount Value ${discountType === DiscountType.PERCENT ? '(%)' : '(VND)'}`}
                                    value={values.discountValue}
                                    onChangeText={handleChange("discountValue")}
                                    onBlur={handleBlur("discountValue")}
                                    textStyle={styles.inputText}
                                    inputStyle={styles.input}
                                    error={errors.discountValue}
                                    keyboardType="numeric"
                                    placeholder={discountType === DiscountType.PERCENT ? "Enter percentage (1-100)" : "Enter amount in VND"}
                                />

                                <ShareTextInput
                                    title="Max Discount (VND)"
                                    value={values.maxDiscount}
                                    onChangeText={handleChange("maxDiscount")}
                                    onBlur={handleBlur("maxDiscount")}
                                    textStyle={styles.inputText}
                                    inputStyle={styles.input}
                                    error={errors.maxDiscount}
                                    keyboardType="numeric"
                                    placeholder="Maximum discount amount"
                                />

                                <ShareTextInput
                                    title="Min Order Value (VND)"
                                    value={values.minOrderValue}
                                    onChangeText={handleChange("minOrderValue")}
                                    onBlur={handleBlur("minOrderValue")}
                                    textStyle={styles.inputText}
                                    inputStyle={styles.input}
                                    error={errors.minOrderValue}
                                    keyboardType="numeric"
                                    placeholder="Minimum order value required"
                                />

                                <ShareTextInput
                                    title="Quantity"
                                    value={values.quantity}
                                    onChangeText={handleChange("quantity")}
                                    onBlur={handleBlur("quantity")}
                                    textStyle={styles.inputText}
                                    inputStyle={styles.input}
                                    error={errors.quantity}
                                    keyboardType="numeric"
                                    placeholder="Number of coupons available"
                                />

                                <View>
                                    <Text style={styles.labelText}>Start Date</Text>
                                    <ProfileInput
                                        value={startDate}
                                        onPress={showStartDatePicker}
                                        iconName="calendar"
                                    />
                                </View>

                                <View>
                                    <Text style={styles.labelText}>End Date</Text>
                                    <ProfileInput
                                        value={endDate}
                                        onPress={showEndDatePicker}
                                        iconName="calendar"
                                    />
                                </View>

                                <View>
                                    <Text style={styles.labelText}>Status</Text>
                                    <ProfileInput
                                        value={isActive ? "Active" : "Inactive"}
                                        onPress={openStatusPicker}
                                        iconName="checkmark-circle"
                                    />
                                </View>

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
                                    minimumDate={new Date()}
                                />

                                <ShareButton
                                    title="Tạo Coupon"
                                    onPress={handleSubmit}
                                    btnStyle={styles.button}
                                    textStyle={styles.buttonText}
                                    logo={<Ionicons name="ticket-outline" size={24} color="white" />}
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
        marginBottom: 5,
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
        gap: 10,
    },
    buttonText: {
        color: "#ffffff",
        fontWeight: "bold",
        fontSize: 16,
    },
});

export default CreateCoupon;