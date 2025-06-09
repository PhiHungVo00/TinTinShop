import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import CustomToast from "@/components/CustomToast";
import { AppProvider } from "@/context/AppContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { OrderProvider } from "@/context/OrderContext";
import { CartProvider } from "@/context/CartContext";
import { DiscountProvider } from "@/context/DiscountContext";
import { COLORS } from "@/util/constant";
import "react-native-reanimated";
import "react-native-gesture-handler";
import { LoadingProvider, useLoading } from "@/context/LoadingContext";
import LoadingModal from "@/components/LoadingModal";
import { useEffect } from "react";
import { setLoadingHandler } from "@/config/axios-customize"; 
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
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
       <ActionSheetProvider>
      <LoadingProvider>
        <AppProvider>
          <FavoritesProvider>
            <OrderProvider>
              <CartProvider>
                <DiscountProvider>
                <StatusBar hidden />
                <Stack screenOptions={{ headerShown: false }} />
                <WithLoadingHandler />
                <LoadingModal />
                <Toast config={toastConfig} />
                </DiscountProvider>
              </CartProvider>
            </OrderProvider>
          </FavoritesProvider>
        </AppProvider>
      </LoadingProvider>
      </ActionSheetProvider>
    </QueryClientProvider>
  );
}
