import HeaderList from "@/components/HeaderList"
import { COLORS } from "@/util/constant"
import { View, StyleSheet } from "react-native"
import { router } from "expo-router"

const AddressDetail = () => {
    return (
        <View style={styles.container}>
            <HeaderList title="Chi tiết địa chỉ"
                backPress={() => router.back()}
                showAdd={false}
            />
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.BACKGROUND,
    }
})
export default AddressDetail;