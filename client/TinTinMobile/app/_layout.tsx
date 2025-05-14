import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from 'expo-status-bar';
export default function RootLayout() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
    {/* <SafeAreaView style = {{flex: 1}}> */}
    <StatusBar hidden />
    <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/SignInScreen" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/SignUpScreen" options={{ headerShown: false }} />
      </Stack>
    {/* </SafeAreaView> */}
    </QueryClientProvider >
  )
}
