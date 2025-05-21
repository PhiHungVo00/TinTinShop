import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from 'expo-status-bar';
import Toast from "react-native-toast-message";
import CustomToast from "@/components/CustomToast";
import { AppProvider } from "@/context/AppContext";

export default function RootLayout() {
  const toastConfig = {
    success: (props: any) => <CustomToast {...props} type="success" />,
    error: (props: any) => <CustomToast {...props} type="error" />,
  };

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <StatusBar hidden />
        <Stack screenOptions={{ headerShown: false }} />
        <Toast config={toastConfig} />
      </AppProvider>
    </QueryClientProvider>
  );
}
