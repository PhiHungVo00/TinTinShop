import { Ionicons } from "@expo/vector-icons"
import { Tabs } from "expo-router"

const UserLayout = () => {
    return (
        <Tabs screenOptions={{
            headerShown: false,
        }}>
            <Tabs.Screen name="home/index"/>
            <Tabs.Screen name="favorites/index" />
            <Tabs.Screen name="orders/index"/>
            <Tabs.Screen name="notification/index"/>
        </Tabs>
    )
}

export default UserLayout;
