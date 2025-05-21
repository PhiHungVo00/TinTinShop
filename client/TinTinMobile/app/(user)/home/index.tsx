import { View, Text, StyleSheet } from "react-native"
import { COLORS } from "@/util/constant"
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.BACKGROUND,
    }
})
const HomeScreen = () => {
    return (
        <View style={styles.container}>
            <Text>Home screen</Text>
        </View>
    )
}

export default HomeScreen;
