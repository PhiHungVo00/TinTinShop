import HeaderList from "@/components/HeaderList"
import { COLORS } from "@/util/constant"
import { View, StyleSheet, Text, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform, Switch } from "react-native";
import { useEffect } from "react"
import { useState } from "react"
import axios from "axios"
import DropDownPicker from 'react-native-dropdown-picker';
import { router } from "expo-router";
import ShareTextInput from "@/components/ShareTextInput";
import ShareButton from "@/components/ShareButton";
import { Formik } from "formik";
import * as Yup from "yup";
import { IAddressUser } from "@/types/backend";
import { createAddress } from "@/config/api";
import Toast from "react-native-toast-message";
import { useAppContext } from "@/context/AppContext";

const AddressSchema = Yup.object().shape({
    name: Yup.string().required("Vui lòng nhập tên người nhận"),
    phone: Yup.string()
        .matches(/^(0|\+84)[0-9]{9}$/, "Số điện thoại không hợp lệ")
        .required("Vui lòng nhập số điện thoại"),
    detail: Yup.string()
        .required("Vui lòng nhập số nhà, tên đường")
        .matches(
            /^[\p{L}\d\s,\/\-]{5,}$/u,
            "Địa chỉ không hợp lệ "
        ),

    province: Yup.string().required("Vui lòng chọn Tỉnh/Thành phố"),
    district: Yup.string().required("Vui lòng chọn Quận/Huyện"),
    ward: Yup.string().required("Vui lòng chọn Phường/Xã"),
});

