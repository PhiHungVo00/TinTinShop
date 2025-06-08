import { useEffect, useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { router } from "expo-router";
import HeaderList from "@/components/HeaderList";
import ItemCoupon from "@/components/ItemCoupon";
import EmptyState from "@/components/EmptyState";
import { getCoupons } from "@/config/api";
import { ICoupon } from "@/types/backend";
import { COLORS } from "@/util/constant";

const CouponScreen = () => {
  const [coupons, setCoupons] = useState<ICoupon[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    const res = await getCoupons();
    if (res.data) {
      setCoupons(res.data);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <HeaderList title="Coupons" backPress={() => router.back()} showAdd={false} />
      <FlatList
        data={coupons}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <ItemCoupon coupon={item} />}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={<EmptyState title="No coupons" description="" />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
});

export default CouponScreen;
