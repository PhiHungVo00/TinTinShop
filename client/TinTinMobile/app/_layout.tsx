import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import CustomToast from "@/components/CustomToast";
import { AppProvider } from "@/context/AppContext";
import { COLORS } from "@/util/constant";

// ✅ THÊM CÁC DÒNG SAU
import { LoadingProvider, useLoading } from "@/context/LoadingContext";
import LoadingModal from "@/components/LoadingModal";
import { useEffect } from "react";
import { setLoadingHandler } from "@/config/axios-customize"; // ✅ import hàm cấu hình loading

function WithLoadingHandler() {
  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    setLoadingHandler({ showLoading, hideLoading });
  }, []);

  return null;
}

export default function RootLayout() {
  const toastConfig = {
    success: (props: any) => <CustomToast {...props} type="success" />,
    error: (props: any) => <CustomToast {...props} type="error" />,
  };

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <LoadingProvider>
        <AppProvider>
          <StatusBar hidden />
          <Stack screenOptions={{ headerShown: false }} />
          <WithLoadingHandler />
          <LoadingModal />
          <Toast config={toastConfig} />
        </AppProvider>
      </LoadingProvider>
    </QueryClientProvider>
  );
}
