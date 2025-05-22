import { Tabs } from "expo-router";
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import { COLORS } from "@/util/constant";

const TabLayout = () => {
    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: "orange",
            tabBarInactiveTintColor: "gray",
            tabBarStyle: {
              backgroundColor: COLORS.BACKGROUND,
            },
            
            
        }}>
        <Tabs.Screen name="dashboard/index" options={{ 
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="home" color={color} size={size} />
          ),
        }} />
        <Tabs.Screen name="orders/index" options={{ 
          title: 'Orders',
          tabBarIcon: ({ color, size }) => (
            <Entypo name="box" size={size} color={color} />
          ),
        }} />
        <Tabs.Screen name="menu/index" options={{ 
          title: 'Menu',
          tabBarIcon: ({ color, size }) => (
            <Entypo name="menu" size={size} color={color} />
          ),
        }} />
        <Tabs.Screen name="coupon/index" options={{ 
          title: 'Coupon',
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="gift" size={size} color={color} />
          ),
        }} />
        <Tabs.Screen name="setting/index" options={{ 
          title: 'Setting',
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="setting" size={size} color={color} />
          ), }} />
      </Tabs>
    )
}

export default TabLayout;
