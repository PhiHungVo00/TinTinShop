import { Ionicons } from "@expo/vector-icons"
import { Tabs } from "expo-router"

const UserLayout = () => {
    return (
        <Tabs>
            <Tabs.Screen name="home" options={ {
               headerShown: false,
            }} />
            <Tabs.Screen name="favorites" options={{ headerShown: false }} />
        </Tabs>
    )
}

export default UserLayout;
