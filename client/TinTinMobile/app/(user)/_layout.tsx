import { Tabs } from "expo-router"
import AntDesign from '@expo/vector-icons/AntDesign';
import { COLORS } from "@/util/constant";

const UserLayout = () => {
    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: "orange",
            tabBarInactiveTintColor: "gray",

            tabBarStyle: {
                backgroundColor: COLORS.BACKGROUND,

            }
         
        }}>
            <Tabs.Screen name="home/index" options={{
                title: 'Home',
                tabBarIcon: ({ color, size }) => (
                    <AntDesign name="home" color={color} size={size} />
                ),
            }} />
            <Tabs.Screen name="favorites/index" options={{
                title: 'Favorites',
                tabBarIcon: ({ color, size }) => (
                    <AntDesign name="heart" color={color} size={size} />
                ),
            }} />
            <Tabs.Screen name="orders/index" options={{
                title: 'Orders',
                tabBarIcon: ({ color, size }) => (
                    <AntDesign name="shoppingcart" color={color} size={size} />
                ),
            }} />
            <Tabs.Screen name="settings/index" options={{
                title: 'Settings',
                tabBarIcon: ({ color, size }) => (
                    <AntDesign name="setting" color={color} size={size} />
                ),
            }} />
            <Tabs.Screen name="payment/index" options={{
                headerShown: false,
                href: null,
            }} />
        </Tabs>
    )
}

export default UserLayout;
