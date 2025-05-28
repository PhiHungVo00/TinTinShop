import { IUser } from "@/types/backend";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native"
import AntDesign from '@expo/vector-icons/AntDesign';
import { COLORS } from "@/util/constant";
interface ItemUserProps {
    title: string,
    description: string,
    imageUri?: string,
    editPress: () => void,
    deletePress?: () => void,
    showDelete?: boolean,
}
const image = {
    avatar_default: require("@/assets/images/setting/avatar_default.jpg"),
};
const ItemUser = ({ title, description, imageUri, editPress, deletePress, showDelete = true }: ItemUserProps) => {
    return (
        <View style={styles.container}>
            <View>
                <Image 
                    source={imageUri ? { uri: imageUri   } : image.avatar_default} 
                    style={styles.image} />
            </View>
            <View>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.description}>{description}</Text>

            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={editPress}>
                    <AntDesign name="edit" size={24} color={COLORS.ITEM_TEXT} />
                </TouchableOpacity>
                {showDelete && (
                    <TouchableOpacity onPress={deletePress}>
                        <AntDesign name="delete" size={24} color={COLORS.ITEM_TEXT} />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    )
}           
const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 1,
        borderColor: COLORS.ITEM_BORDER,
        padding: 16,
        borderRadius: 25,
        marginVertical: 10,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 1,
        borderColor: COLORS.ITEM_BORDER,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        color: COLORS.ITEM_TEXT,
    },
    description: {
        fontSize: 12,
        color: COLORS.ITEM_TEXT,
    },
    buttonContainer: {
        flexDirection: "column",
        gap: 15,
    },

});
export default ItemUser;
