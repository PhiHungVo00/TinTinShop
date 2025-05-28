import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { COLORS } from "@/util/constant";
import AntDesign from '@expo/vector-icons/AntDesign';
interface ItemAddressProps {
    receiverName?: string;
    receiverPhone?: string;
    description?: string;
    defaultAddress: boolean;
    address: string;

}
const ItemAddress = ({ receiverName, receiverPhone, description, defaultAddress, address }: ItemAddressProps) => {
    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>{receiverName ? receiverName : ''}
                    {defaultAddress ? <Text style={{ color: "orange" }}>  [Mặc định]</Text> : ''}</Text>
            </View>
            {receiverPhone && <View>
                <Text style={styles.contentText}>{receiverPhone}</Text>
            </View>}
            {description && <View>
                <Text style={styles.contentText}>{description}</Text>
            </View>}
            <TouchableOpacity>
                <View style={styles.addressGroup}>
                    <View style={{ flex: 1, marginRight: 10 }}>
                        <Text
                            style={styles.contentText}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {address}
                        </Text>
                    </View>

                    <AntDesign name="enviromento" size={24} color={COLORS.ITEM_TEXT} />
                </View>

            </TouchableOpacity>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.ITEM_BACKGROUND,
        padding: 10,
        marginVertical: 10,
    },
    headerContainer: {
        marginBottom: 10,
    },
    headerText: {
        color: COLORS.ITEM_TEXT,
        fontSize: 16,
        fontWeight: "bold",
    },
    contentText: {
        color: COLORS.ITEM_TEXT,
    },
    addressGroup: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",

    }


})
export default ItemAddress;
