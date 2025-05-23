import { COLORS } from "@/util/constant";
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, StyleProp, TextStyle } from "react-native";

interface IconCardProps {
    icon: React.ReactNode;
    title?: string;
    description?: string;
    onPress: () => void;
    containerStyle?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
}
const IconCard = ({ icon, title, description, onPress, containerStyle, textStyle }: IconCardProps) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={[styles.container, containerStyle]}>
                {icon}
                <Text style={[styles.title, textStyle]}>{title}</Text>
                <Text style={[styles.description, textStyle]}>{description}</Text>
            </View>
        </TouchableOpacity>
    )
} 
const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        paddingTop: 20,
        borderWidth: 1,
        borderColor: COLORS.ITEM_BORDER,
        borderRadius: 10,
        height: 100,
        width: 110,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
    },
    description: {
        fontSize: 14,
    },
})

export default IconCard;