const CreateAddress = () => {
    const { user } = useAppContext();
    const currentUser = user?.user;
    DropDownPicker.setTheme("DARK");
    const [isDefault, setIsDefault] = useState(false);
    const [provinceOpen, setProvinceOpen] = useState(false);
    const [provinceValue, setProvinceValue] = useState(null);
    const [provinceItems, setProvinceItems] = useState<any[]>([]);
    const [districtOpen, setDistrictOpen] = useState(false);
    const [districtValue, setDistrictValue] = useState(null);
    const [districtItems, setDistrictItems] = useState<any[]>([]);
    const [wardOpen, setWardOpen] = useState(false);
    const [wardValue, setWardValue] = useState(null);
    const [wardItems, setWardItems] = useState<any[]>([]);

    useEffect(() => {
        axios.get('https://provinces.open-api.vn/api/p/')
            .then(res => {
                const formatted = res.data.map((item: any) => ({
                    label: item.name,
                    value: item.code
                }));
                setProvinceItems(formatted);
            });
    }, []);

    useEffect(() => {
        if (provinceValue) {
            axios.get(`https://provinces.open-api.vn/api/p/${provinceValue}?depth=2`)
                .then(res => {
                    const districts = res.data.districts.map((item: any) => ({
                        label: item.name,
                        value: item.code
                    }));
                    setDistrictItems(districts);
                    setDistrictValue(null);
                    setWardItems([]);
                    setWardValue(null);
                });
        }
    }, [provinceValue]);

    useEffect(() => {
        if (districtValue) {
            axios.get(`https://provinces.open-api.vn/api/d/${districtValue}?depth=2`)
                .then(res => {
                    const wards = res.data.wards.map((item: any) => ({
                        label: item.name,
                        value: item.code
                    }));
                    setWardItems(wards);
                    setWardValue(null);
                });
        }
    }, [districtValue]);


    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
            <HeaderList title="Thêm địa chỉ" backPress={() => router.back()} showAdd={false} />
            <Formik
                initialValues={{
                    name: "",
                    phone: "",
                    detail: "",
                    note: "",
                    province: "",
                    district: "",
                    ward: "",
                }}
                validationSchema={AddressSchema}
                onSubmit={async (values) => {
                    const provinceObj = provinceItems.find(item => item.value === values.province);
                    const districtObj = districtItems.find(item => item.value === values.district);
                    const wardObj = wardItems.find(item => item.value === values.ward);
                    const addressUser: IAddressUser = {
                        addressLine: values.detail,
                        ward: wardObj.label,
                        district: districtObj.label,
                        province: provinceObj.label,
                        receiverName: values.name,
                        receiverPhone: values.phone,
                        description: values.note,
                        defaultAddress: isDefault,
                        user: {
                            id: currentUser?.id || "",
                        }
                    }
                    const res = await createAddress(addressUser);
                    if (res.data) {
                        Toast.show({
                            text1: "Thêm địa chỉ thành công",
                            type: "success",
                        });
                        router.back();
                    } else {
                        debugger;
                        Toast.show({
                            text1: "Thêm địa chỉ thất bại",
                            type: "error",
                        });
                    }
                }}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                    <ScrollView style={{ flex: 1, backgroundColor: COLORS.BACKGROUND, paddingBottom: 40 }}>
                        <View style={styles.inputContainer}>
                            <ShareTextInput
                                title={"Tên người nhận"}
                                value={values.name}
                                onChangeText={handleChange("name")}
                                onBlur={handleBlur("name")}
                                error={errors.name}
                                inputStyle={{ color: COLORS.ITEM_TEXT }}
                                textStyle={{color: COLORS.ITEM_TEXT}}
                            />
                        </View>
                        <View style={[styles.inputContainer]}>
                            <ShareTextInput
                                title={"Số điện thoại"}
                                value={values.phone}
                                onChangeText={handleChange("phone")}
                                onBlur={handleBlur("phone")}
                                error={errors.phone}
                                inputStyle={{ color: COLORS.ITEM_TEXT }}
                                textStyle={{color: COLORS.ITEM_TEXT}}
                            />
                        </View>
                        <View style={styles.dropDownContainer}>
                            <View style={styles.dropDownItem}>
                                <DropDownPicker
                                    open={provinceOpen}
                                    value={provinceValue}
                                    items={provinceItems}
                                    setOpen={setProvinceOpen}
                                    setValue={(callback) => {
                                        const value = callback(provinceValue);
                                        setProvinceValue(value);
                                        setFieldValue("province", value);
                                    }}
                                    setItems={setProvinceItems}
                                    searchable={true}
                                    placeholder="Chọn Tỉnh/Thành phố"
                                    searchPlaceholder="Tìm kiếm..."
                                    listMode="SCROLLVIEW"
                                    zIndex={3000}
                                />
                                {errors.province && touched.province && (
                                    <Text style={{ color: "red", marginTop: 4 }}>{errors.province}</Text>
                                )}
                            </View>

                            <View style={styles.dropDownItem}>
                                <DropDownPicker
                                    open={districtOpen}
                                    value={districtValue}
                                    items={districtItems}
                                    setOpen={setDistrictOpen}
                                    setValue={(callback) => {
                                        const value = callback(districtValue);
                                        setDistrictValue(value);
                                        setFieldValue("district", value);
                                    }}
                                    setItems={setDistrictItems}
                                    searchable={true}
                                    placeholder="Chọn Quận/Huyện"
                                    searchPlaceholder="Tìm kiếm..."
                                    listMode="SCROLLVIEW"
                                    zIndex={2000}
                                />
                                {errors.district && touched.district && (
                                    <Text style={{ color: "red", marginTop: 4 }}>{errors.district}</Text>
                                )}
                            </View>

                            <View style={styles.dropDownItem}>
                                <DropDownPicker
                                    open={wardOpen}
                                    value={wardValue}
                                    items={wardItems}
                                    setOpen={setWardOpen}
                                    setValue={(callback) => {
                                        const value = callback(wardValue);
                                        setWardValue(value);
                                        setFieldValue("ward", value);
                                    }}
                                    setItems={setWardItems}
                                    searchable={true}
                                    placeholder="Chọn Phường/Xã"
                                    searchPlaceholder="Tìm kiếm..."
                                    listMode="SCROLLVIEW"
                                    zIndex={1000}
                                />
                                {errors.ward && touched.ward && (
                                    <Text style={{ color: "red", marginTop: 4 }}>{errors.ward}</Text>
                                )}

                            </View>
                            <ShareTextInput
                                title={"Số nhà, tên đường"}
                                value={values.detail}
                                onChangeText={handleChange("detail")}
                                onBlur={handleBlur("detail")}
                                error={errors.detail}
                                inputStyle={{ color: COLORS.ITEM_TEXT }}
                                textStyle={{color: COLORS.ITEM_TEXT}}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <ShareTextInput title={"Ghi chú"}
                                multiline={true}
                                value={values.note}
                                onChangeText={handleChange("note")}
                                onBlur={handleBlur("note")}
                                error={errors.note}
                                inputStyle={{ color: COLORS.ITEM_TEXT, height: 100 }}
                                textStyle={{color: COLORS.ITEM_TEXT}}
                            />
                        </View>
                        <View style={styles.defaultContainer}>
                            <Text style={styles.defaultText}>Đặt làm địa chỉ mặc định</Text>
                            <Switch value={isDefault} onValueChange={setIsDefault} />
                        </View>
                        <ShareButton title="Lưu địa chỉ" onPress={handleSubmit}
                            btnStyle={{
                                marginHorizontal: 25,
                                backgroundColor: COLORS.PRIMARY,
                            }} />
                    </ScrollView>
                )}
            </Formik>
        </KeyboardAvoidingView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.BACKGROUND,
    },
    dropDownContainer: {
        marginBottom: 16,
        padding: 16,
    },
    dropDownItem: {
        marginVertical: 16,
        marginHorizontal: 10,

    },
    inputContainer: {
        marginHorizontal: 16,
    },
    defaultContainer: {
        marginHorizontal: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        margin: 16,
    },
    defaultText: {
        fontSize: 16,
        color: COLORS.ITEM_TEXT,
    }

})
export default CreateAddress;
